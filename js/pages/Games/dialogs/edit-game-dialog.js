import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button'; // v1.x
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import InputGroup from '../../../common/components/input-group.js';
import {
    PageProgressLoader
} from '../../../common/components/loading.js';

import * as GameData from '../../../data/games.js';

const AllPlatforms = [
    "ios",
    "android",
    "amazon",
    "aftb",
    "nook",
    "samsung",
    "android4",
    "steam"
];

class EditGameDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    componentDidMount = () => {
        if (this.props.game_id) {
            this.setState({
                loading: true
            });
            GameData.getByID(this.props.game_id).then(game => {
                this.setState({
                    loading: false,
                    ...game
                });
            });
        }
    }

    handleOpen = () => {
        this.setState({
            open: true
        });
    }

    handleClose = () => {
        console.log("Close");
        this.setState({
            open: false
        });
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    handleSubmit = () => {
        const game = {
            GameID: this.state.GameID,
            Tag: this.state.Tag,
            Title: this.state.Title,
            Status: "LIVE",
            Platforms: this.state.Platforms,
            AppleID: this.state.AppleID,
            GoogleID: this.state.GoogleID,
            Orientation: this.state.Orientation,
            IconLocation: this.state.IconLocation
        };
        GameData.update(game).then(result => {
            this.handleClose();
        });
    }

    handleDeprecate = () => {
        if (window.confirm("Are you sure you want to deprecate " + this.state.Title + "? It will no longer be visible from the NewsFlash Tool.") === true) {
            const game = {
                GameID: this.state.GameID,
                Status: "DEPRECATED"
            };
            GameData.update(game).then(result => {
                this.handleClose();
            });
        }
    }

    render() {
        const actions = [ <
            Button
            key = "cancel-btn"
            color = "primary"
            onClick = {
                this.handleClose
            } >
            Cancel <
            /Button>, <
            Button
            key = "submit-btn"
            color = "primary"
            onClick = {
                this.handleSubmit
            } >
            Submit <
            /Button>, <
            Button
            key = "deprecate-btn"
            color = "secondary"
            onClick = {
                this.handleDeprecate
            } >
            Deprecate <
            /Button>
        ];

        return ( <
            div >
            <
            IconButton onClick = {
                () => {
                    this.handleOpen()
                }
            } > < EditIcon / > < /IconButton> <
            Dialog open = {
                this.state.open
            }
            onClose = {
                this.handleClose
            } >
            <
            DialogTitle id = "form-dialog-title" > Edit Game < /DialogTitle>

            <
            DialogContent >
            <
            DialogContentText >
            Modify which settings apply to the chosen game.Game Tag cannot be changed once a game is created. <
            /DialogContentText> {
                (this.state.loading) ?
                <
                PageProgressLoader / >:
                    <
                    InputGroup fields = {
                        [{
                                type: "text",
                                label: "Tag",
                                value: this.state.Tag || "",
                                disabled: true
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
                                onChange: (event, key, value) => {
                                    this.setState({
                                        Orientation: value
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
                                },
                                style: {
                                    width: "300px"
                                }
                            }
                        ]
                    }
                />

            } <
            /DialogContent> <
            DialogActions > {
                actions
            } <
            /DialogActions> <
            /Dialog> <
            /div>
        );
    }
}

EditGameDialog.propTypes = {
    game_id: PropTypes.number
};

export default EditGameDialog;