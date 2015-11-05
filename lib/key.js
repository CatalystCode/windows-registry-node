'use strict';

class Key {
    constructor (pHKey, path) {
        this.handle = pHKey;
        this.path = path;
    }
    close () {
        var registry = require('./registry');
        registry.closeKey(this);
    }

    toString () {
        return this.path;
    }
}

module.exports = Key;
