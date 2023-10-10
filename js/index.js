// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';

import Routes from './routing/routes';

import './index.css';
// import themeV0_config from './theme.js';

import {
    MuiThemeProvider,
    createMuiTheme
} from '@material-ui/core/styles'; // v1.x
// import { MuiThemeProvider as V0MuiThemeProvider } from 'material-ui';
// import getMuiTheme from 'material-ui/styles/getMuiTheme'; //v0.x

const theme = createMuiTheme({
    /* theme for v1.x */
});


ReactDOM.render( <
    MuiThemeProvider theme = {
        theme
    } > { /* <V0MuiThemeProvider muiTheme={themeV0}> */ } <
    div >
    <
    Routes / >
    <
    /div> { /* </V0MuiThemeProvider> */ } <
    /MuiThemeProvider>,
    document.getElementById('root')
);