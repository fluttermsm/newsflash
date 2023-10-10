import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import TextInput from './ui/text-input';
import NumberInput from './ui/number-input';

const styles = {
    inputItem: {
        marginBottom: "10px",
        display: "block"
    }

}

class InputGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderMenuItem = (option, index) => {
        return ( < MenuItem key = {
                index
            }
            value = {
                option.value
            } > {
                option.label
            } < /MenuItem>);
        }

        renderInputField = (field, index) => {
            switch (field.type) {
                case "text":
                    return ( <
                        TextInput style = {
                            styles.inputItem
                        }
                        key = {
                            index
                        }
                        label = {
                            field.label
                        }
                        value = {
                            field.value
                        }
                        onChange = {
                            field.onChange
                        }
                        disabled = {
                            field.disabled || false
                        }
                        fullWidth = {
                            field.fullWidth || false
                        }
                        />
                    );


                case "number":
                    return ( <
                        NumberInput style = {
                            styles.inputItem
                        }
                        key = {
                            index
                        }
                        label = {
                            field.label
                        }
                        value = {
                            field.value
                        }
                        onChange = {
                            field.onChange
                        }
                        disabled = {
                            field.disabled || false
                        }
                        />
                    );


                case "select":
                    return ( <
                        FormControl key = {
                            index
                        }
                        style = {
                            styles.inputItem
                        } >
                        <
                        InputLabel htmlFor = {
                            field.label
                        } > {
                            field.label
                        } < /InputLabel> <
                        Select value = {
                            field.value
                        }
                        onChange = {
                            field.onChange
                        }
                        disabled = {
                            field.disabled || false
                        } >
                        {
                            field.options.map((option, index) => this.renderMenuItem(option, index))
                        } <
                        /Select> <
                        /FormControl>

                    );


                case "checkbox-group":
                    return ( <
                        div key = {
                            index
                        }
                        style = {
                            styles.inputItem
                        } >
                        {
                            field.label
                        } {
                            field.options.map((option, idx) => {
                                return ( <
                                    FormGroup row key = {
                                        idx
                                    } >
                                    <
                                    FormControlLabel control = { <
                                        Checkbox
                                        checked = {
                                            option.checked
                                        }
                                        onChange = {
                                            option.onCheck
                                        }
                                        // value="checkedB"
                                        color = "primary" /
                                        >
                                    }
                                    label = {
                                        option.label
                                    }
                                    /> <
                                    /FormGroup>                                    
                                );
                            })
                        } <
                        /div>
                    );


                default:
                    return ( <
                        TextInput style = {
                            styles.inputItem
                        }
                        key = {
                            index
                        }
                        label = {
                            field.label
                        }
                        value = {
                            field.value
                        }
                        onChange = {
                            field.onChange
                        }
                        disabled = {
                            field.disabled || false
                        }
                        fullWidth = {
                            field.fullWidth || false
                        }
                        />
                    );
            }
        }

        render() {
            return ( <
                div > {
                    this.props.fields.map((field, index) => this.renderInputField(field, index))
                } <
                /div>
            );
        }
    }

    InputGroup.propTypes = {
        fields: PropTypes.array.isRequired
    };

    export default InputGroup;