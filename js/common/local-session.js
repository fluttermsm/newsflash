const isSessionStorageSupported = () => {
    return (Storage !== void(0));
}

const set = (key, value) => {
    if (isSessionStorageSupported()) {
        window.sessionStorage.setItem(key, value);
    } else {
        console.log("Sessing Storage not supported. Not saving " + key + ": " + value);
    }
}

const get = (key) => {
    if (isSessionStorageSupported()) {
        return window.sessionStorage.getItem(key);
    } else {
        console.log("Sessing Storage not supported. Not able to retrieve " + key);
    }

}

const remove = (key) => {
    if (isSessionStorageSupported()) {
        window.sessionStorage.removeItem(key);
    } else {
        console.log("Sessing Storage not supported. Not Removing " + key);
    }

}

const clearAll = () => {
    if (isSessionStorageSupported()) {
        window.sessionStorage.clear();
    }
}

export {
    get,
    set,
    remove,
    clearAll
}