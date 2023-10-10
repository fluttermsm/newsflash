import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button'; // v1.x
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Segment from '../segment.js';
import {
    withStyles
} from '@material-ui/core/styles';

const styles = theme => ({
    dialog: {
        margin: 0
    }
});

class SegmentDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    componentDidMount = () => {
        this.setState({
            segment: this.props.segment
        });
    }

    handleOpen = () => {
        this.setState({
            open: true
        });
    }

    handleClose = () => {
        this.setState({
            open: false
        });
    }

    handleChange = (segmentChanges) => {
        this.setState({
            segment: Object.assign({}, this.props.segment, segmentChanges)
        });
    }

    handleSubmit = () => {
        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.segment);
        }
    }

    render() {
        const {
            classes
        } = this.props;

        const actions = [ <
            Button
            key = {
                0
            }
            color = "primary"
            onClick = {
                this.handleClose
            } >
            Cancel < /Button>, <
            Button
            key = {
                1
            }
            color = "primary"
            onClick = {
                this.handleSubmit
            } >
            Submit < /Button>,
        ];

        return ( <
            div >
            <
            Button onClick = {
                this.handleOpen
            } > {
                this.props.buttonLabel
            } < /Button> <
            Dialog maxWidth = "md"
            fullWidth className = {
                classes.dialog
            }
            open = {
                this.state.open
            }
            onClose = {
                this.handleClose
            } >
            <
            DialogTitle > Segments < /DialogTitle> <
            DialogContent >
            <
            Segment segmentParams = {
                this.props.segmentParams
            }
            segment = {
                this.props.segment
            }
            onChange = {
                this.handleChange
            }
            /> <
            /DialogContent> <
            DialogActions > {
                actions
            } <
            /DialogActions>                     <
            /Dialog> <
            /div>
        );
    }
}

SegmentDialog.propTypes = {
    buttonLabel: PropTypes.string,
    segment: PropTypes.object,
    onSubmit: PropTypes.func
};

SegmentDialog.default = {
    buttonLabel: "Add"
};

export default withStyles(styles)(SegmentDialog);