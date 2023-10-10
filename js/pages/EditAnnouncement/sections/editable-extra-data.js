import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Switch from '@material-ui/core/Switch';;
import Avatar from '@material-ui/core/Avatar';
import CodeIcon from '@material-ui/icons/Code';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class ExtraData extends Component {
    state = {
        error: "",
        enabled: false
    }

    handleToggle = (event, enabled) => {
        if (enabled) {
            this.props.onChange({
                ExtraData: "{}"
            });
        } else {
            this.props.onChange({
                ExtraData: null
            });
        }
    }

    handleDataChange = (event) => {
        const value = event.target.value;
        try {
            JSON.parse(value);
            this.setState({
                error: ""
            });
        } catch (e) {
            this.setState({
                error: e.message
            });
        }
        this.props.onChange({
            ExtraData: value
        });
    }

    render() {
        const enabled = (this.props.ExtraData && this.props.ExtraData !== null);

        return ( <
            div >
            <
            Card >
            <
            CardHeader title = {
                "Custom Data"
            }
            subheader = {
                "Extra in-game JSON Data"
            }
            avatar = { < Avatar > < CodeIcon / > < /Avatar>}
                action = { < FormControlLabel
                    control = { <
                        Switch
                        checked = {
                            enabled
                        }
                        onChange = {
                            this.handleToggle
                        }
                        />
                    }
                    label = "Enable Extra Data" /
                    >
                }
                />                     <
                CardContent > {
                    (enabled === true) ?
                    <
                    TextField
                    helperText = "Enter JSON Data"
                    multiline = {
                        true
                    }
                    fullWidth
                    value = {
                        this.props.ExtraData
                    }
                    onChange = {
                        this.handleDataChange
                    }
                    /> :
                        <
                        div > No Data < /div>
                }

                <
                /CardContent> <
                /Card> <
                /div>
            );
        }
    }

    ExtraData.propTypes = {
        onChange: PropTypes.func.isRequired
    };

    export default ExtraData;