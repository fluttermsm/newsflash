import {
    apiUrl
} from '../constants.js';
import {
    GetData,
    PostData,
    PutData,
    DeleteData
} from './requestHelpers.js';
import moment from 'moment';

const ValidStatuses = ["ACTIVE", "PAUSED", "TESTING", "ARCHIVED"];

const helpers = {
    getPlatformsInAnnouncement: (announcement) => {
        var platforms = [];
        announcement.Placements.forEach(placement => {
            if (placement.platforms) {
                placement.platforms.forEach(platform => {
                    if (platforms.indexOf(platform) === -1) {
                        platforms.push(platform);
                    }
                });
            }
        });
        return platforms;
    },

    getPlacementsInAnnouncement: (announcement) => {
        return announcement.Placements.map(placement => {
            return placement.placement_id;
        });
    }
}

const getAllForGame = (game_id) => {
    return GetData(apiUrl + "/game/" + game_id + "/announcements").then(results => {
        return results.map(ann => ann)
    });
}

const getByID = (announcement_id) => {
    return GetData(apiUrl + "/announcement/" + announcement_id).then(results => {
        // Only one result should be returned in the array, so send back the announcement object directly.
        if (results.constructor === Array && results.length > 0) {
            return results[0];
        } else {
            return results;
        }
    });
}

const add = async (announcement) => {
    return PostData(apiUrl + "/announcement", announcement);
}

const update = async (announcement) => {
    return PutData(apiUrl + "/announcement", announcement);
}

const remove = async (announcement) => {
    return DeleteData(apiUrl + "/announcement/" + announcement.ID);
}

const clone = async (announcement) => {
    return PostData(apiUrl + "/announcement/" + announcement.ID + "/clone");
}

export {
    getAllForGame,
    getByID,
    add,
    update,
    remove,
    clone,
    ValidStatuses,
    helpers
};