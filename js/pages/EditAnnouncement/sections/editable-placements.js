import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import ListIcon from '@material-ui/icons/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button'; // v1.x
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import BaseComponent from '../../../common/components/BaseComponent.js';

class EditablePlacements extends BaseComponent {
    state = {
        selectedFrequencyUnits: {}
    };

    addNewPlacement = () => {
        if (this.getNextAvailablePlacement() === false) {
            alert("No more placements available. All placements are in use.");
        } else {
            const newData = [...this.props.Placements];
            newData.push({
                placement_id: this.getNextAvailablePlacement().PlacementID,
                platforms: [],
                frequency_limit: 0,
                frequency_unit: "",
                max_limit: 0
            });
            this.handleChange(newData);
        }
    }

    removePlacement = (index) => {
        const newData = [...this.props.Placements];

        if (newData.length > 1) {
            newData.splice(index, 1);
        } else {
            this.addUserMessage("An announcement must have at least one placement.");
        }

        this.handleChange(newData);
    }

    togglePlatform = (index, platform, enabled) => {
        const newData = [...this.props.Placements];
        const platformIndex = newData[index].platforms.indexOf(platform);

        if (!enabled) {
            if (platformIndex > -1) {
                newData[index].platforms.splice(platformIndex, 1);
            }
        } else {
            if (platformIndex === -1) {
                newData[index].platforms.push(platform);
            }
        }
        this.handleChange(newData);
    }

    changeFrequency = (index, value) => {
        const newData = [...this.props.Placements];
        newData[index].frequency_limit = value;
        this.handleChange(newData);
    }

    handleFrequencyUnitChange = (index, value) => {
        console.log(index);
        console.log(value);
        const newData = [...this.props.Placements];
        newData[index].frequency_unit = value;
        if (value === "") {
            this.changeFrequency(index, 0);
        } else {
            if (newData[index].frequency_unit) {
                this.changeFrequency(index, Math.max(newData[index].frequency_limit, 1));
            }
        }
        this.handleChange(newData);
    }

    changeMaxLimit = (index, value) => {
        const newData = [...this.props.Placements];
        newData[index].max_limit = value;
        this.handleChange(newData);
    }

    changePlacement = (index, value) => {
        const newData = [...this.props.Placements];
        newData[index].placement_id = value;
        this.handleChange(newData);
    }

    handleChange = (newPlacements) => {
        this.props.onChange({
            Placements: newPlacements
        });
    }


    // Helpers
    getNextAvailablePlacement = () => {
        const unused = this.getUnusedPlacements();
        if (unused.length > 0) {
            return unused[0];
        } else {
            return false;
        }
    }

    getUnusedPlacements = () => {
        return this.props.placementOptions.filter(p => {
            return this.props.Placements.findIndex(o => {
                return parseInt(o.placement_id, 10) === parseInt(p.PlacementID, 10);
            }) === -1;
        });
    }


