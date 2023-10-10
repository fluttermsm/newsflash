import React, {
    Component
} from 'react';
import BasePage from '../BasePage.js';
import {
    PageProgressLoader
} from '../../common/components/loading.js';

import * as GameData from '../../data/games.js';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

import GameAnnouncementsTab from './tabs/game-announcements-tab.js';
import GamePlacementsTab from './tabs/game-placements-tab.js';
import GamePrioritiesTab from './tabs/game-priorities-tab.js';
import SegmentsTab from './tabs/game-segments-tab.js';
// import SimulatorTab from './tabs/game-simulator-tab.js';
import Notifications from '../../common/components/notifications.js';
import * as LocalSession from '../../common/local-session.js';

const LAST_TAB_KEY = "gamePageTab";

class GamePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: "announcements"
        };
    }

    componentDidMount = () => {
        if (this.props.tab) {
            this.setState({
                tab: this.props.tab
            });
        }
    }

    handleChange = (event, value) => {
        this.setState({
            tab: value
        });
        LocalSession.set(LAST_TAB_KEY, value);
    }

    render() {
            return ( <
                    div >
                    <
                    AppBar position = 'static'
                    square elevation = {
                        0
                    }
                    style = {
                        {
                            backgroundColor: "#03a9f4"
                        }
                    } >
                    <
                    Tabs value = {
                        this.state.tab
                    }
                    onChange = {
                        this.handleChange
                    }
                    centered >
                    <
                    Tab label = "Announcements"
                    value = {
                        "announcements"
                    }
                    /> <
                    Tab label = "Priority"
                    value = {
                        "priority"
                    }
                    /> <
                    Tab label = "Placements"
                    value = {
                        "placements"
                    }
                    /> <
                    Tab label = "Segments"
                    value = {
                        "segments"
                    }
                    /> { /* <Tab label="Simulator" value={"simulator"}/>                    */ } <
                    /Tabs>   <
                    /AppBar>      {
                        this.state.tab === "announcements" && < GameAnnouncementsTab game_id = {
                            this.props.game.GameID
                        }
                        />} {
                            this.state.tab === "placements" && < GamePlacementsTab game_id = {
                                this.props.game.GameID
                            }
                            />}   {
                                this.state.tab === "priority" && < GamePrioritiesTab game_id = {
                                    this.props.game.GameID
                                }
                                />}   {
                                    this.state.tab === "segments" && < SegmentsTab game_id = {
                                        this.props.game.GameID
                                    }
                                    />} { /* {this.state.tab === "simulator" && <SimulatorTab game_id={this.props.game.GameID} />}                                         */ } <
                                    Notifications / >
                                        <
                                        /div>
                                );
                            }
                        }

                        export default class GamePageContainer extends BasePage {
                            state = {
                                params: {}
                            }

                            componentDidMount() {
                                console.log(this.props);
                                const {
                                    game_id,
                                    tab
                                } = this.props.match.params;
                                this.setState({
                                    params: this.props.match.params,
                                    tab: (LocalSession.get(LAST_TAB_KEY)) ? LocalSession.get(LAST_TAB_KEY) : tab || "announcements"
                                });
                                if (game_id) {
                                    GameData.getByID(game_id).then(this.onGameLoaded.bind(this));
                                }
                            }

                            componentWillReceiveProps(nextProps) {
                                if (nextProps.params) {
                                    this.setState({
                                        params: nextProps.params
                                    });
                                }
                            }

                            onGameLoaded(game) {
                                this.setState({
                                    game: game
                                });
                            }

                            render() {
                                const {
                                    game,
                                    tab
                                } = this.state;

                                if (!game) {
                                    return ( < PageProgressLoader / > );
                                } else {
                                    // pass all route params to nested components
                                    return ( < div > {
                                            this.renderAppBar()
                                        } <
                                        GamePage game = {
                                            game
                                        }
                                        tab = {
                                            tab
                                        }
                                        /> <
                                        /div>);
                                    }
                                }
                            }