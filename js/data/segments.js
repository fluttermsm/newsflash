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
    return GetData(apiUrl + "/segments");
}

const getById = (game_id, segment_id) => {
    return GetData(apiUrl + "/segments/" + game_id + "/" + segment_id).then(results => {
        return results[0];
    });
}

const getAllForGame = (game_id) => {
    return GetData(apiUrl + "/segments/" + game_id);
}

const add = (segment) => {
    return PostData(apiUrl + "/segments", segment);
}

const update = (segment) => {
    return PutData(apiUrl + "/segments", segment);
}

const remove = (segment) => {
    return DeleteData(apiUrl + "/segments/" + segment.SegmentID);
}

const definitionAsString = (segment) => {
    if (segment.Definition) {
        return segment.Definition.conditions.map(o => {
            return [o.property, o.operator, o.value].join(" ");
        }).join(" " + segment.Definition.type + " ");
    }
}

export {
    getAll,
    getById,
    getAllForGame,
    add,
    update,
    remove,
    definitionAsString
};