import {
    apiUrl
} from '../constants.js';
import {
    GetData,
    PostData,
    PutData,
    DeleteData
} from './requestHelpers.js';
const getAll = () => {
    return GetData(apiUrl + "/games").then(a => {
        console.log(a);
        return a
    });
}

const getByID = (game_id) => {
    return GetData(apiUrl + "/game/" + game_id).then(results => {
        // Only one result should be returned in the array, so send back the game object directly.
        if (results.constructor === Array && results.length > 0) {
            return results[0];
        } else {
            return results;
        }
    });
}

const add = (game) => {
    return PostData(apiUrl + "/game", game);
}

const update = (game) => {
    return PutData(apiUrl + "/game", game);
}

const remove = (game) => {
    return DeleteData(apiUrl + "/game/" + game.GameID);
}

export {
    getAll,
    getByID,
    add,
    update,
    remove
};