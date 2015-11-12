var advApi = require('./adv_api'),
    assert = require('assert'),
    types = require('../../lib/types');

module.exports = {
    Library: function (libFile, funcs) {
        switch (libFile) {
            case 'Advapi32':
                assert(funcs.RegOpenKeyExA.constructor === Array);
                if(funcs.RegOpenKeyExA[1][0].indirection === types.HKEY.indirection &&
                   funcs.RegOpenKeyExA[1][0].name === types.HKEY.name) {
                    // this is redefition for the library only specifying
                    // a different key type
                    break;
                }
                assert(funcs.RegQueryValueExA.constructor === Array);
                assert(funcs.RegCreateKeyExA.constructor === Array);
                assert(funcs.RegDeleteTreeA.constructor === Array);
                assert(funcs.RegCloseKey.constructor === Array);
                assert(funcs.RegSetValueExA.constructor === Array);
                assert(typeof funcs === 'object');
                break;
            case 'Shell32':
                // TODO place asserts here
                break;
            default:
                throw 'Please add asserts for this new library file';
        }
        return advApi;
    }
};
