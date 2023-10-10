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
import InputGroup from '../../../common/components/input-group.js';
import * as PlacementData from '../../../data/placements.js';
import {
    withStyles
} from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    textInput: {
        marginBottom: "10px"
    },
    select: {
        marginBottomn: "10px"
    }
});

class NewPlacementDialog extends Component {
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
        const placement = {
            GameID: this.props.game_id,
            Tag: this.state.Tag,
            Description: this.state.Description,
            Category: this.state.Category || 'primary',
            Platform: "All"
        };
        PlacementData.add(placement).then(result => {
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
            Dialog open = {
                this.state.open
            }
            onClose = {
                this.handleClose
            } >
            <
            DialogTitle >
            Create New Placement <
            /DialogTitle> <
            DialogContent >
            <
            DialogContentText >
            Create a new placement name(using snake_case formatting).This value will be passed from the game client to retrieve related announcements. <
            /DialogContentText> <
            br / >
            <
            InputGroup fields = {
                [{
                        type: "text",
                        label: "GameID",
                        disabled: true,
                        value: this.props.game_id || ""
                    },
                    {
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
                        label: "Description",
                        value: this.state.Description || "",
                        onChange: (event) => {
                            this.setState({
                                Description: event.target.value
                            });
                        }
                    },
                    {
                        type: "select",
                        label: "Category",
                        value: this.state.Category || "primary",
                        options: [{
                                label: "primary",
                                value: "primary"
                            },
                            {
                                label: "secondary",
                                value: "secondary"
                            },
                            {
                                label: "testing",
                                value: "testing"
                            }
                        ],
                        onChange: (event) => {
                            this.setState({
                                Category: event.target.value
                            });
                        }
                    }
                ]
            }
            /> <
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

NewPlacementDialog.propTypes = {
    game_id: PropTypes.number.isRequired
};

export default withStyles(styles)(NewPlacementDialog);