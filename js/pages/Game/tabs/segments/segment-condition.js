import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import {
    withStyles
} from '@material-ui/core/styles';

const styles = theme => ({
    seletProperty: {
        minWidth: '200px',
        marginRight: '15px'
    },
    selectOperator: {
        minWidth: '50px',
        marginRight: '15px'
    },
    inputValue: {
        minWidth: '150px',
        marginRight: '15px'
    },
    formControl: {
        paddingTop: '5px',
        paddingBottom: '5px'
    }
});

const validOperators = ["==", "!=", "in", ">", "<", ">=", "<="];

class SegmentCondition extends Component {

    handleParamChange = (event) => {
        this.handleChange({
            param: event.target.value
        });
    }

    handleOperatorChange = (event) => {
        this.handleChange({
            operator: event.target.value
        });
    }

    handleValueChange = (event) => {
        this.handleChange({
            value: event.target.value
        });
    }

    handleChange = (obj) => {
        if (this.props.onChange) {
            this.props.onChange(Object.assign({}, {
                operator: this.props.operator,
                value: this.props.value,
                property: this.props.property
            }, obj));
        }
    }

    render() {
            const {
                classes
            } = this.props;
            return ( <
                div style = {
                    {
                        position: 'relative',
                        padding: 5
                    }
                } >
                <
                FormControl className = {
                    classes.formControl
                } >
                <
                Select className = {
                    classes.seletProperty
                }
                value = {
                    this.props.property
                }
                onChange = {
                    (event) => {
                        this.handleChange({
                            property: event.target.value
                        })
                    }
                } > {
                    this.props.segmentParams.map((sp, index) => {
                            return ( < MenuItem key = {
                                    index
                                }
                                value = {
                                    sp.param
                                } > {
                                    sp.param
                                } < /MenuItem>);
                            })
                    } <
                    /Select>                     <
                    /FormControl> <
                    FormControl className = {
                        classes.formControl
                    } >
                    <
                    Select className = {
                        classes.selectOperator
                    }
                    value = {
                        this.props.operator
                    }
                    onChange = {
                        (event) => {
                            this.handleChange({
                                operator: event.target.value
                            })
                        }
                    } > {
                        validOperators.map((op, index) => {
                                return ( < MenuItem key = {
                                        index
                                    }
                                    value = {
                                        op
                                    } > {
                                        op
                                    } < /MenuItem>);
                                })
                        } <
                        /Select> <
                        /FormControl> <
                        FormControl className = {
                            classes.formControl
                        } >
                        <
                        TextField className = {
                            classes.inputValue
                        }
                        placeholder = {
                            "value to compare"
                        }
                        value = {
                            this.props.value
                        }
                        onChange = {
                            this.handleValueChange
                        }
                        /> <
                        /FormControl> <
                        /div>
                    );
                }
            }

            SegmentCondition.propTypes = {
                onChange: PropTypes.func.isRequired,
                operator: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
                property: PropTypes.string.isRequired
            };

            export default withStyles(styles)(SegmentCondition);