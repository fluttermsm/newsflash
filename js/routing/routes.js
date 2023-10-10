// src/routes.js
import React from 'react';
import {
    BrowserRouter,
    Switch
} from 'react-router-dom';

import GamesPage from '../pages/Games/GamesPage';
import GamePage from '../pages/Game/GamePage';
import EditAnnouncementPage from '../pages/EditAnnouncement/EditAnnouncementPage';
import LoginPage from '../pages/Login/LoginPage';

import PrivateRoute from './private-route';
import PublicRoute from './public-route';


const Routes = (props) => ( <
    BrowserRouter { ...props
    } >
    <
    Switch >
    <
    PublicRoute exact path = "/login"
    component = {
        LoginPage
    }
    name = "Login" / >
    <
    PrivateRoute exact path = "/games"
    component = {
        GamesPage
    }
    name = "Games" / >
    <
    PrivateRoute exact path = "/games/:game_id"
    component = {
        GamePage
    }
    name = "GamePage" / >
    <
    PrivateRoute exact path = "/games/:game_id/:tab"
    component = {
        GamePage
    }
    name = "GamePage" / >
    <
    PrivateRoute exact path = "/games/:game_id/announcements/:announcement_id"
    component = {
        EditAnnouncementPage
    }
    name = "EditAnnouncement" / >
    <
    PrivateRoute path = "*"
    component = {
        GamesPage
    }
    />  <
    /Switch> <
    /BrowserRouter>
);

export default Routes;