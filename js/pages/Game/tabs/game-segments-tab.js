import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import BasePage from '../../BasePage.js';
import * as SegmentData from '../../../data/segments.js';
import * as SegmentParams from '../../../data/segmentParams.js';
import * as GameData from '../../../data/games.js';
import {
    PageProgressLoader
} from '../../../common/components/loading.js';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import SegmentDialog from './segments/dialogs/segment-dialog.js';
import {
    Typography
} from '@material-ui/core';

const defaultCondition = {
    property: "",
    operator: "==",
    value: ""
};

const defaultDefinition = {
    type: "and",
    conditions: [
        defaultCondition
    ]
};

class SegmentsTab extends Component {

    renderSegmentRow = (segment) => {
        return ( < TableRow key = {
                segment.SegmentID
            } >
            <
            TableCell > {
                segment.SegmentID
            } < /TableCell> <
            TableCell > {
                segment.Name
            } < /TableCell> <
            TableCell > {
                segment.Description
            } < /TableCell> <
            TableCell > {
                JSON.stringify(segment.Definition)
            } < /TableCell> <
            TableCell >
            <
            SegmentDialog key = {
                1
            }
            title = {
                "Edit Segment"
            }
            buttonLabel = {
                "Edit"
            }
            segment = {
                segment
            }
            segmentParams = {
                this.props.segmentParams
            }
            onSubmit = {
                (segment) => {
                    this.props.updateSegment(segment)
                }
            }
            /> <
            /TableCell> <
            /TableRow>);
        }

        render() {
            return ( <
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
                TableCell > SegmentID < /TableCell> <
                TableCell > Name < /TableCell> <
                TableCell > Description < /TableCell> <
                TableCell > Definition < /TableCell> <
                TableCell > < /TableCell> <
                /TableRow> <
                /TableHead> <
                TableBody > {
                    this.props.segments.map(this.renderSegmentRow)
                } <
                /TableBody>     <
                /Table> <
                /Paper>
            );
        }
    }

    SegmentsTab.propTypes = {
        segments: PropTypes.array.isRequired
    };

    export default class SegmentsTabContainer extends BasePage {
        constructor(props) {
            super(props);
            this.state = {
                loading: true,
                adding: false,
                segments: []
            };
        }

        generateNewSegment = () => {
            return {
                GameID: this.props.game_id,
                Name: "",
                Description: "",
                Definition: defaultDefinition
            }
        }

        componentDidMount() {
            const {
                game_id
            } = this.props;
            if (game_id) {
                this.setState({
                    game_id: game_id
                });
                this.loadSegments(game_id);
            }
        }

        createNewSegment = (segment) => {
            SegmentData.add(segment).then(result => {
                this.loadSegments(this.state.game_id);
            });
        }

        updateSegment = (segment) => {
            SegmentData.update(segment).then(result => {
                this.loadSegments(this.state.game_id);
            });
        }

        deleteSegment = (segment) => {
            SegmentData.remove(segment).then(result => {
                this.loadSegments(this.state.game_id);
            });
        }

        // Call when you want to load/reload data from the server
        loadSegments = (game_id) => {
            this.setState({
                loading: true
            });
            Promise.all([
                    SegmentData.getAllForGame(game_id),
                    GameData.getByID(game_id),
                    SegmentParams.getAllForGame(game_id)
                ])
                .then(values => {
                    this.setState({
                        loading: false,
                        game: values[1],
                        segments: values[0],
                        segmentParams: values[2]
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
                                        this.state.game.Title + " Segments"
                                    } < /Typography>, [ <
                                    SegmentDialog key = {
                                        1
                                    }
                                    title = {
                                        "Create Segment"
                                    }
                                    buttonLabel = {
                                        "Add"
                                    }
                                    segment = {
                                        this.generateNewSegment()
                                    }
                                    segmentParams = {
                                        this.state.segmentParams
                                    }
                                    onSubmit = {
                                        (segment) => {
                                            this.createNewSegment(segment)
                                        }
                                    }
                                    />
                                ])
                        } <
                        SegmentsTab
                    loadSegments = {
                        this.loadSegments
                    }
                    segments = {
                        this.state.segments
                    }
                    segmentParams = {
                        this.state.segmentParams
                    }
                    updateSegment = {
                        this.updateSegment
                    }
                    /> <
                    /div>);
                }

            }
        }