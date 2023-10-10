import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import SegmentCondition from './segment-condition.js';
import {
    withStyles
} from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'

const styles = theme => ({
    selectLogic: {
        minWidth: '100px'
    },
    paper: {
        // marginBottom: "2px",
        position: "relative"
    },
    formControl: {
        marginBottom: "10px",
        display: "block"
    }
});

const defaultCondition = {
    property: "",
    operator: "==",
    value: ""
};

class Segment extends Component {
    addCondition = () => {
        const segment = this.props.segment;
        segment.Definition.conditions.push(defaultCondition);
        this.props.onChange(segment);
    }

    removeCondition = (index) => {
        const segment = this.props.segment;
        segment.Definition.conditions.splice(index, 1);
        this.props.onChange(segment);
    }

    handleTypeChange = (value) => {
        const segment = this.props.segment;
        segment.Definition.type = value;
        this.props.onChange(segment);
    }

    handlePropertyChange = (props, index) => {
        const segment = this.props.segment;
        segment.Definition.conditions[index] = props;
        this.props.onChange(segment);
    }

    handleNameChange = (value) => {
        const segment = this.props.segment;
        segment.Name = value;
        this.props.onChange(segment);
    }

    handleDescriptionChange = (value) => {
        const segment = this.props.segment;
        segment.Description = value;
        this.props.onChange(segment);
    }

    render() {
        const {
            segment,
            classes
        } = this.props;
        return ( <
            div >
            <
            div style = {
                {
                    padding: 0,
                    paddingRight: 20,
                    paddingBottom: 20,
                    paddingLeft: 10
                }
            } >
            <
            FormControl className = {
                classes.formControl
            } >
            <
            TextField label = {
                "Segment Name"
            }
            value = {
                segment.Name
            }
            onChange = {
                (event) => {
                    this.handleNameChange(event.target.value);
                }
            }
            /> <
            /FormControl> <
            FormControl className = {
                classes.formControl
            } >
            <
            TextField fullWidth label = {
                "Segment Description"
            }
            value = {
                segment.Description
            }
            onChange = {
                (event) => {
                    this.handleDescriptionChange(event.target.value);
                }
            }
            /> <
            /FormControl> <
            br / >
            <
            FormControl className = {
                classes.formControl
            } >
            <
            InputLabel htmlFor = "logicType" > Logic Type < /InputLabel> <
            Select className = {
                classes.selectLogic
            }
            value = {
                segment.Definition.type
            }
            onChange = {
                (event) => {
                    this.handleTypeChange(event.target.value)
                }
            } >
            <
            MenuItem key = {
                1
            }
            value = {
                "and"
            } > {
                "AND"
            } < /MenuItem> <
            MenuItem key = {
                2
            }
            value = {
                "or"
            } > {
                "OR"
            } < /MenuItem> <
            /Select> <
            /FormControl>                    {
                segment.Definition.conditions.map((condition, index) => {
                    return ( <
                        Paper className = {
                            classes.paper
                        }
                        square elevation = {
                            1
                        }
                        key = {
                            index
                        } >
                        <
                        IconButton tooltip = {
                            "Remove Condition"
                        }
                        style = {
                            {
                                position: 'relative',
                                float: 'right',
                                zIndex: 100
                            }
                        }
                        onClick = {
                            () => {
                                this.removeCondition(index)
                            }
                        } >
                        <
                        DeleteIcon / >
                        <
                        /IconButton> <
                        SegmentCondition segmentParams = {
                            this.props.segmentParams
                        }
                        operator = {
                            condition.operator
                        }
                        property = {
                            condition.property
                        }
                        value = {
                            condition.value
                        }
                        onChange = {
                            (props) => {
                                this.handlePropertyChange(props, index)
                            }
                        }
                        /> <
                        /Paper>
                    );
                })
            } <
            IconButton tooltip = {
                "Add New Condition"
            }
            onClick = {
                () => {
                    this.addCondition()
                }
            } >
            <
            AddIcon / >
            <
            /IconButton> <
            /div> <
            /div>
        );
    }
}

Segment.propTypes = {
    segmentParams: PropTypes.array.isRequired,
    segment: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(Segment);