import React, {
    Component
} from 'react';
import PropTypes from 'prop-types'
import {
    Link
} from 'react-router-dom';
import BasePage from '../BasePage.js'

import {
    DeleteIcon,
    mapPlatformNamesToIcons
} from '../../common/components/icons.js';
import {
    PageProgressLoader
} from '../../common/components/loading.js';
import EditGameDialog from './dialogs/edit-game-dialog.js';
import NewGameDialog from './dialogs/new-game-dialog.js';

import * as GameData from '../../data/games.js';
import {
    ALLOW_GAME_DELETE
} from '../../constants.js';
import Notifications from '../../common/components/notifications.js';

// Material UI
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button'; // v1.x
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

class Games extends Component {
    state = {
        edit: {}
    }
    renderGameIcon(src, title = "Game Icon") {
        const style = {
            width: 24,
            height: 24
        };
        return ( <
            img alt = {
                title
            }
            src = {
                src
            }
            style = {
                style
            }
            />
        )
    }

    renderGameRow = (game) => {
            const {
                GameID,
                Title,
                Platforms,
                Tag
            } = game;
            return ( <
                TableRow key = {
                    GameID
                } >
                <
                TableCell style = {
                    {
                        width: 40
                    }
                } > {
                    GameID
                } < /TableCell> <
                TableCell >
                <
                Button component = {
                    Link
                }
                to = {
                    ['games', GameID, 'announcements'].join("/")
                } > {
                    Title
                } <
                /Button> <
                /TableCell> <
                TableCell style = {
                    {
                        width: 200
                    }
                } > < strong > {
                    Tag
                } < /strong></TableCell >
                <
                TableCell > {
                    mapPlatformNamesToIcons(Platforms)
                } < /TableCell> <
                TableCell style = {
                    {
                        textAlign: 'right'
                    }
                } >
                <
                EditGameDialog game_id = {
                    game.GameID
                }
                onClose = {
                    this.props.loadGames
                }
                /> {
                    (ALLOW_GAME_DELETE) ? < IconButton onClick = {
                            () => {
                                this.props.onDeleteClick(game);
                            }
                        } > < DeleteIcon / > < /IconButton> : ""} <
                        /TableCell> <
                        /TableRow>);
                }

                render() {
                    const {
                        games
                    } = this.props;

                    return ( <
                        div className = "Games" >
                        <
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
                        TableCell > Title < /TableCell> <
                        TableCell style = {
                            {
                                width: 200
                            }
                        } > Tag < /TableCell> <
                        TableCell > Platforms < /TableCell> <
                        TableCell > < /TableCell> <
                        /TableRow> <
                        /TableHead> <
                        TableBody > {
                            games.map((game, id) => {
                                return this.renderGameRow(game);
                            })
                        } <
                        /TableBody> <
                        /Table> <
                        /Paper> <
                        /div>
                    );
                }
            }

            Games.propTypes = {
                games: PropTypes.array
            };

            class GamesPageContainer extends BasePage {
                // static propTypes = {}
                // static defaultProps = {}
                //state = {}
                // React Implemented Methods
                constructor(props) {
                    super(props);
                    this.state = {
                        loading: true,
                        adding: false,
                        games: []
                    };
                }

                componentDidMount() {
                    if (this.state.games.length === 0) {
                        this.loadGames();
                    }
                }

                // Custom Methods
                // Call when you want to load/reload data from the server
                loadGames = () => {
                    this.setState({
                        loading: true
                    });
                    GameData.getAll().then(this.onGamesLoaded);
                }

                // Called when view data is loaded/reloaded
                onGamesLoaded = (results) => {
                    this.setState({
                        loading: false,
                        games: results
                    });
                }

                onAddClick = () => {
                    this.setState({
                        adding: true
                    });
                }

                onEditClick = (game) => {
                    this.navigateToEditPage(game.GameID);
                }

                onDeleteClick = (game) => {
                    var confirmation = confirm("Are you sure you want to delete [" + game.Title + "] from NewsFlash?");
                    if (confirmation === true) {
                        GameData.remove(game)
                            .then(result => {
                                this.addUserMessage("Game [" + game.Tag + "] deleted")
                            })
                            .then(this.loadGames);
                    }
                }

                isLoading() {
                    return this.state.loading;
                }

                isAddingGame() {
                    return this.state.adding;
                }

                addNewGame(game) {
                    if (this.isTagUnique(game.Tag)) {
                        GameData.add(game).then(result => {
                            this.navigateToEditPage(result.GameID);
                        });
                    } else {
                        alert("Game Tag " + game.Tag + " is already in use.");
                    }
                }

                navigateToEditPage = (gameID) => {
                    this.props.router.push("/games/" + gameID);
                }

                isTagUnique(Tag) {
                    return this.state.games.findIndex(game => {
                        return game.Tag === Tag
                    }) === -1;
                }

                // Render Method
                render() {
                        if (this.isLoading()) {
                            return ( < PageProgressLoader / > );
                        } else {
                            return ( <
                                div > {
                                    this.renderAppBar()
                                } {
                                    this.renderToolbar( < Typography variant = "title" > Games < /Typography>, [<NewGameDialog key={1} onClose={() => this.loadGames()} />])}          <
                                        Games games = {
                                            this.state.games
                                        }
                                        onAddClick = {
                                            this.onAddClick
                                        }
                                        onEditClick = {
                                            this.onEditClick
                                        }
                                        onDeleteClick = {
                                            this.onDeleteClick
                                        }
                                        loadGames = {
                                            this.loadGames
                                        }
                                        /> <
                                        Notifications / >
                                        <
                                        /div>
                                    );
                                }

                            }
                        }

                        export default GamesPageContainer;