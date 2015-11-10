/* global describe, it */
'use strict';
var windef = require('../lib/windef'),
    Key = require('../lib/key'),
    assert = require('assert');

describe('Key Open Tests', () => {
    it('Should create a key given a subkey', () => {
        var key = new Key(windef.HKEY.HKEY_CLASSES_ROOT, '.txt', windef.KEY_ACCESS.KEY_ALL_ACCESS);
        assert(key.handle !== null && key.handle !== undefined);
        key.close();
    });

    it('Should open a subkey provided a previously opened key', () => {
        var key = new Key(windef.HKEY.HKEY_CLASSES_ROOT, '', windef.KEY_ACCESS.KEY_ALL_ACCESS);
        var key2 = key.openSubKey('.txt', windef.KEY_ACCESS.KEY_ALL_ACCESS);
        assert(key2.handle !== null && key2.handle !== undefined);
        key.close();
        key2.close();
    });

    it('Should properly close', () => {
        var key = new Key(windef.HKEY.HKEY_CLASSES_ROOT, '.txt', windef.KEY_ACCESS.KEY_ALL_ACCESS);
        key.close();

        // ensure that the key is actually closed by trying to open a subkey
        // which should fail
        assert.throws(() => {
            key.openSubKey('OpenWithList', windef.KEY_ACCESS.KEY_ALL_ACCESS);
        });
    });
});

describe('Create Key Tests', function () {
    it('Should create a new key and Delete it', () => {
        var key = new Key(windef.HKEY.HKEY_CLASSES_ROOT, '.txt', windef.KEY_ACCESS.KEY_ALL_ACCESS);

        assert(key.handle !== undefined);
        assert(key.handle !== null);

        var createdKey = key.createSubKey('\test_key_name', windef.KEY_ACCESS.KEY_ALL_ACCESS);

        assert(createdKey.handle !== undefined);
        assert(createdKey.handle !== null);
        assert(createdKey.path === '\test_key_name');

        createdKey.deleteKey();
        assert.throws(() => {
            key.openSubKey('\test_key_name', windef.KEY_ACCESS.KEY_ALL_ACCESS);
        }, (err) => {
            assert(err.indexOf('ERROR_FILE_NOT_FOUND') > -1);
            return true;
        });

        key.close();
    });
});

describe('Set / Query Value Tests', function () {
    it('Should set and read REG_SZ Value', () => {
        var key = new Key(windef.HKEY.HKEY_CLASSES_ROOT, '.txt', windef.KEY_ACCESS.KEY_ALL_ACCESS);

        assert(key.handle !== null && key.handle !== undefined);

        key.setValue('test_value_name', windef.REG_VALUE_TYPE.REG_SZ, 'test_value');

        var value = key.getValue('test_value_name');
        assert.equal(value, 'test_value');
        key.close();
    });
});
