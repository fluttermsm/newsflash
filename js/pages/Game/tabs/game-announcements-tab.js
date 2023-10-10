import React from 'react';
import PropTypes from 'prop-types';
import {
    withRouter
} from 'react-router-dom';
import moment from 'moment';
import BasePage from '../../BasePage.js';
// Material UI
import Avatar from '@material-ui/core/Avatar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import {
    withStyles
} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import {
    Col,
    Row
} from '../../../common/components/grid.js';
import * as AnnouncementData from '../../../data/announcements.js';
import * as GameData from '../../../data/games.js';
import * as PlacementData from '../../../data/placements.js';
import {
    PageProgressLoader
} from '../../../common/components/loading.js';
import {
    CloneIcon,
    EditIcon,
    DeleteIcon,
    mapPlatformNamesToIcons,
    MailIcon,
    NewsIcon
} from '../../../common/components/icons.js';
import TextInputDialog from '../../../common/components/dialogs/text-input-dialog.js';
import TextInput from '../../../common/components/ui/text-input';
import * as LocalSession from '../../../common/local-session.js';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    placementContainer: {
        margin: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    placementAvatar: {
        width: 24,
        height: 24
    }
});

const isAnnouncementLive = (ann) => {
    if (ann.Status === "ACTIVE" && ann.ServerStart !== null && moment().isAfter(ann.ServerStart)) {
        if (ann.ServerEnd === null) {
            return true;
        } else {
            return moment().isBefore(ann.ServerEnd);
        }
    } else {
        return false
    }
}

const isAnnouncementScheduled = (ann) => {
    return (ann.Status === "ACTIVE" && moment().isBefore(ann.ServerStart));
}

const isAnnouncementCompleted = (ann) => {
    return (ann.Status === "ACTIVE" && ann.ServerEnd !== null && moment().isAfter(ann.ServerEnd));
}

const isAnnouncementTesting = (ann) => {
    return (ann.Status === "TESTING");
}

const isAnnouncementArchived = (ann) => {
    return (ann.Status === "ARCHIVED");
}

const isAnnouncementPaused = (ann) => {
    return (ann.Status === "PAUSED");
}

const isAnnouncementHelpMenu = (ann) => {
    return ann.Title.startsWith("HELP_");
}

const isAnnouncementTutorialMenu = (ann) => {
    return ann.Title.startsWith("TUT_");
}

const isAnnouncementIslandSkin = (ann) => {
    return ann.Title.startsWith("SKIN_");
}

const isAnnouncementMoreMenu = (ann) => {
    return ann.Title.startsWith("ANDMORE_");
}

const isHiddenByDefault = (ann) => {
    return isAnnouncementTutorialMenu(ann) ||
        isAnnouncementHelpMenu(ann) ||
        isAnnouncementIslandSkin(ann) ||
        isAnnouncementMoreMenu(ann);
}


// Game Announcements Tab Component
class GameAnnouncementsTab extends BasePage {
    state = {
        statusFilter: (LocalSession.get("statusFilter")) ? LocalSession.get("statusFilter") : "LIVE/SCHEDULED",
        searchFilter: (LocalSession.get("searchFilter")) ? LocalSession.get("searchFilter") : "",
        sortBy: (LocalSession.get("sortBy")) ? LocalSession.get("sortBy") : "ID DESC"
    }

    onStatusFilterChange = (event) => {
        this.setState({
            statusFilter: event.target.value
        });
        LocalSession.set("statusFilter", event.target.value);
    }

    onSearchFilterChange = (event) => {
        this.setState({
            searchFilter: event.target.value
        });
        LocalSession.set("searchFilter", event.target.value);
    }

    onSortChange = (event) => {
        this.setState({
            sortBy: event.target.value
        });
        LocalSession.set("sortBy", event.target.value);
    }

