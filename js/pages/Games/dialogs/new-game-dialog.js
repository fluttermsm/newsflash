import React, {
    Component
} from 'react';
import Button from '@material-ui/core/Button'; // v1.x
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import InputGroup from '../../../common/components/input-group.js';

import * as GameData from '../../../data/games.js';
import {
    DialogContentText
} from '@material-ui/core';

const AllPlatforms = ["ios", "android", "amazon", "aftb", "nook", "samsung", "android4"];

const styles = {
    dialog: {
        minWidth: "500px"
    }
}

class NewGameDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    handleOpen = () => {
        this.setState({
            open: true
        });
    }

    handleClose = () => {
        this.setState({
            open: false
        });
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    handleSubmit = () => {
        const game = {
            Tag: this.state.Tag,
            Title: this.state.Title,
            Status: "LIVE",
            Platforms: this.state.Platforms,
            AppleID: this.state.AppleID,
            GoogleID: this.state.GoogleID,
            Orientation: this.state.Orientation,
            IconLocation: this.state.IconLocation
        };
        GameData.add(game).then(result => {
            this.handleClose();
        });
    }

    render() {
        const actions = [ <
            Button
            key = {
                0
            }
            color = "primary"
            onClick = {
                this.handleClose
            } >
            Cancel < /Button>, <
            Button
            key = {
                1
            }
            color = "primary"
            onClick = {
                this.handleSubmit
            } >
            Submit < /Button>,
        ];

        return ( <
            div >
            <
            Button onClick = {
                this.handleOpen
            } > Add < /Button> <
            Dialog title = "Create New Game"
            open = {
                this.state.open
            }
            onClose = {
                this.handleClose
            }
            style = {
                styles.dialog
            } >
            <
            DialogContent >
            <
            DialogTitle > Create New Game < /DialogTitle> <
            DialogContentText >
            Game Tag cannot be changed once a game is created.Use snake_case.This will be the identifier used by game client to request newsflash items. <
            /DialogContentText> <
            InputGroup fields = {
                [{
                        type: "text",
                        label: "Tag",
                        value: this.state.Tag || "",
                        onChange: (event) => {
                            let sanitized = event.target.value.toLowerCase().replace(/ /g, ''); // lowercase and strip out spaces
                            this.setState({
                                Tag: sanitized
                            });
                        }
                    },
                    {
                        type: "text",
                        label: "Title",
                        value: this.state.Title || "",
                        onChange: (event) => {
                            this.setState({
                                Title: event.target.value
                            });
                        }
                    },
                    {
                        type: "checkbox-group",
                        label: "Platforms",
                        options: AllPlatforms.map(platform => {
                            let isEnabled = (this.state.Platforms && this.state.Platforms.findIndex(p => {
                                return p === platform
                            }) > -1);
                            return {
                                label: platform,
                                checked: isEnabled,
                                onCheck: (event, checked) => {
                                    let tmpPlatforms = [].concat(this.state.Platforms);
                                    if (checked && !isEnabled) {
                                        tmpPlatforms.push(platform);
                                    } else if (!checked && isEnabled) {
                                        tmpPlatforms.splice(tmpPlatforms.findIndex(x => x === platform), 1);
                                    }
                                    this.setState({
                                        Platforms: tmpPlatforms
                                    });
                                }
                            }
                        })
                    },
                    {
                        type: "select",
                        label: "Orientation",
                        value: this.state.Orientation || "Landscape",
                        options: [{
                                label: "Landscape",
                                value: "Landscape"
                            },
                            {
                                label: "Portrait",
                                value: "Portrait"
                            }
                        ],
                        onChange: (event) => {
                            this.setState({
                                Orientation: event.target.value
                            });
                        }
                    },
                    {
                        type: "text",
                        label: "IconLocation",
                        value: this.state.IconLocation || "",
                        fullWidth: true,
                        onChange: (event) => {
                            this.setState({
                                IconLocation: event.target.value
                            });
                        }
                    }
                ]
            }
            /> <
            DialogActions > {
                actions
            } <
            /DialogActions> <
            /DialogContent>                     <
            /Dialog> <
            /div>
        );
    }
}

NewGameDialog.propTypes = {

};

export default NewGameDialog;