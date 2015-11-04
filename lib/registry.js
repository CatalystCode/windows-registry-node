/* global Buffer */
'use strict';
var ffi = require('ffi'),
    types = require('./types'),
    Key = require('./key'),
    ref = require('ref'),
    error = require('./error'),
    windef = require('./windef');

var advApi = ffi.Library('Advapi32', {
    RegOpenCurrentUser: ['uint64', [types.REGSAM, types.PHKEY]],
    RegQueryValueExA: ['uint64', [types.HKEY, 'string', 'pointer', types.LPDWORD, types.LPBYTE, types.LPDWORD]],
    RegOpenKeyExA: ['uint64', ['uint64', 'string', types.DWORD, types.REGSAM, types.PHKEY]],
    RegSetValueExA: ['uint64', [types.HKEY, 'string', 'pointer', types.DWORD, types.LPBYTE, types.DWORD]],
    /**
     * LONG WINAPI RegCreateKeyEx(
        _In_       HKEY                  hKey,
        _In_       LPCTSTR               lpSubKey,
        _Reserved_ DWORD                 Reserved,
        _In_opt_   LPTSTR                lpClass,
        _In_       DWORD                 dwOptions,
        _In_       REGSAM                samDesired,
        _In_opt_   LPSECURITY_ATTRIBUTES lpSecurityAttributes,
        _Out_      PHKEY                 phkResult,
        _Out_opt_  LPDWORD               lpdwDisposition
      );
    */
    RegCreateKeyExA: ['uint64', [types.HKEY, 'string', 'pointer', 'pointer', types.DWORD, types.REGSAM, 'pointer', types.PHKEY, 'pointer']],
    /*
      LONG WINAPI RegDeleteTree(
      _In_     HKEY    hKey,
      _In_opt_ LPCTSTR lpSubKey
      );
    */
    RegDeleteTreeA: ['uint64', [types.HKEY, 'string']]
});

var api = {
    openKeyFromPredefined: function (preDefinedKey, subKeyName, accessLevel) {
        if (preDefinedKey < 0x80000000 || preDefinedKey > 0x80000006) {
            throw 'The key ' + preDefinedKey + ' is not valid. Use the windef module for the list of predefined keys';
        }

        var pHkey = ref.alloc(types.PHKEY);
        var result = advApi.RegOpenKeyExA(preDefinedKey, subKeyName, 0, accessLevel, pHkey);
        console.log('result:' + result);
        if (result !== 0) {
            throw 'Failed to open key error: ' + error[result];
        }

        return new Key(pHkey, subKeyName);
    },
    openKeyFromKeyObject: function (keyObject, subKeyName, accessLevel) {
        var pHkey = ref.alloc(types.PHKEY);

        // RegOpenKeyEx can also take an HKEY in addition to a predefined value
        var advApi2 = ffi.Library('Advapi32', {
            RegOpenKeyExA: ['uint64', [types.HKEY, 'string', types.DWORD, types.REGSAM, types.PHKEY]]
        });
        var result = advApi2.RegOpenKeyExA(keyObject.handle.deref(), subKeyName, 0, accessLevel, pHkey);

        if (result !== 0) {
            throw 'Failed to open key error: ' + error[result];
        }

        return new Key(pHkey, subKeyName);
    },
    queryValueForKeyObject: function (key, valueName) {
        var pKeyDataLength = ref.alloc(types.LPDWORD),
            pKeyType = ref.alloc(types.LPDWORD);
        // QUERY FOR VALUE SIZE & TYPE
        var result = advApi.RegQueryValueExA(key.handle.deref(), valueName, null, pKeyType, null, pKeyDataLength);

        // READ VALUE
        var value = new Buffer(pKeyDataLength.readUInt32LE()),
            valueType = pKeyType.readUInt32LE();
        console.log(valueType === 1);
        switch (valueType) {
            case windef.REG_VALUE_TYPE.REG_SZ:
            case windef.REG_VALUE_TYPE.REG_EXPAND_SZ:
            case windef.REG_VALUE_TYPE.REG_LINK:
                value.type = types.LPCTSR;
                break;
            case windef.REG_VALUE_TYPE.REG_BINARY:
                value.type = types.PVOID;
                break;
            case windef.REG_VALUE_TYPE.REG_DWORD:
            case windef.REG_VALUE_TYPE.REG_DWORD_BIG_ENDIAN:
            case windef.REG_VALUE_TYPE.REG_DWORD_LITTLE_ENDIAN:
                value.type = types.DWORD;
                break;
            default:
                throw 'The Value Type: ' + valueType + ' is currently unsupported';
        }

        // READ VALUE
        result = advApi.RegQueryValueExA(key.handle.deref(), valueName, null, pKeyType, value, pKeyDataLength);

        if (result !== 0) {
            throw 'Failed to open key error: ' + error[result];
        }

        return value.toString();
    },
    setValueForKeyObject: function (key, valueName, valueType, value) {
        if (valueType < 1 || valueType > 8) {
            throw 'Invalid valueType parameter: ' + valueType + ' use values from windef.REG_VALUE_TYPE';
        }
        var buffer,
            byte;

        switch (windef.REG_VALUE_TYPE[valueType]) {
            case windef.REG_SZ:
            case windef.REG_EXPAND_SZ:
            case windef.REG_LINK:
                buffer = new Buffer(value, 'ascii');
                break;
            case windef.REG_BINARY:
                // we assume that the value is a buffer since it should be binary data
                buffer = value;
                break;
            case windef.REG_VALUE_TYPE.REG_DWORD:
            case windef.REG_VALUE_TYPE.REG_DWORD_BIG_ENDIAN:
            case windef.REG_VALUE_TYPE.REG_DWORD_LITTLE_ENDIAN:
                buffer = new Buffer(4, value);
                break;
            default:
                throw 'The type ' + valueType + ' is currently unsupported';
        }

        byte = ref.alloc(types.LPBYTE, buffer);

        var result = advApi.RegSetValueExA(key.handle.deref(), valueName, null, valueType, byte.deref(), buffer.length);

        if (result !== 0) {
            throw 'Failed to open key error: ' + error[result];
        }
    },
    createKey: function (key, subKeyName, accessLevel) {
        var pHkey = ref.alloc(types.PHKEY);

        var result = advApi.RegCreateKeyExA(key.handle.deref(), subKeyName, null, null, 0 /*REG_OPTION_NON_VOLATILE*/ , accessLevel, null, pHkey, null);

        if (result !== 0) {
            throw 'Failed to open key error: ' + error[result];
        }
    },
    deleteKey: function (key, subKeyName) {
        var result = advApi.RegDeleteTreeA(key.handle.deref(), subKeyName);

        if (result !== 0) {
            throw 'Failed to open key error ' + result + ': + error[result]';
        }
    }
};

module.exports = api;
