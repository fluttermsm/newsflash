import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button'; // v1.x
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ErrorIcon from '@material-ui/icons/Error';

import {
    ListItemIcon
} from '@material-ui/core';

class ErrorDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true
        };
    }

    handleOpen = () => {
        this.setState({
            open: true
        });
    }
    handleClose = () => {
        this.props.clear();
    }

    render() {
        const isOpen = this.props.errors.length > 0;
        const actions = [ <
            Button
            key = {
                0
            }
            color = "primary"
            onClick = {
                this.handleClose
            } >
            Close < /Button>
        ];
        return ( <
            Dialog open = {
                isOpen
            }
            onClose = {
                this.handleClose
            } >
            <
            DialogTitle > {
                this.props.title || "Errors"
            } < /DialogTitle> <
            DialogContent >
            <
            List > {
                this.props.errors.map((e, i) => {
                    return <ListItem key = {
                            i
                        } >
                        <
                        ListItemIcon > < ErrorIcon / > < /ListItemIcon> <
                        ListItemText > {
                            e
                        } < /ListItemText> <
                        /ListItem>
                })
            } <
            /List>   <
            /DialogContent> <
            DialogActions > {
                actions
            } <
            /DialogActions> <
            /Dialog>
        );
    }
}

ErrorDialog.propTypes = {
    errors: PropTypes.array.isRequired,
    clear: PropTypes.func.isRequired,
    title: PropTypes.string
};

export default ErrorDialog;