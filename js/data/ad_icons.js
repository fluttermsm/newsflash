import {
    apiUrl
} from '../constants.js';
import {
    GetData,
    PutData,
    DeleteData,
    PostFormData
} from './requestHelpers.js';

const getByID = (game_id, icon_id) => {
    return GetData(apiUrl + "/ad_icon/" + game_id);
}

const getAllForGame = (game_id) => {
    //return GetData(apiUrl+"/assets/ad_icon/"+game_id);
    return GetData(apiUrl + '/ad_icon/' + game_id);
}

const add = (game_id, iconFiles) => {
    const formData = new FormData();
    iconFiles.forEach(file => {
        formData.append('image', file, file.name);
    });
    return PostFormData(apiUrl + "/ad_icon/" + game_id, formData);
}

const update = (ad_icon) => {
    return PutData(apiUrl + "/ad_icon", ad_icon);
}

const remove = (icon_id) => {
    return DeleteData(apiUrl + "/ad_icon/" + icon_id);
}

const getDependantAnnouncements = (icon_id) => {
    return GetData(apiUrl + '/ad_icon/announcements/' + icon_id);
}

const archive = (ad_icon) => {
    ad_icon.Status = 'ARCHIVED';
    return update(ad_icon);
}

export {
    getByID,
    getAllForGame,
    add,
    update,
    remove,
    getDependantAnnouncements,
    archive
};