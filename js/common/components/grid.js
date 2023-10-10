import React, {
    Component
} from 'react';
import Grid from '@material-ui/core/Grid';

export class Col extends Component {
    render() {
        return ( < Grid item { ...this.props
            } > {
                this.props.children
            } < /Grid>);
        }
    };

    export class Row extends Component {
        render() {
            return ( < Grid container spacing = {
                    24
                } > {
                    this.props.children
                } < /Grid>);
            }
        }