import {
    apiUrl
} from '../constants.js';
import {
    GetData,
    PostData,
    PutData,
    DeleteData
} from './requestHelpers.js';

const getAllForGame = (game_id) => {
    return GetData(apiUrl + "/segmentParams/" + game_id);
}

const add = (segment) => {
    return PostData(apiUrl + "/segmentParams", segment);
}

const update = (segment) => {
    return PutData(apiUrl + "/segmentParams", segment);
}

const remove = (segment) => {
    return DeleteData(apiUrl + "/segmentParams/" + segment.id);
}

export {
    getAllForGame,
    add,
    update,
    remove
};