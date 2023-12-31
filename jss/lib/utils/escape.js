'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var CSS = global.CSS;

var env = process.env.NODE_ENV;

var escapeRegex = /([[\].#*$><+~=|^:(),"'`])/g;

exports['default'] = function(str) {
    // We don't need to escape it in production, because we are not using user's
    // input for selectors, we are generating a valid selector.
    if (env === 'production') return str;

    if (!CSS || !CSS.escape) {
        return str.replace(escapeRegex, '\\$1');
    }

    return CSS.escape(str);
};