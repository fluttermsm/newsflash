import React, {
    Component
} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import {
    withStyles
} from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
    close: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
    },
});

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            currentMessage: ""
        }
    }

    componentDidMount = () => {
        this.timer = setInterval(() => {
            this.handleNextMessage();
        }, 1500);
    }

    componentWillUnmount = () => {
        clearInterval(this.timer);
    }

    handleNextMessage = () => {
        let msgsRaw = window.localStorage.getItem("user_notifications");
        let msgs = [];
        if (msgsRaw !== null) {
            try {
                msgs = JSON.parse(msgsRaw);
            } catch (e) {
                console.log(e);
            }
        }

        if (msgs.length > 0) {
            let msg = msgs.shift();
            this.setState({
                open: true,
                currentMessage: msg
            });
            window.localStorage.setItem("user_notifications", JSON.stringify(msgs));
        } else {
            this.setState({
                open: false
            });
        }
    }

    handleRequestClose = () => {
        this.setState({
            open: false
        });
    };

    render() {
        const {
            classes
        } = this.props;

        if (this.state.currentMessage !== "") {
            return ( <
                div >
                <
                Snackbar open = {
                    this.state.open
                }
                message = {
                    this.state.currentMessage
                }
                action = {
                    [ <
                        IconButton
                        key = "close"
                        aria - label = "Close"
                        color = "inherit"
                        className = {
                            classes.close
                        }
                        onClick = {
                            this.handleRequestClose
                        } >
                        <
                        CloseIcon / >
                        <
                        /IconButton>,
                    ]
                }
                autoHideDuration = {
                    2000
                }
                onClose = {
                    this.handleRequestClose
                }
                /> <
                /div>
            );
        } else {
            return null;
        }

    }
}

export default withStyles(styles)(Notifications);