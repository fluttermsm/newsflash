import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import ImageIcon from '@material-ui/icons/Image';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import {
    withStyles
} from '@material-ui/core/styles';

import * as AdIconData from '../../../data/ad_icons.js';

import {
    S3URLFromKey
} from '../../../constants.js';

import './editable-icon.css';

// import { EditorModeComment } from '@material-ui/icons/Add';

var moment = require('moment');

const MIN_WIDTH = 128;
const MAX_WIDTH = 250;
const MaxFileSize = 100000; // 100k

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    iconImage: {
        border: 0,
        width: "170px",
        height: "170px"
    },
    icon: {
        width: "175px",
        height: "175px"
    },
    iconContainer: {
        padding: theme.spacing.unit * 2,
    },
    rootContainer: {

    },
    gridList: {
        // display: 'flex',
        // flexWrap: 'wrap',
        height: '235px',
        overflowY: 'scroll'
    },
    gridContainerLeft: {
        width: "175px"
    },
    gridContainerRight: {
        flexGrow: 4
    }
});

class EditableIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            iconID: this.props.Icon,
            dependantAnnouncements: []
        };
        AdIconData.getDependantAnnouncements(this.props.Icon).then(result => {
            this.setState({
                dependantAnnouncements: result
            });
        });
    }

    handleOpen = () => {
        this.setState({
            open: true
        });
    };

    handleClose = () => {
        this.setState({
            open: false
        });
    };

    handleClick = (event) => {
        console.log(event);
    }

    handleFileSelect = (event) => {
        this.handleFiles(event.target.files);
    }

    handleFileDrop = (fileListObj, event) => {
        this.handleFiles(fileListObj);
    }

    handleFiles = (fileListObj) => {
        const files = this.fileListToArray(fileListObj);
        const invalidSizes = files.filter(file => {
            return !this.isValidFileSize(file)
        });
        const invalidTypes = files.filter(file => {
            return !this.isValidFileType(file)
        });

        if (invalidSizes.length > 0) {
            alert(invalidSizes.length + ' of your files are larger than the max size of ' + this.props.maxFileSize);
        }
        if (invalidTypes.length > 0) {
            alert(invalidTypes.length + ' of your files are of invalid types. Valid types are ' + this.props.validFileTypes.join(", "));
        }

        // if types and sizes are valid, let's check if the dimensions are okay.
        if (files.length > 0 && invalidSizes.length === 0 && invalidTypes.length === 0) {
            Promise.all(files.map(this.isValidFileDimension)).then(values => {
                if (values.indexOf(false) === -1) {
                    this.uploadFiles(files);
                } else {
                    // Find the first offending file. 
                    let badFile = files[values.indexOf(false)];
                    alert(badFile.name + " has invalid dimensions. Icon files must be square and between 128x128 and 512x512");
                }
            });

        }
    }

    // Helpers
    isValidFileSize = (file) => {
        return file.size <= MaxFileSize;
    }

    isValidFileType = (file) => {
        if (this.props.validFileTypes) {
            return this.props.validFileTypes.indexOf(file.type) !== -1
        }
        return true;
    }

    isValidFileDimension = (file) => {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = function() {
                if (this.width === this.height && this.width >= MIN_WIDTH && this.width <= MAX_WIDTH) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
            img.onerror = function() {
                reject(file);
            }
            img.src = window.URL.createObjectURL(file);
        });
    }

    fileListToArray = (filesObj) => {
        const filesArr = [];
        for (var i = 0; i < filesObj.length; i++) {
            filesArr.push(filesObj[i]);
        }
        return filesArr;
    }

    uploadFiles = (files) => {
        try {
            AdIconData.add(this.props.GameID, files).then(this.props.reload);
        } catch (e) {
            console.log("Exception uploading icon");
        }
    }

    handleSelect = () => {
        if (this.props.onChange) {
            this.props.onChange({
                'Icon': this.state.iconID
            });
            this.setState({
                open: false
            });
        }
    }

    handleIconClick = (iconID) => {
        if (this.props.onChange) {
            this.props.onChange({
                Icon: iconID
            });

            AdIconData.getDependantAnnouncements(iconID).then(result => {
                this.setState({
                    dependantAnnouncements: result
                });
            });
        }
    }

    getIconByID = (iconID) => {
        const index = this.props.ad_icons.findIndex(icon => (icon.ID === iconID));
        if (index > -1) {
            return this.props.ad_icons[index];
        } else {
            return false;
        }
    }

    getUrlByIconID = (iconID) => {
        const icon = this.getIconByID(iconID);
        if (icon) {
            return S3URLFromKey(icon.URL);
        } else {
            return "";
        }
    }

    deleteIcon = (iconID) => {
        AdIconData.remove(iconID).then(res => {
            this.props.reload();
        });
    }

    archiveIcon = (iconID) => {
        const icon = this.getIconByID(iconID);
        if (icon) {
            AdIconData.archive(icon).then(x => {
                this.props.reload();
            });
        }
    }

    numDependantAnnouncements = () => {
        return this.state.dependantAnnouncements.length;
    }

    numDependantAnnouncementsInactive = () => {
        return this.state.dependantAnnouncements.filter(ann => {
            // check if announcement is inactive
            let nowUtc = moment().utc();
            return (moment(ann.ServerEnd) <= nowUtc && moment(ann.ServerStart) <= nowUtc) || ann.Status === "ARCHIVED";
        }).length;
    }

    numDependantAnnouncementsActive = () => {
        return this.state.dependantAnnouncements.filter(ann => {
            // check if announcements are active 
            let nowUtc = moment().utc();
            return (moment(ann.ServerEnd) >= nowUtc || ann.ServerEnd === null);
        }).length;
    }

    render() {
            const {
                classes
            } = this.props;
            let iconButton;
            let activeDependancies = this.numDependantAnnouncementsActive();
            let inactiveDependancies = this.numDependantAnnouncementsInactive();

            if (activeDependancies === 0) {
                iconButton = ( < Button variant = "contained"
                    color = "primary"
                    onClick = {
                        () => {
                            this.archiveIcon(this.props.Icon);
                        }
                    } > Archive < /Button>);
                }
                else {
                    iconButton = < p > Unable to archive because of dependancies. < /p>
                }
                return ( <
                    Card >
                    <
                    CardHeader title = {
                        "Icon"
                    }
                    subheader = {
                        "Select Icon for Native Ads"
                    }
                    avatar = { < Avatar > < ImageIcon / > < /Avatar>}  /
                        >
                        <
                        CardContent >
                        <
                        Grid
                        container
                        direction = "row"
                        justify = 'flex-start'
                        className = {
                            classes.rootContainer
                        } >
                        <
                        Grid item xs className = {
                            classes.gridContainerLeft
                        } >
                        <
                        Paper className = {
                            classes.icon
                        } >
                        <
                        img alt = {
                            this.getIconByID(this.props.Icon).Description
                        }
                        src = {
                            this.getUrlByIconID(this.props.Icon)
                        }
                        className = {
                            classes.iconImage
                        }
                        title = {
                            this.getIconByID(this.props.Icon).Description
                        }
                        />  <
                        p > {
                            this.numDependantAnnouncements()
                        }
                        use. < br / > {
                            activeDependancies
                        } < strong > active. < /strong> <br/ > {
                            inactiveDependancies
                        } < strong > inactive. < /strong> <
                        /p> {
                            iconButton
                        } <
                        /Paper> <
                        /Grid> <
                        Grid item xs className = {
                            classes.gridContainerRight
                        } >
                        <
                        input accept = "image/*"
                        type = "file"
                        name = "img"
                        multiple onChange = {
                            this.handleFileSelect
                        }
                        /> <
                        Grid
                        container
                        direction = "row"
                        justify = "flex-start"
                        alignItems = "flex-start"
                        spacing = {
                            0
                        }
                        className = {
                            classes.gridList
                        } >
                        {
                            this.props.ad_icons.filter(a => {
                                return a.Status === "ACTIVE"
                            }).sort((a, b) => {
                                return a.URL < b.URL ? -1 : 1
                            }).map((icon, index) => ( <
                                Grid key = {
                                    index
                                }
                                className = {
                                    classes.iconContainer
                                } >
                                <
                                Paper onClick = {
                                    () => {
                                        this.handleIconClick(icon.ID)
                                    }
                                }
                                style = {
                                    {
                                        cursor: 'pointer',
                                        width: 65
                                    }
                                } >
                                <
                                img title = {
                                    S3URLFromKey(icon.URL)
                                }
                                style = {
                                    {
                                        width: 60,
                                        height: 60
                                    }
                                }
                                src = {
                                    S3URLFromKey(icon.URL)
                                }
                                alt = {
                                    icon.Description
                                }
                                /> <
                                /Paper>           <
                                /Grid>                          
                            ))
                        } <
                        /Grid> <
                        /Grid> <
                        /Grid>                     <
                        /CardContent> <
                        /Card>
                    )
                }

                // render() {
                //     const { classes } = this.props;
                //     let iconButton;
                //     let activeDependancies = this.numDependantAnnouncementsActive();
                //     let inactiveDependancies = this.numDependantAnnouncementsInactive();

                //     if(activeDependancies === 0) {
                //         iconButton = (<Button variant="contained" color="primary" onClick={() => { this.archiveIcon(this.props.Icon); }}>Archive</Button>);
                //     } else {
                //         iconButton = <p>Unable to archive because of dependancies.</p>
                //     }
                //     return (
                //         <Card>
                //             <CardHeader
                //                 title={"Icon"}
                //                 subheader={"Select Icon for Native Ads"}
                //                 avatar={<Avatar icon={<ImageIcon />} />}
                //             />
                //             <CardContent className={classes.container}>
                //                 <div style={{ width: 250, float: 'left' }}>
                //                     <Paper style={classes.icon}>
                //                         <img alt={this.getIconByID(this.props.Icon).Description} src={this.getUrlByIconID(this.props.Icon)} style={{ border: 0, width: 220, height: 220 }} title={this.getIconByID(this.props.Icon).Description} /> 
                //                         <p>
                //                             Used in {this.numDependantAnnouncements()} announcements. <br/>
                //                             Used in {activeDependancies} <strong>active</strong> announcements. <br/>
                //                             Used in {inactiveDependancies} <strong>inactive</strong> announcements.
                //                         </p>
                //                         {iconButton}  
                //                     </Paper>
                //                 </div>
                //                 <div style={{ marginLeft: 240 }}>
                //                     <div style={{
                //                         display: 'flex',
                //                         flexWrap: 'wrap',
                //                         justifyContent: 'space-around',
                //                     }}>
                //                         {/* <FileDrop
                //                             frame={document}
                //                             targetAlwaysVisible={true}
                //                             onDrop={this.handleFileDrop}
                //                         >
                //                             Drop New Icons or ( <input accept="image/*" type="file" name="img" multiple onChange={this.handleFileSelect} /> )
                //                         </FileDrop> */}
                //                         {/* <div className={classes.gridList}>
                //                             {this.props.ad_icons.filter(a => {return a.Status === "ACTIVE"}).sort((a,b) => {return a.URL < b.URL ? -1 : 1}).map((icon, index) => (
                //                                 <Paper className={classes.iconContainer} onClick={() => { this.handleIconClick(icon.ID) }} style={{ cursor: 'pointer', width:65 }}>
                //                                     <img title={S3URLFromKey(icon.URL)} style={{ width: 60, height: 60 }} src={S3URLFromKey(icon.URL)} alt={icon.Description} />
                //                                 </Paper>                                    
                //                             ))}
                //                         </div> */}
                //                         {/* <GridList
                //                             style={{ overflowY: 'auto', marginTop: 5, height: 253}}
                //                             cellHeight={'auto'}
                //                             cellWidth={'auto'}
                //                             cols={3}
                //                             >
                //                             {this.props.ad_icons.filter(a => {return a.Status === "ACTIVE"}).sort((a,b) => {return a.URL < b.URL ? -1 : 1}).map((icon, index) => (
                //                                 <GridListTile
                //                                     key={index}
                //                                     title={icon.Name}
                //                                     style={{ padding: 1 }}>
                //                                     <Paper onClick={() => { this.handleIconClick(icon.ID) }} style={{ cursor: 'pointer', width:65 }}>
                //                                         <img title={S3URLFromKey(icon.URL)} style={{ width: 60, height: 60 }} src={S3URLFromKey(icon.URL)} alt={icon.Description} />
                //                                     </Paper>
                //                                 </GridListTile>
                //                             ))}
                //                         </GridList> */}
                //                     </div>
                //                 </div>
                //                 {/*<ClearFix />*/}
                //             </CardContent>
                //         </Card >
                //     );
                // }
            }

            EditableIcon.propTypes = {
                onChange: PropTypes.func.isRequired
            };

            withStyles(styles)(EditableIcon);

            class EditableIconContainer extends Component {
                state = {
                    params: {}
                }

                load = () => {
                    if (this.props.GameID) {
                        AdIconData.getAllForGame(this.props.GameID).then(this.onLoaded);
                    }
                }

                componentDidMount() {
                    this.load();
                }

                componentWillReceiveProps(nextProps) {
                    if (nextProps.params) {
                        this.setState({
                            params: nextProps.params
                        });
                    }
                }

                onLoaded = (ad_icons) => {
                    this.setState({
                        ad_icons: ad_icons.filter(ann => ann.Status === "ACTIVE")
                    });
                }

                onCancel = () => {

                }

                render() {
                        if (!this.state.ad_icons) {
                            return ( < div > Loading < /div>);
                            }
                            else {
                                // pass all route params to nested components
                                return ( < EditableIcon reload = {
                                        this.load
                                    } { ...this.props
                                    }
                                    ad_icons = {
                                        this.state.ad_icons
                                    }
                                    />);
                                }
                            }
                        }

                        EditableIconContainer.propTypes = {
                            GameID: PropTypes.number.isRequired,
                            onChange: PropTypes.func.isRequired
                        }

                        export default withStyles(styles)(EditableIconContainer);