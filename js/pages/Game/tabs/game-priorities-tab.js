import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import {
    withRouter
} from 'react-router-dom';
import moment from 'moment';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import UpArrowIcon from '@material-ui/icons/ArrowUpward';
import DownArrowIcon from '@material-ui/icons/ArrowDownward';
import StarsIcon from '@material-ui/icons/Stars';
import IconButton from '@material-ui/core/IconButton';
import {
    FormControl,
    ListItemSecondaryAction
} from '@material-ui/core';

import * as AnnouncementData from '../../../data/announcements.js';
import * as PlacementData from '../../../data/placements.js';
import {
    PageProgressLoader
} from '../../../common/components/loading.js';
import BasePage from '../../BasePage.js';
import * as LocalSession from '../../../common/local-session.js';

const PRIORITY_PLACEMENT_KEY = "selectedPriorityPlacement";

class AnnouncementListItem extends Component {

    componentDidUpdate = (prevProps) => {
        if (this.props.index !== prevProps.index) {
            this.setState({
                textFieldValue: this.props.index
            })
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            textFieldValue: props.index
        };
    }

    handleTextFieldChange = (event) => {
        const {
            value
        } = event.target;

        this.setState({
            textFieldValue: value,
            dirty: true
        });
    }

    handleTextFieldBlur = (event) => {
        const {
            ID,
            selectedPlacementID,
            setPriority
        } = this.props;
        setPriority(ID, selectedPlacementID, parseInt(this.state.textFieldValue));
    }

    handleKeyDown = (event) => {
        const {
            ID,
            selectedPlacementID,
            setPriority
        } = this.props;
        if (event.key === 'Enter') {
            setPriority(ID, selectedPlacementID, parseInt(this.state.textFieldValue));
        }
    }

    render() {
        const {
            ID,
            Title,
            selectedPlacementID,
            raisePriority,
            lowerPriority,
            Status,
            ServerStart,
            ServerEnd,
            onClick,
            pinPriority,
            pinned
        } = this.props;

        const {
            textFieldValue
        } = this.state;

        return ( < ListItem key = {
                ID
            } >
            <
            ListItemText onClick = {
                (event) => {
                    event.preventDefault();
                    onClick(ID)
                }
            }
            primary = {
                Title
            }
            secondary = {
                Status + ": " + moment(ServerStart).calendar() + ((ServerEnd === 'undefined') ? ' onward' : ' to ' + moment(ServerEnd).calendar())
            }
            /> <
            ListItemSecondaryAction >
            <
            IconButton size = "mini"
            onClick = {
                (event) => {
                    event.preventDefault();
                    pinPriority(ID, selectedPlacementID);
                    event.stopPropagation();
                }
            } >
            <
            StarsIcon color = {
                (pinned) ? 'primary' : 'inherit'
            }
            /> <
            /IconButton> <
            IconButton size = "mini"
            onClick = {
                (event) => {
                    event.preventDefault();
                    raisePriority(ID, selectedPlacementID);
                    event.stopPropagation();
                }
            } >
            <
            UpArrowIcon / >
            <
            /IconButton> <
            IconButton size = "mini"
            onClick = {
                (event) => {
                    event.preventDefault();
                    lowerPriority(ID, selectedPlacementID);
                    event.stopPropagation();
                }
            } >
            <
            DownArrowIcon / >
            <
            /IconButton> <
            br / >
            <
            TextField style = {
                {
                    position: "relative",
                    float: "right",
                    width: 40
                }
            }
            value = {
                textFieldValue
            }
            id = {
                "" + ID + selectedPlacementID
            }
            onClick = {
                (event) => event.stopPropagation()
            }
            onBlur = {
                (event) => this.handleTextFieldBlur(event)
            }
            onKeyDown = {
                (event) => this.handleKeyDown(event)
            }
            onChange = {
                (event) => this.handleTextFieldChange(event)
            }
            /> <
            /ListItemSecondaryAction> <
            /ListItem>       
        );
    }
}

class GamePrioritiesTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPlacementID: (this.getSessionPlacement()) ? this.getSessionPlacement() : props.placements[0].PlacementID || -1
        };
    }

    setSessionPlacement(placementID) {
        LocalSession.set("" + this.props.gameID + PRIORITY_PLACEMENT_KEY, placementID);
    }

    getSessionPlacement() {
        let id = LocalSession.get("" + this.props.gameID + PRIORITY_PLACEMENT_KEY);
        if (!isNaN(id)) {
            return Number(id);
        } else {
            return false;
        }
    }

    handlePlacementChange = (event) => {
        this.setState({
            selectedPlacementID: event.target.value
        });
        this.setSessionPlacement(event.target.value);
    }

    render() {
        if (this.state.selectedPlacementID === -1) {
            return <div > There are no existing placements
            for this game. < /div>
        }

        const selectedPlacement = this.props.placements.find((p => p.PlacementID === this.state.selectedPlacementID));
        const Pinned = selectedPlacement.Pinned || [];

        return ( <
            div style = {
                {
                    position: 'relative',
                    paddingTop: 10
                }
            } >
            <
            Paper style = {
                {
                    width: 500,
                    margin: 'auto',
                    padding: 0,
                    marginBottom: 2
                }
            } >
            <
            FormControl fullWidth >
            <
            Select fullWidth value = {
                this.state.selectedPlacementID
            }
            onChange = {
                this.handlePlacementChange
            } >
            {
                this.props.placements.map((placement, index) => {
                    return <MenuItem key = {
                        index
                    }
                    value = {
                        placement.PlacementID
                    } > {
                        placement.Tag
                    } < /MenuItem>;
                })
            } <
            /Select> <
            /FormControl>                     <
            /Paper> <
            Paper style = {
                {
                    width: 500,
                    margin: 'auto',
                    padding: 5
                }
            } >
            <
            List > {
                (selectedPlacement.Priorities.length > 0) ?
                selectedPlacement.Priorities.map((annID, index) => {
                    return <AnnouncementListItem
                    index = {
                        index
                    }
                    key = {
                        annID
                    } { ...this.props.announcementLookup[annID]
                    }
                    selectedPlacementID = {
                        selectedPlacement.PlacementID
                    }
                    raisePriority = {
                        this.props.raisePriority
                    }
                    lowerPriority = {
                        this.props.lowerPriority
                    }
                    setPriority = {
                        this.props.setPriority
                    }
                    pinPriority = {
                        this.props.pinPriority
                    }
                    pinned = {
                        Pinned.indexOf(annID) > -1
                    }
                    onClick = {
                        this.props.onEditClick
                    }
                    />
                }) :
                    "No Announcements are enabled for this placement."
            } <
            /List> <
            div style = {
                {
                    width: 100,
                    textAlign: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: 10
                }
            } >
            <
            IconButton onClick = {
                this.props.save
            } >
            <
            SaveIcon / >
            <
            /IconButton> <
            /div> <
            /Paper>

            <
            /div>
        );
    }
}

GamePrioritiesTab.propTypes = {
    raisePriority: PropTypes.func.isRequired,
    lowerPriority: PropTypes.func.isRequired,
    setPriority: PropTypes.func.isRequired,
    pinPriority: PropTypes.func.isRequired,
    announcementLookup: PropTypes.object.isRequired,
    placements: PropTypes.array.isRequired,
    save: PropTypes.func.isRequired,
    onEditClick: PropTypes.func.isRequired
}

withRouter(GamePrioritiesTab);


class GamePrioritiesTabContainer extends BasePage {
    constructor(props) {
        console.log(props);
        super(props);
        this.state = {
            loading: true
        };
    }

    savePriorities = () => {
        return Promise.all(this.state.placements.filter(p => p.dirty === true).map(p => {
            return PlacementData.update({
                PlacementID: p.PlacementID,
                Priorities: p.Priorities,
                Pinned: p.Pinned
            })
        })).then(results => {
            this.addUserMessage("Priorities have been saved to the server.");
            return results;
        });
    }

