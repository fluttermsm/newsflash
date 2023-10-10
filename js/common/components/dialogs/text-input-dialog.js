import React, {
    Component
} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button'; // v1.x
import TextInput from '../ui/text-input';
import {
    DialogActions
} from '@material-ui/core';


export default class TextInputDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
    }

    componentDidMount = () => {
        if (this.props.text) {
            this.setState({
                value: this.props.text
            });
        }
    }

    onChange = (event) => {
        this.setState({
            value: event.target.value
        });
    }

    render() {
        const {
            title,
            helperText,
            inputLabel,
            open,
            handleCancel,
            handleSubmit,
            textFieldWidth,
            description
        } = this.props;
        const {
            value
        } = this.state;
        const tfWidth = textFieldWidth || 250;

        const actions = [ <
            Button
            key = {
                0
            }
            color = "primary"
            onClick = {
                handleCancel
            } >
            Cancel < /Button>, <
            Button
            key = {
                1
            }
            color = "primary"
            onClick = {
                () => handleSubmit(value)
            } >
            Submit < /Button>,

        ];

        return ( <
            div >
            <
            Dialog actions = {
                actions
            }
            open = {
                open
            }
            onClose = {
                handleCancel
            } >
            <
            DialogTitle id = "form-dialog-text" > {
                title
            } < /DialogTitle> <
            DialogContent > {
                (description !== 'undefined') && < DialogContentText > {
                    description
                } < /DialogContentText>} <
                TextInput
                style = {
                    {
                        width: tfWidth
                    }
                }
                helperText = {
                    helperText
                }
                label = {
                    inputLabel
                }
                value = {
                    value
                }
                onChange = {
                    this.onChange
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