import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import Avatar from '@material-ui/core/Avatar';
import SettingsIcon from '@material-ui/icons/Settings';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import {
    withStyles
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';

import DatePicker from '../../../common/components/pickers/date-picker.js';
import TimePicker from '../../../common/components/pickers/time-picker.js';
import * as AnnouncementData from '../../../data/announcements.js';
import moment from 'moment';


const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit * 2,
        width: "300px"
    },
    formControlDateTime: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        width: "300px",
        margin: theme.spacing.unit * 2,
        columnGap: "10px"
    },
    formControlFill: {
        margin: theme.spacing.unit * 2,
        flexGrow: 1
    },
    formControlWide: {
        margin: theme.spacing.unit * 2,
        width: "100%"
    },
    formGroup: {
        margin: `${theme.spacing.unit}px 0`,
    },
});

class EditableAnnouncement extends Component {
    handlePermanentToggle = (input, toggled) => {
        if (toggled) {
            this.props.onChange({
                ServerEnd: null
            });
        } else {
            this.props.onChange({
                ServerEnd: moment().add(1, "weeks").format("YYYY-MM-DD 11:00:00")
            });
        }
    }

    handleStartDateChange = (event, value) => {
        this.props.onChange({
            ServerStart: value
        });
    }

    handleEndDateChange = (event, value) => {
        this.props.onChange({
            ServerEnd: value
        });
    }

    handleTitleChange = (event) => {
        this.props.onChange({
            Title: event.target.value
        });
    }

    handleStatusChange = (event) => {
        this.props.onChange({
            Status: event.target.value
        });
    }

    handleUrlChange = (event) => {
        this.props.onChange({
            URL: event.target.value
        });
    }
    render() {
            const {
                Title,
                ServerStart,
                ServerEnd,
                Status,
                URL,
                classes
            } = this.props;

            const statusOptions = AnnouncementData.ValidStatuses.map((status, index) => {
                return <MenuItem key = {
                    index
                }
                value = {
                    status
                } > {
                    status
                } < /MenuItem>
            });

            const permanentToggle = (this.props.ServerEnd === null)

            return ( <
                Card >
                <
                CardHeader title = {
                    "Announcement Settings"
                }
                subheader = {
                    "Status and Schedule"
                }
                avatar = { < Avatar > < SettingsIcon / > < /Avatar>} / >
                    <
                    CardContent className = {
                        classes.container
                    } >
                    <
                    FormControl className = {
                        classes.formControl
                    } >
                    <
                    TextField
                    fullWidth
                    label = "Name"
                    helperText = "Announcement Name"
                    value = {
                        Title
                    }
                    onChange = {
                        this.handleTitleChange
                    }
                    /> <
                    /FormControl>                         <
                    FormControl className = {
                        classes.formControl
                    } >
                    <
                    InputLabel > Status < /InputLabel> <
                    Select
                    value = {
                        Status
                    }
                    onChange = {
                        this.handleStatusChange
                    } >
                    {
                        statusOptions
                    } <
                    /Select> <
                    /FormControl> <
                    FormControl className = {
                        classes.formControlFill
                    } >
                    <
                    FormControlLabel
                    control = { <
                        Switch
                        checked = {
                            permanentToggle
                        }
                        onChange = {
                            this.handlePermanentToggle
                        }
                        />
                    }
                    label = "Run indefinitely?" /
                    >
                    <
                    /FormControl> <
                    FormControl className = {
                        classes.formControlDateTime
                    } >
                    <
                    DatePicker
                    label = "Start Date"
                    helperText = "Start Date"
                    value = {
                        ServerStart
                    }
                    onChange = {
                        this.handleStartDateChange
                    }
                    firstDayOfWeek = {
                        0
                    }
                    /> <
                    TimePicker
                    label = "Start Time"
                    helperText = "Start Time"
                    value = {
                        ServerStart
                    }
                    onChange = {
                        this.handleStartDateChange
                    }
                    /> <
                    /FormControl>                    {
                        !permanentToggle &&
                            <
                            FormControl className = {
                                classes.formControlDateTime
                            } >
                            <
                            DatePicker
                        label = "End Date"
                        helperText = "End Date"
                        value = {
                            ServerEnd
                        }
                        onChange = {
                            this.handleEndDateChange
                        }
                        firstDayOfWeek = {
                            0
                        }
                        /> <
                        TimePicker
                        label = "End Time"
                        helperText = "End Time"
                        value = {
                            ServerEnd
                        }
                        onChange = {
                            this.handleEndDateChange
                        }
                        /> <
                        /FormControl>}                              <
                        FormControl className = {
                            classes.formControlWide
                        }
                        fullWidth >
                            <
                            TextField
                        label = "URL"
                        helperText = "Click URL or Deep Link"
                        value = {
                            URL || ""
                        }
                        onChange = {
                            this.handleUrlChange
                        }
                        fullWidth
                            /
                            >
                            <
                            /FormControl>                  <
                            /CardContent> <
                            /Card>
                    );
                }
            }

            EditableAnnouncement.propTypes = {
                onChange: PropTypes.func.isRequired,
                Title: PropTypes.string.isRequired,
                ServerStart: PropTypes.any,
                ServerEnd: PropTypes.any,
                Status: PropTypes.string.isRequired
            };

            export default withStyles(styles)(EditableAnnouncement);