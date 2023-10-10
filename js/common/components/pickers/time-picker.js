import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
    withStyles
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        flexGrow: 1
    },
});


class TimePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: moment(props.value).local().format("HH:mm:00") // convert to local time on init
        }
    }

    render() {
        const {
            classes,
            value,
            onChange,
            helperText,
            label,
            disabled
        } = this.props;

        return ( <
            TextField
            // id="date"
            label = {
                label
            }
            type = "time"
            value = {
                this.state.value
            }
            className = {
                classes.textField
            }
            InputLabelProps = {
                {
                    shrink: true,
                }
            }
            helperText = {
                helperText
            }
            onChange = {
                (event) => {
                    this.setState({
                        value: event.target.value
                    })
                }
            }
            onBlur = {
                (event) => {
                    const dateString = moment(value).format("YYYY-MM-DD");
                    const newDateTime = moment(dateString + " " + this.state.value).utc().format("YYYY-MM-DD HH:mm:00"); // convert to UTC before passing back out of the component
                    onChange(event, newDateTime);
                }
            }
            disabled = {
                disabled
            }
            />
        );
    }
}

TimePicker.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(TimePicker);

// class TimePicker extends Component {
//     render() {
//         const { value, onChange, helperText, floatingLabelText, disabled } = this.props;
//         const newTime = (value !== "") ? moment(value).toDate() : "";
//         return (
//             <MaterialTimePicker
//                 floatingLabelText={floatingLabelText}
//                 helperText={helperText}
//                 value={newTime}
//                 onChange={(event, value) => { onChange(event, moment(value).format("YYYY-MM-DD HH:mm:00")) }}
//                 disabled={disabled}
//             />
//         );
//     }
// }

// TimePicker.propTypes = {
//     value: PropTypes.string.isRequired,
//     onChange: PropTypes.func.isRequired
// };

// export default TimePicker;