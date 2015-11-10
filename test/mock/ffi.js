var advApi = require('./adv_api'),
    assert = require('assert'),
    shell32 = require('./shell32'),
    types = require('../../lib/types');

module.exports = {
    Library: function (libFile, funcs) {
        var lib;
        switch (libFile) {
            case 'Advapi32':
                assert(funcs.RegOpenKeyExA.constructor === Array);
                if(funcs.RegOpenKeyExA[1][0].indirection === types.HKEY.indirection &&
                   funcs.RegOpenKeyExA[1][0].name === types.HKEY.name) {
                    // this is redefition for the library only specifying
                    // a different key type
                    lib = advApi;
                    break;
                }
                assert(funcs.RegQueryValueExA.constructor === Array);
                assert(funcs.RegCreateKeyExA.constructor === Array);
                assert(funcs.RegDeleteTreeA.constructor === Array);
                assert(funcs.RegCloseKey.constructor === Array);
                assert(funcs.RegSetValueExA.constructor === Array);
                assert(typeof funcs === 'object');
                lib = advApi;
                break;
            case 'Shell32':
                lib = shell32;
                break;
            default:
                throw 'Please add asserts for this new library file';
        }
        return lib;
    }
};
