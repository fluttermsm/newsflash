import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import BasePage from '../../BasePage.js';
import * as PlacementData from '../../../data/placements.js';
import * as GameData from '../../../data/games.js';
import {
    PageProgressLoader
} from '../../../common/components/loading.js'
import EnhancedTable from '../../../common/components/ui/enhanced-table.js';

import NewPlacementDialog from '../dialogs/new-placement-dialog.js';

class GamePlacementsTab extends Component {
    render() {
        return ( <
            Paper square elevation = {
                0
            } >
            <
            EnhancedTable columns = {
                [{
                        id: 'PlacementID',
                        numeric: false,
                        disablePadding: true,
                        label: 'Placement ID'
                    },
                    {
                        id: 'Tag',
                        numeric: false,
                        disablePadding: false,
                        label: 'Tag'
                    },
                    {
                        id: 'Platform',
                        numeric: false,
                        disablePadding: false,
                        label: 'Platform'
                    },
                    {
                        id: 'Description',
                        numeric: false,
                        disablePadding: false,
                        label: 'Description'
                    },
                    {
                        id: 'Category',
                        numeric: false,
                        disablePadding: false,
                        label: 'Category'
                    }
                ]
            }
            data = {
                this.props.placements
            }
            defaultSortColumn = {
                "PlacementID"
            }
            idColumn = "PlacementID" /
            >
            <
            /Paper>
        );
    }
}

GamePlacementsTab.propTypes = {
    placements: PropTypes.array.isRequired
};

export default class GamePlacementsTabContainer extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            adding: false,
            placements: []
        };
    }

    componentDidMount() {
        const {
            game_id
        } = this.props;
        if (game_id) {
            this.setState({
                game_id: game_id
            });
            this.loadPlacements(game_id);
        }
    }

    // Call when you want to load/reload data from the server
    loadPlacements = (game_id) => {
        this.setState({
            loading: true
        });
        Promise.all([
                PlacementData.getAllForGame(game_id),
                GameData.getByID(game_id)
            ])
            .then(values => {
                this.setState({
                    loading: false,
                    game: values[1],
                    placements: values[0]
                });
            });
    }

    render() {
            if (this.state.loading) {
                return ( < div >
                    <
                    PageProgressLoader / >
                    <
                    /div>);
                }
                else {
                    return ( <
                        div > {
                            this.renderToolbar( < Typography variant = "title" > {
                                    this.state.game.Title + " Placements"
                                } < /Typography>, [<NewPlacementDialog key={1} game_id={this.state.game.GameID} onClose={() => this.loadPlacements(this.state.game_id)} />])} <
                                GamePlacementsTab placements = {
                                    this.state.placements
                                }
                                /> <
                                /div>);
                            }

                        }
                    }