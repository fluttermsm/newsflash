import {
    apiUrl
} from '../constants.js';
import {
    GetData
} from './requestHelpers.js';

const setCachedUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
}

const clearCachedUser = () => {
    localStorage.removeItem("user");
}

const getUser = () => {
    return GetData(apiUrl + "/user").then(result => {
        if (result.user) {
            setCachedUser(result.user);
            return result.user;
        } else {
            clearCachedUser();
            return null;
        }
    });
}

const isLoggedIn = () => {
    return getUser().then(user => {
        return (user !== null);
    });
}

const logout = () => {
    return GetData(apiUrl + "/logout").then(result => {
        clearCachedUser();
        console.log("Logged out");
        return true;
    });
}

const getCachedUserInfo = () => {
    let cachedUser = localStorage.getItem("user");
    if (cachedUser) {
        try {
            return JSON.parse(cachedUser);
        } catch (e) {
            console.log(e);
        }
        return false;
    }
}

export {
    getUser,
    isLoggedIn,
    getCachedUserInfo,
    logout
};