    render() {
            const {
                Placements
            } = this.props;

            return ( <
                Card style = {
                    this.props.rootStyle
                } >
                <
                CardHeader avatar = { < Avatar > < ListIcon / > < /Avatar>}
                    title = {
                        "Placements"
                    }
                    subheader = {
                        "Where should this ad show?"
                    }
                    action = { <
                        Button onClick = {
                            this.addNewPlacement
                        } >
                        Add <
                        /Button>
                    }
                    /> <
                    CardContent >
                    <
                    Table >
                    <
                    TableHead >
                    <
                    TableRow >
                    <
                    TableCell style = {
                        {
                            width: 250
                        }
                    } > Placement < /TableCell> <
                    TableCell style = {
                        {
                            width: 850
                        }
                    } > Platforms < /TableCell> <
                    TableCell > Frequency < /TableCell> <
                    TableCell > < /TableCell> <
                    TableCell > Max Limit < /TableCell> <
                    TableCell > < /TableCell> <
                    /TableRow> <
                    /TableHead> <
                    TableBody >

                    {
                        Placements.map((p, index) => {
                            return ( <
                                TableRow key = {
                                    index
                                } >
                                <
                                TableCell >
                                <
                                FormControl >
                                <
                                InputLabel > Placement < /InputLabel>                                         <
                                Select value = {
                                    parseInt(p.placement_id, 10)
                                }
                                onChange = {
                                    (event, i) => {
                                        this.changePlacement(index, event.target.value)
                                    }
                                } >
                                {
                                    this.renderPlacementOptions()
                                } <
                                /Select> <
                                /FormControl> <
                                /TableCell> <
                                TableCell >
                                <
                                div className = {
                                    {
                                        display: 'flex',
                                        flexDirection: 'row'
                                    }
                                } > {
                                    this.renderPlatformCheckboxes(index)
                                } <
                                /div> <
                                /TableCell> <
                                TableCell >
                                <
                                TextField label = "Min Time Between Views"
                                type = "number"
                                helperText = "No Limit"
                                value = {
                                    p.frequency_limit
                                }
                                onChange = {
                                    (event) => {
                                        this.changeFrequency(index, event.target.value)
                                    }
                                }
                                style = {
                                    {
                                        width: 150
                                    }
                                }
                                /> <
                                /TableCell> <
                                TableCell >
                                <
                                FormControl >
                                <
                                InputLabel > Unit < /InputLabel>  <
                                Select value = {
                                    p.frequency_unit
                                }
                                onChange = {
                                    (event, i) => {
                                        this.handleFrequencyUnitChange(index, event.target.value)
                                    }
                                }
                                style = {
                                    {
                                        width: 150
                                    }
                                } >
                                <
                                MenuItem value = {
                                    ""
                                } > No Limit < /MenuItem> <
                                MenuItem value = {
                                    "min"
                                } > Minute(s) < /MenuItem> <
                                MenuItem value = {
                                    "hr"
                                } > Hour(s) < /MenuItem> <
                                MenuItem value = {
                                    "day"
                                } > Day(s) < /MenuItem> <
                                MenuItem value = {
                                    "wk"
                                } > Week(s) < /MenuItem> <
                                /Select> <
                                /FormControl> <
                                /TableCell> <
                                TableCell >
                                <
                                TextField label = "Max Views"
                                type = "number"
                                value = {
                                    p.max_limit
                                }
                                onChange = {
                                    (event) => {
                                        this.changeMaxLimit(index, event.target.value)
                                    }
                                }
                                style = {
                                    {
                                        width: 150
                                    }
                                }
                                /> <
                                /TableCell> <
                                TableCell style = {
                                    {
                                        textAlign: 'right'
                                    }
                                } >
                                <
                                IconButton onClick = {
                                    () => {
                                        this.removePlacement(index);
                                    }
                                } > < DeleteIcon / > < /IconButton> <
                                /TableCell> <
                                /TableRow>
                            );
                        })
                    } <
                    /TableBody> <
                    /Table> <
                    /CardContent> <
                    /Card>
                );
            }

            renderPlacementOptions = () => {
                    return this.props.placementOptions
                        .map((p, index) => {
                                return ( < MenuItem key = {
                                        index
                                    }
                                    value = {
                                        p.PlacementID
                                    } > {
                                        p.Tag
                                    } < /MenuItem>)
                                });
                        }

                    renderPlatformCheckboxes = (placementIndex) => {
                        return this.props.platformOptions.map((p, index) => {
                                const enabled = this.props.Placements[placementIndex].platforms.indexOf(p) > -1;
                                // return (<Checkbox labelPosition='right' name={p} key={index} label={p} checked={enabled} onCheck={(event, enabled) => { this.togglePlatform(placementIndex, event.target.name, enabled) }} style={{ display: 'inline-block', width: '120px' }} />);
                                return ( <
                                    FormControlLabel key = {
                                        index
                                    }
                                    control = { <
                                        Checkbox
                                        name = {
                                            p
                                        }
                                        checked = {
                                            enabled
                                        }
                                        onChange = {
                                            (event, enabled) => {
                                                this.togglePlatform(placementIndex, event.target.name, enabled)
                                            }
                                        }
                                        />
                                    }
                                    label = {
                                        p
                                    }
                                    />)
                                });
                        }
                    }

                    EditablePlacements.propTypes = {
                        placementOptions: PropTypes.array.isRequired,
                        platformOptions: PropTypes.array.isRequired,
                        Placements: PropTypes.array.isRequired,
                        onChange: PropTypes.func.isRequired
                    };

                    export default EditablePlacements;