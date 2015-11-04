'use strict';
class Key {
    constructor (pHKey, path) {
        this.handle = pHKey;
        this.path = path;
    }
    close () {
    }

    toString () {
        return this.path;
    }
}

module.exports = Key;