    filterByStatus = (statusFilter, ann) => {
        if (statusFilter === "ALL") {
            return true;
        } else if (statusFilter === "HELP") {
            return isAnnouncementHelpMenu(ann);
        } else if (statusFilter === "TUT") {
            return isAnnouncementTutorialMenu(ann);
        } else if (statusFilter === "SKINS") {
            return isAnnouncementIslandSkin(ann);
        } else if (statusFilter === "AND MORE") {
            return isAnnouncementMoreMenu(ann);
        } else if (statusFilter === "LIVE/SCHEDULED") {
            return (isAnnouncementLive(ann) || isAnnouncementScheduled(ann)) && !isHiddenByDefault(ann);
        } else if (statusFilter === "LIVE") {
            return isAnnouncementLive(ann) && !isHiddenByDefault(ann);
        } else if (statusFilter === "SCHEDULED") {
            return isAnnouncementScheduled(ann) && !isHiddenByDefault(ann);
        } else if (statusFilter === "COMPLETED") {
            return isAnnouncementCompleted(ann) && !isHiddenByDefault(ann);
        } else if (statusFilter === "TESTING") {
            return isAnnouncementTesting(ann) && !isHiddenByDefault(ann);
        } else if (statusFilter === "ARCHIVED") {
            return isAnnouncementArchived(ann) && !isHiddenByDefault(ann);
        } else if (statusFilter === "PAUSED") {
            return isAnnouncementPaused(ann) && !isHiddenByDefault(ann);
        } else {
            return false;
        }
    }

    filterBySearchString = (searchFilter, ann) => {
        return (searchFilter.length === 0 || ann.Title.toLowerCase().indexOf(searchFilter.toLowerCase()) > -1);
    }

    isPrimaryPlacement = (placementId) => {
        const placement = this.props.placements.find(placement => placement.PlacementID === placementId);
        if (placement !== undefined) {
            return placement.Category === "primary";
        }
        return false;
    }

    placementDisplay = (placementId) => {
        // some hackery for custom icons for news/mail placements for dof and msm.
        const news_placements = [63, 112];
        const mail_placements = [62, 116, 115];
        const placement = this.props.placements.find(placement => placement.PlacementID === placementId);
        if (placement.Tag) {
            if (mail_placements.indexOf(placement.PlacementID) > -1) {
                return <MailIcon key = {
                    placement.PlacementID
                }
                title = {
                    placement.Tag
                }
                />
            } else if (news_placements.indexOf(placement.PlacementID) > -1) {
                return <NewsIcon key = {
                    placement.PlacementID
                }
                title = {
                    placement.Tag
                }
                />
            } else {
                return <Avatar title = {
                    placement.Tag
                }
                className = {
                    this.props.classes.placementAvatar
                }
                key = {
                    placement.PlacementID
                } > {
                    placement.Tag.substring(0, 2).toUpperCase()
                } < /Avatar>
            }
        }
        return <div > < /div>
    }

