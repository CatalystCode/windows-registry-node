/* global describe, it */
'use strict';
require('./test_helper');

var assert = require('assert'),
    registry = require('../index').registry,
    windef = require('../index').windef;

describe('Registry API open tests', () => {
    it('Should open a subkey provided a predefined key', () => {
        var key = registry.openKeyFromPredefined(windef.HKEY.HKEY_CLASSES_ROOT, '.txt', windef.KEY_ACCESS.KEY_ALL_ACCESS);
        console.log(key.handle);
        assert.equal(key.handle !== null, true);
        key.close();
    });
    it('Should open a subkey provided a previously opened key', () => {
        var key = registry.openKeyFromPredefined(windef.HKEY.HKEY_CLASSES_ROOT, '', windef.KEY_ACCESS.KEY_ALL_ACCESS);
        var key2 = registry.openKeyFromKeyObject(key, '.txt', windef.KEY_ACCESS.KEY_ALL_ACCESS);
        assert.equal(key2.handle !== null, true);
        key.close();
    });
});

describe('Create Key Tests', function () {
    it('Should create a new key and delete it', () => {
        var key = registry.openKeyFromPredefined(windef.HKEY.HKEY_CLASSES_ROOT, '.txt', windef.KEY_ACCESS.KEY_ALL_ACCESS);

        assert(key.handle !== undefined);
        assert(key.handle !== null);

        registry.createKey(key, '\test_key_name', windef.KEY_ACCESS.KEY_ALL_ACCESS);

        var createdKey = registry.openKeyFromKeyObject(key, '\test_key_name', windef.KEY_ACCESS.KEY_ALL_ACCESS);

        assert(createdKey.handle !== undefined);
        assert(createdKey.handle !== null);
        assert(createdKey.path === '\test_key_name');

        registry.deleteKey(key, '\test_key_name');
        assert.throws(() => {
            registry.openKeyFromKeyObject(key, '\test_key_name', windef.KEY_ACCESS.KEY_ALL_ACCESS);
        }, (err) => {
            assert(err.indexOf('ERROR_FILE_NOT_FOUND') > -1);
            return true;
        });

        key.close();
    });
});

describe('Set / Query Value Tests', function () {
    it('Should set and read REG_SZ Value', () => {
        var key = registry.openKeyFromPredefined(windef.HKEY.HKEY_CLASSES_ROOT, '.txt', windef.KEY_ACCESS.KEY_ALL_ACCESS);

        assert.equal(key.handle !== null, true);

        registry.setValueForKeyObject(key, 'test_value_name', windef.REG_VALUE_TYPE.REG_SZ, 'test_value');

        var value = registry.queryValueForKeyObject(key, 'test_value_name');
        console.log('her is  value:' + value);
        assert.equal(value, 'test_value');
        console.log('lngth:' + value.length);
        key.close();
    });
});
