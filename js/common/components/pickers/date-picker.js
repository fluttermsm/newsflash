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
        display: "flex",
        flexGrow: 1
    },
});


class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: moment(props.value).local().format("YYYY-MM-DD")
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
            type = "date"
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
                    const timeString = moment(value).format("HH:mm:ss");
                    const newDateTime = moment(this.state.value + " " + timeString).utc().format("YYYY-MM-DD HH:mm:00");
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

DatePicker.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(DatePicker);

// class DatePicker extends Component {
//     render() {
//         const { value, onChange, helperText, floatingLabelText, disabled } = this.props;
//         const newTime = (value !== "") ? moment(value).toDate() : "";
//         return (
//             <MaterialDatePicker
//                 floatingLabelText={floatingLabelText}
//                 helperText={helperText}
//                 value={newTime}
//                 onChange={(event, value) => { onChange(event, moment(value).format("YYYY-MM-DD HH:mm:00")) }}
//                 disabled={disabled}
//             />
//         );
//     }
// }

// DatePicker.propTypes = {
//     value: PropTypes.string.isRequired,
//     onChange: PropTypes.func.isRequired
// };

// export default DatePicker;