    componentDidMount() {
        console.log("Mounted GamePrioritiesTab");
        const {
            game_id
        } = this.props;
        if (game_id) {
            Promise.all([
                AnnouncementData.getAllForGame(game_id),
                PlacementData.getAllForGame(game_id)
            ]).then((values) => {
                let announcementLookup = values[0].reduce((o, ann) => {
                    o[ann.ID] = ann;
                    return o;
                }, {});

                // Remove announcements that have either been deleted or are in the past
                let placementsCleaned = values[1].map(placement => {
                    placement.Priorities = placement.Priorities.filter(annID => {
                        let ann = announcementLookup[annID];
                        return ((ann && !ann.ServerEnd) || (ann && moment().diff(ann.ServerEnd, 'hours') < 1));
                    });
                    return placement;
                });

                this.setState({
                    loading: false,
                    announcementLookup: announcementLookup,
                    placements: placementsCleaned
                });
            });
        }
    }

    handleRaisePriority = (announcementID, placementID) => {
        let placement = this.getPlacement(placementID);
        let index = placement.Priorities.indexOf(announcementID);
        if (index > 0) {
            placement.Priorities.splice(index - 1, 0, placement.Priorities.splice(index, 1)[0]);
            this.updatePlacement(placementID, placement);
        }
    }

    handleLowerPriority = (announcementID, placementID) => {
        let placement = this.getPlacement(placementID);
        let index = placement.Priorities.indexOf(announcementID);
        if (index < placement.Priorities.length - 1) {
            placement.Priorities.splice(index + 1, 0, placement.Priorities.splice(index, 1)[0]);
            this.updatePlacement(placementID, placement);
        }
    }

    handleSetPriority = (announcementID, placementID, newPriority) => {
        if (!isNaN(newPriority)) {

            let placement = this.getPlacement(placementID);
            let currentIndex = placement.Priorities.indexOf(announcementID);
            let newIndex = Math.min(newPriority, placement.Priorities.length - 1);
            console.log(announcementID + " " + currentIndex + " " + newIndex);
            placement.Priorities.splice(newIndex, 0, placement.Priorities.splice(currentIndex, 1)[0]);
            this.updatePlacement(placementID, placement);
        }
    }

    handlePinPriority = (announcementID, placementID) => {
        let placement = this.getPlacement(placementID);
        placement.Pinned = placement.Pinned || [];

        let pinIndex = placement.Pinned.indexOf(announcementID);

        if (pinIndex === -1) {
            placement.Pinned.push(announcementID);
        } else {
            placement.Pinned.splice(pinIndex, 1);
        }

        this.updatePlacement(placementID, placement);
    }

    getPlacement = (placementID) => {
        return Object.assign({}, this.state.placements.find((p, i) => {
            return p.PlacementID === placementID
        }));
    }

    updatePlacement = (placementID, placement) => {
        let copy = [].concat(this.state.placements);
        let index = copy.findIndex((p => p.PlacementID === placementID));

        let pins = placement.Pinned || [];
        pins.sort((a, b) => placement.Priorities.indexOf(a) - placement.Priorities.indexOf(b));

        // move pinned announcements to the top
        placement.Priorities.sort((a, b) => {
            // treat -1 priority as "no priority", they go last.
            let pinA = pins.indexOf(a);
            let pinB = pins.indexOf(b);
            if (pinA === -1 && pinB === -1) {
                return a.priority - b.priority;
            }
            if (pinA > -1 && pinB === -1) {
                return -1;
            }
            if (pinB > -1 && pinA === -1) {
                return 1;
            }

            return pinA - pinB || a - b;
        });

        placement.Pinned = pins;

        placement.dirty = true; // mark as dirty so we know to save.

        copy[index] = placement;

        this.setState({
            placements: copy
        });
    }

    onEditClick = (annID) => {
        const path = ["/games", this.props.game_id, "announcements", annID].join("/");
        this.props.history.push(path);
    }

    render() {
        if (this.state.loading) {
            return ( < PageProgressLoader / > );
        } else {
            return ( < GamePrioritiesTab gameID = {
                    this.props.game_id
                }
                announcementLookup = {
                    this.state.announcementLookup
                }
                placements = {
                    this.state.placements
                }
                raisePriority = {
                    this.handleRaisePriority
                }
                lowerPriority = {
                    this.handleLowerPriority
                }
                setPriority = {
                    this.handleSetPriority
                }
                pinPriority = {
                    this.handlePinPriority
                }
                save = {
                    this.savePriorities
                }
                onEditClick = {
                    this.onEditClick
                }
                />);
            }
        }
    }

    GamePrioritiesTabContainer.propTypes = {

    };

    export default withRouter(GamePrioritiesTabContainer);