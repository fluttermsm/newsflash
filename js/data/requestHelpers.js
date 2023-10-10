import fetch from 'isomorphic-fetch';

//const cache = {};
const validateResponse = (response) => {
    if (response.status >= 400) {
        try {
            const o = response.json();
            if (o.error && o.error.message) {
                throw new Error(o.error.message);
            } else {
                throw new Error(response.text());
            }
        } catch (e) {
            throw new Error("Something bad happened on the server and no valid error response was returned.");
        }
    }
    return response;
}

// For pulling data
export const GetData = (url) => fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(validateResponse)
    .then(response => response.json())
    .catch(e => {
        alert("Missing Read Permissions: Contact briansh@bigbluebubble.com if you need access to this tool.");
    });

// For adding data
export const PostData = (url, data) => fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    })
    .then(validateResponse)
    .then(response => response.json());

// For updating data
export const PutData = (url, data) => fetch(url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    })
    .then(validateResponse)
    .then(response => response.json());

// For Deleteing data
export const DeleteData = (url) => fetch(url, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(validateResponse)
    .then(response => response.json());

// For Multipart uploads
export const PostFormData = (url, formData) => fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        credentials: 'include',
        body: formData
    })
    .then(validateResponse)
    .then(response => response.json());

export const PutFormData = (url, formData) => fetch(url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json'
        },
        credentials: 'include',
        body: formData
    })
    .then(validateResponse)
    .then(response => response.json());