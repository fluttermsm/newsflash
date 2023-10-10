import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button'; // v1.x
import IconMenu from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import * as SegmentData from '../../../data/segments.js';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import {
    withStyles
} from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonIcon from '@material-ui/icons/Person';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';

const styles = theme => ({
    // root: {
    //     display: 'flex',
    //     flexWrap: 'wrap',
    //     justifyContent: 'space-around',        
    // }
    cardContent: {
        marginTop: 0,
        paddingTop: 0
    }
});

const ITEM_HEIGHT = 48;

class EditableSegments extends Component {
    state = {
        open: false,
        anchorEl: undefined
    }

    handleRemoveSegment = (segmentID) => {
        let value = [].concat(this.props.Segments);
        let index = value.findIndex(id => {
            return id === segmentID
        });
        value.splice(index, 1);
        this.props.onChange({
            Segments: value
        });
    }

    handleAddSegment = (event) => {
        let segmentID = event.target.value;
        console.log(segmentID);

        let segments = this.props.Segments.slice(); // create copy
        segments.push(segmentID);

        this.handleMenuClose(event);
        this.props.onChange({
            Segments: segments
        });
    }

    handleMenuOpen = (event) => {
        this.setState({
            open: true,
            anchorEl: event.currentTarget
        });
    }

    handleMenuClose = (event) => {
        this.setState({
            open: false,
            anchorEl: undefined
        });
    }

    renderSegmentListItem = (segmentID) => {
        const segmentOption = this.props.segmentOptions.find(o => {
            return o.SegmentID === segmentID
        });
        return ( <
            ListItem key = {
                segmentID
            } >
            <
            ListItemText primary = {
                segmentOption.Name
            }
            secondary = {
                SegmentData.definitionAsString(segmentOption)
            }
            /> <
            ListItemSecondaryAction >
            <
            IconButton onClick = {
                () => {
                    this.handleRemoveSegment(segmentOption.SegmentID)
                }
            } >
            <
            DeleteIcon / >
            <
            /IconButton> <
            /ListItemSecondaryAction> <
            /ListItem>
        );
    }

    renderMenuItem = (segmentOption) => {
        return ( <
            MenuItem button key = {
                segmentOption.SegmentID
            }
            value = {
                segmentOption.SegmentID
            }
            onClick = {
                this.handleAddSegment
            } > {
                segmentOption.Name
            } <
            /MenuItem>
        );
    }

    render() {
        const {
            classes
        } = this.props;
        const unselectedSegmentOptions = this.props.segmentOptions.filter(o => this.props.Segments.indexOf(o.SegmentID) === -1);

        return ( <
            Card >
            <
            CardHeader title = {
                "Segments"
            }
            subheader = {
                "Who do you want to target?"
            }
            avatar = { < Avatar > < PersonIcon / > < /Avatar>}
                action = { <
                    IconButton
                    aria - label = "More"
                    aria - owns = {
                        open ? 'add-segment-menu' : null
                    }
                    aria - haspopup = "true"
                    onClick = {
                        this.handleMenuOpen
                    } >
                    <
                    MoreVertIcon / >
                    <
                    /IconButton>
                }
                /> <
                Menu
                id = "add-segment-menu"
                open = {
                    this.state.open
                }
                onClose = {
                    this.handleMenuClose
                }
                anchorEl = {
                    this.state.anchorEl
                }
                PaperProps = {
                    {
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: 200,
                        },
                    }
                } > {
                    unselectedSegmentOptions.map(this.renderMenuItem, this)
                } <
                /Menu>                   <
                CardContent className = {
                    classes.cardContent
                } >
                <
                List > {
                    (this.props.Segments.length > 0) ? this.props.Segments.map(this.renderSegmentListItem, this) : "Targeting Everyone"
                } <
                /List> <
                /CardContent>                  <
                /Card>
            );
        }
    }

    EditableSegments.propTypes = {
        onChange: PropTypes.func.isRequired
    };

    withStyles(styles)(EditableSegments);


    class EditableSegmentsContainer extends Component {
        state = {
            params: {}
        }

        load = () => {
            if (this.props.game_id) {
                SegmentData.getAllForGame(this.props.game_id).then(segments => {
                    this.setState({
                        segmentOptions: segments
                    });
                });
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

        render() {
                if (!this.state.segmentOptions) {
                    return ( < div > Loading < /div>);
                    }
                    else {
                        // pass all route params to nested components
                        return ( < EditableSegments reload = {
                                this.load
                            } { ...this.props
                            }
                            segmentOptions = {
                                this.state.segmentOptions
                            }
                            />);
                        }
                    }
                }

                EditableSegmentsContainer.propTypes = {
                    game_id: PropTypes.number.isRequired,
                    Segments: PropTypes.array.isRequired,
                    onChange: PropTypes.func.isRequired
                }

                export default withStyles(styles)(EditableSegmentsContainer);