import {
    apiUrl
} from '../constants.js';
import {
    GetData,
    PutData,
    DeleteData,
    PostData,
    PutFormData
} from './requestHelpers.js';

const getAllForAnnouncement = (announcement_id) => {
    return GetData(apiUrl + "/ads/" + announcement_id);
}

const getByID = (ad_id) => {
    return GetData(apiUrl + "/ad/" + ad_id).then(results => {
        // Only one result should be returned in the array, so send back the announcement object directly.
        if (results.constructor === Array && results.length > 0) {
            return results[0];
        } else {
            return results;
        }
    });
}

const add = (announcement_id, language) => {
    return PostData(apiUrl + "/ad/" + announcement_id + "/" + language);
}

const update = (ad) => {
    return PutData(apiUrl + "/ad", ad);
}

const updateImage = (ad_id, file) => {
    const formData = new FormData();
    formData.append('image', file, file.name);
    return PutFormData(apiUrl + "/ad/" + ad_id, formData);
}

const remove = (ad) => {
    return DeleteData(apiUrl + "/ad/" + ad.ID);
}

const uploadImage = (lang, file) => {
    const formData = new FormData();
    formData.append('image', file, file.name);
    return PutFormData(apiUrl + "/image/" + lang, formData);
}

export {
    getAllForAnnouncement,
    getByID,
    add,
    update,
    // updateImage,
    uploadImage,
    remove
};