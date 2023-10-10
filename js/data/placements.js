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
    return GetData(apiUrl + "/placements");
}

const getAllForGame = (game_id) => {
    return GetData(apiUrl + "/placements/" + game_id);
}

const add = (placement) => {
    return PostData(apiUrl + "/placement", placement);
}

const update = (placement) => {
    return PutData(apiUrl + "/placement", placement);
}

const remove = (placement) => {
    return DeleteData(apiUrl + "/placement/" + placement.PlacementID);
}

export {
    getAll,
    getAllForGame,
    add,
    update,
    remove
};