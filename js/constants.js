/**
 * Define any constants that need to be used application-wide
 */

// uri for API calls
export const apiUrl = window.location.origin + '/api';

const BASE_S3_URL = "https://bbb-ad-mediation.s3.amazonaws.com/";
export const S3URLFromKey = (key) => {
    // Already a URL, don't use s3 endpoint.
    if (key.substr(0, 4) === "http") {
        return key;
    } else {
        return BASE_S3_URL + key;
    }
}

export const ALLOW_GAME_DELETE = false;
//export const apiUrl = 'http://newsflash-server:3001/api';