    render() {
            const {
                announcements,
                classes
            } = this.props;
            const {
                statusFilter,
                searchFilter,
                sortBy
            } = this.state;


            const filteredAnnouncements = announcements.filter(ann => {
                    return this.filterByStatus(statusFilter, ann);
                })
                .filter(ann => {
                    return this.filterBySearchString(searchFilter, ann);
                })
                .sort((a, b) => {
                    if (sortBy === "ID") {
                        return a.ID - b.ID
                    } else if (sortBy === "ID DESC") {
                        return b.ID - a.ID;
                    } else if (sortBy === "ServerStart") {
                        return a.ServerStart < b.ServerStart ? -1 : 1;
                    } else if (sortBy === "ServerStart DESC") {
                        return a.ServerStart < b.ServerStart ? 1 : -1;
                    } else if (sortBy === "ServerEnd") {
                        if (a.ServerEnd === b.ServerEnd) {
                            return 0;
                        } else if (a.ServerEnd === null) {
                            return 1;
                        } else if (b.ServerEnd === null) {
                            return -1
                        } else {
                            return a.ServerEnd < b.ServerEnd ? -1 : 1;
                        }
                    } else if (sortBy === "ServerEnd DESC") {
                        if (a.ServerEnd === b.ServerEnd) {
                            return 0;
                        } else if (a.ServerEnd === null) {
                            return 1;
                        } else if (b.ServerEnd === null) {
                            return -1
                        } else {
                            return a.ServerEnd < b.ServerEnd ? 1 : -1;
                        }
                    } else if (sortBy === "Title") {
                        return a.Title < b.Title ? -1 : 1;
                    } else if (sortBy === "Title DESC") {
                        return a.Title < b.Title ? 1 : -1;
                    } else {
                        return a.ID - b.ID;
                    }
                });

            return ( <
                    Row >
                    <
                    Col sm = {
                        12
                    }
                    styles = {
                        {
                            display: "flex",
                            flexWrap: 'wrap'
                        }
                    } > {
                        this.renderToolbar([ <
                                FormControl
                                className = {
                                    classes.formControl
                                }
                                style = {
                                    {
                                        minWidth: 300
                                    }
                                }
                                key = {
                                    1
                                } >
                                <
                                InputLabel htmlFor = "status-filter" > Status Filter < /InputLabel> <
                                Select
                                value = {
                                    this.state.statusFilter
                                }
                                onChange = {
                                    this.onStatusFilterChange
                                } >
                                <
                                MenuItem key = {
                                    0
                                }
                                value = "LIVE/SCHEDULED" > Live & Scheduled Announcements < /MenuItem> <
                                MenuItem key = {
                                    1
                                }
                                value = "LIVE" > Live Announcements < /MenuItem> <
                                MenuItem key = {
                                    2
                                }
                                value = "SCHEDULED" > Scheduled Announcements < /MenuItem> <
                                MenuItem key = {
                                    3
                                }
                                value = "PAUSED" > Paused Announcements < /MenuItem> <
                                MenuItem key = {
                                    4
                                }
                                value = "COMPLETED" > Completed Announcements < /MenuItem> <
                                MenuItem key = {
                                    5
                                }
                                value = "TESTING" > Testing Announcements < /MenuItem> <
                                MenuItem key = {
                                    6
                                }
                                value = "HELP" > Help Menus < /MenuItem> <
                                MenuItem key = {
                                    7
                                }
                                value = "TUT" > Tutorial Menus < /MenuItem> <
                                MenuItem key = {
                                    8
                                }
                                value = "SKINS" > Island Skins < /MenuItem> <
                                MenuItem key = {
                                    9
                                }
                                value = "AND MORE" > And More < /MenuItem>

                                <
                                MenuItem key = {
                                    10
                                }
                                value = "ALL" > All < /MenuItem> <
                                /Select> <
                                /FormControl>,  <
                                FormControl
                                className = {
                                    classes.formControl
                                }
                                style = {
                                    {
                                        minWidth: 500
                                    }
                                }
                                key = {
                                    2
                                } >
                                <
                                TextInput
                                label = "Search Filter"
                                value = {
                                    searchFilter
                                }
                                onChange = {
                                    this.onSearchFilterChange
                                }
                                fullWidth / >
                                <
                                /FormControl>, <
                                FormControl
                                className = {
                                    classes.formControl
                                }
                                style = {
                                    {
                                        minWidth: 200
                                    }
                                }
                                key = {
                                    3
                                } >
                                <
                                InputLabel htmlFor = "sort-filter" > Sort By < /InputLabel> <
                                Select
                                value = {
                                    this.state.sortBy
                                }
                                onChange = {
                                    this.onSortChange
                                } >
                                <
                                MenuItem key = {
                                    0
                                }
                                value = "ID" > Ad ID < /MenuItem> <
                                MenuItem key = {
                                    1
                                }
                                value = "ID DESC" > Ad ID DESC < /MenuItem> <
                                MenuItem key = {
                                    2
                                }
                                value = "ServerStart" > Start Date < /MenuItem> <
                                MenuItem key = {
                                    3
                                }
                                value = "ServerStart DESC" > Start Date DESC < /MenuItem> <
                                MenuItem key = {
                                    4
                                }
                                value = "ServerEnd" > End Date < /MenuItem> <
                                MenuItem key = {
                                    5
                                }
                                value = "ServerEnd DESC" > End Date DESC < /MenuItem> <
                                MenuItem key = {
                                    6
                                }
                                value = "Title" > Title < /MenuItem> <
                                MenuItem key = {
                                    7
                                }
                                value = "Title DESC" > Title DESC < /MenuItem> <
                                /Select> <
                                /FormControl>
                            ], [ < Button key = {
                                    1
                                }
                                onClick = {
                                    this.props.onAddNewClick
                                } > New < /Button>])
                            } <
                            Paper square elevation = {
                                0
                            } >
                            <
                            Table >
                            <
                            TableHead >
                            <
                            TableRow >
                            <
                            TableCell style = {
                                {
                                    width: 40
                                }
                            } > ID < /TableCell> <
                            TableCell > Status < /TableCell> <
                            TableCell > Title < /TableCell> <
                            TableCell > Platforms < /TableCell> <
                            TableCell > Placements < /TableCell> <
                            TableCell > Start < /TableCell> <
                            TableCell > End < /TableCell> <
                            TableCell > < /TableCell> <
                            /TableRow> <
                            /TableHead> <
                            TableBody > {
                                filteredAnnouncements.map((ann, id) => {
                                        const {
                                            ID,
                                            Title,
                                            Status,
                                            ServerStart,
                                            ServerEnd
                                        } = ann;
                                        const platforms = AnnouncementData.helpers.getPlatformsInAnnouncement(ann);
                                        const placementIds = AnnouncementData.helpers.getPlacementsInAnnouncement(ann).sort();

                                        return ( <
                                            TableRow key = {
                                                ID
                                            } >
                                            <
                                            TableCell style = {
                                                {
                                                    width: 40
                                                }
                                            } > {
                                                ID
                                            } < /TableCell> <
                                            TableCell > {
                                                Status
                                            } < /TableCell> <
                                            TableCell > < strong > {
                                                Title
                                            } < /strong></TableCell >
                                            <
                                            TableCell > {
                                                mapPlatformNamesToIcons(platforms)
                                            } < /TableCell> <
                                            TableCell >
                                            <
                                            div className = {
                                                classes.placementContainer
                                            } > {
                                                placementIds.filter(this.isPrimaryPlacement).map(this.placementDisplay)
                                            } <
                                            /div> <
                                            /TableCell>                                                <
                                            TableCell title = {
                                                ServerStart + " UTC"
                                            } > {
                                                moment(ServerStart).local().format('MM/DD/YYYY hh:mma')
                                            } < /TableCell> <
                                            TableCell title = {
                                                ServerEnd + " UTC"
                                            } > {
                                                (ServerEnd !== null) ? moment(ServerEnd).local().format('MM/DD/YYYY hh:mma') : 'No End'
                                            } < /TableCell> <
                                            TableCell style = {
                                                {
                                                    textAlign: 'right'
                                                }
                                            } >
                                            <
                                            IconButton onClick = {
                                                () => {
                                                    this.props.onCloneClick(ann);
                                                }
                                            } > < CloneIcon / > < /IconButton> <
                                            IconButton onClick = {
                                                () => {
                                                    this.props.onEditClick(ann);
                                                }
                                            } > < EditIcon / > < /IconButton> <
                                            IconButton onClick = {
                                                () => {
                                                    this.props.onDeleteClick(ann);
                                                }
                                            } > < DeleteIcon / > < /IconButton> <
                                            /TableCell> <
                                            /TableRow>);
                                        })
                                } <
                                /TableBody> <
                                /Table> <
                                /Paper> <
                                /Col>

                                <
                                /Row>
                            );
                        }
                    }

                    GameAnnouncementsTab.propTypes = {
                        announcements: PropTypes.array.isRequired,
                        placements: PropTypes.array.isRequired,
                        classes: PropTypes.object.isRequired
                    }

                    withRouter(GameAnnouncementsTab);


                    class GameAnnouncementsTabContainer extends BasePage {
                        state = {
                            adding: false
                        };

                        componentDidMount() {
                            const {
                                game_id
                            } = this.props;
                            if (game_id) {
                                Promise.all(
                                    [
                                        AnnouncementData.getAllForGame(game_id),
                                        GameData.getByID(game_id),
                                        PlacementData.getAllForGame(game_id)
                                    ]).then((values) => {
                                    this.setState({
                                        loading: false,
                                        announcements: values[0],
                                        game: values[1],
                                        placements: values[2]
                                    });
                                });
                            }
                        }

                        onEditClick = (ann) => {
                            const path = ["/games", ann.GameID, "announcements", ann.ID].join("/");
                            this.props.history.push(path);
                        }

                        onDeleteClick = (ann) => {
                            if (confirm("Are you sure you want to delete this announcement?") === true) {
                                AnnouncementData.remove(ann).then(result => {
                                    AnnouncementData.getAllForGame(ann.GameID).then(announcements => {
                                        this.setState({
                                            announcements: announcements
                                        });
                                        this.addUserMessage("Announcement [" + ann.Title + "] has been deleted.");
                                    });
                                })
                            }
                        }

                        onCloneClick = (ann) => {
                            if (confirm("Are you sure you want to clone this announcement?") === true) {
                                AnnouncementData.clone(ann).then(result => {
                                    const path = ["/games", ann.GameID, "announcements", result.ID].join("/");
                                    this.props.history.push(path);
                                });
                            }
                        }

                        onAddNewClick = () => {
                            this.setState({
                                adding: true
                            });
                        }

                        addNewAnnouncement = (ann) => {
                            this.setState({
                                adding: false
                            });
                            AnnouncementData.add(ann).then(result => {
                                const path = ["/games", ann.GameID, "announcements", result.ID].join("/");
                                this.props.history.push(path);
                            });
                        }

                        isAddingGame = () => {
                            return this.state.adding;
                        };

                        render() {
                            const {
                                game,
                                announcements,
                                placements
                            } = this.state;

                            if (announcements) {
                                return ( < div >
                                    <
                                    GameAnnouncementsTab classes = {
                                        this.props.classes
                                    }
                                    game = {
                                        game
                                    }
                                    placements = {
                                        placements
                                    }
                                    announcements = {
                                        announcements
                                    }
                                    onEditClick = {
                                        this.onEditClick
                                    }
                                    onDeleteClick = {
                                        this.onDeleteClick
                                    }
                                    onCloneClick = {
                                        this.onCloneClick
                                    }
                                    onAddNewClick = {
                                        this.onAddNewClick
                                    }
                                    /> <
                                    TextInputDialog textFieldWidth = {
                                        400
                                    }
                                    open = {
                                        this.isAddingGame()
                                    }
                                    title = {
                                        "Add a New Announcement for " + game.Title
                                    }
                                    helperText = "(For admin use only)"
                                    inputLabel = "Announcement Name"
                                    handleCancel = {
                                        () => this.setState({
                                            adding: false
                                        })
                                    }
                                    handleSubmit = {
                                        (name) => this.addNewAnnouncement({
                                            Title: name,
                                            Placements: [],
                                            Languages: [],
                                            Segments: [],
                                            GameID: game.GameID,
                                            ServerStart: moment().utc().format("YYYY-MM-DD 15:00:00"),
                                            ServerEnd: moment().utc().add(4, 'days').format("YYYY-MM-DD 15:00:00"),
                                            Status: "PAUSED"
                                        })
                                    }
                                    /> <
                                    /div>);
                                }
                                else {
                                    return ( <
                                        PageProgressLoader / >
                                    );
                                }

                            }
                        }

                        export default withStyles(styles)(withRouter(GameAnnouncementsTabContainer));