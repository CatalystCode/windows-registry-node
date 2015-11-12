/* globals Buffer */
/**
 * A very dumb minimal implementation of the Windows Registry.
 * Enough to run our tests
 */
'use strict';
var assert = require('assert'),
    windef = require('../../lib/windef'),
    types = require('../../lib/types'),
    debug = require('debug')('windows-registry'),
    ref = require('ref');

/*
* Dumb O(n) search for value inside object
*/
function findValueInHash(value, hash) {
    var found = false;
    for (let k in hash) {
        if (hash[k] === value) {
            found = true;
            break;
        }
    }
    return found;
}

var keys = {
};
keys[windef.HKEY.HKEY_CLASSES_ROOT] = {
    predefValue: true,
    open: false,
    values: {
    }
};
var mockIndex = 0x00000001;

var advApi = {
    /*
    LONG WINAPI RegQueryValueEx(
    _In_        HKEY    hKey,
    _In_opt_    LPCTSTR lpValueName,
    _Reserved_  LPDWORD lpReserved,
    _Out_opt_   LPDWORD lpType,
    _Out_opt_   LPBYTE  lpData,
    _Inout_opt_ LPDWORD lpcbData
    );
    */
    RegQueryValueExA: function (hKey, valueName, shouldBeNull, lpType, lpData, lpcbData) {
        debug('RegQueryValueExA');
        if (lpData === null) {
            debug(keys[hKey.address()].values.test_value_name);
            lpType.writeUInt32LE(windef.REG_VALUE_TYPE.REG_SZ, 0);
            lpcbData.writeUInt32LE(keys[hKey.address()].values[valueName].length, 0);
            return 0;
        }

        lpData.write(keys[hKey.address()].values[valueName].value, 'utf8');
        lpType.writeUInt16LE(windef.REG_VALUE_TYPE.REG_SZ);
        return 0;
    },
    /*
    LONG WINAPI RegOpenKeyEx(
    _In_     HKEY    hKey,
    _In_opt_ LPCTSTR lpSubKey,
    _In_     DWORD   ulOptions,
    _In_     REGSAM  samDesired,
    _Out_    PHKEY   phkResult
    );
    */
    RegOpenKeyExA: function (hKey, subKeyName, shouldBeZero, accessLevel, pHkey) {
        var accessLevelFound = findValueInHash(accessLevel, windef.KEY_ACCESS);
        debug('Mock: RegOpenKeyExA subkey: ' + subKeyName);
        if (hKey.address) {
            debug('Mock: hKey address:' + hKey.address());
        }
        debug('keys:');
        debug(keys);
        // predefined key
        ref.writeUInt64LE(pHkey.deref(), 0, mockIndex);
        mockIndex += 1;
        if (typeof hKey === 'number') {
            assert(findValueInHash(hKey, windef.HKEY), 'Mock: Invalid predefined key specified');

            if (!keys[hKey]) {
                debug('failed to find key for ' + hKey + ' current keys:');
                debug(keys);
                // FILE NOT FOUND
                return 2;
            }
            keys[pHkey.deref().address()] = {
                opened: true,
                values: {

                }
            };
        } else {
            assert(hKey.constructor === Buffer);

            if (!keys[hKey.address()]) {
                debug('failed to find key for ' + hKey.address() + ' current keys:');
                debug(keys);
                // FILE NOT FOUND
                return 2;
            }
            keys[hKey.address()].open = true;
            keys[pHkey.deref().address()] = keys[hKey.address()];
        }

        assert(typeof subKeyName === 'string');
        assert(shouldBeZero === 0);
        assert(accessLevelFound, 'Mock: Invalid access level specified');
        assert(pHkey.deref().constructor === Buffer);

        return 0;
    },
    /*
    LONG WINAPI RegSetValueEx(
    _In_             HKEY    hKey,
    _In_opt_         LPCTSTR lpValueName,
    _Reserved_       DWORD   Reserved,
    _In_             DWORD   dwType,
    _In_       const BYTE    *lpData,
    _In_             DWORD   cbData
    );
    */
    RegSetValueExA: function (hKey, valueName, shouldBeNull, valueType, valueBuffer, bufferLength) {
        debug('Mock: RegSetValueExA');
        // predefined key
        if (typeof hKey === 'number') {
            assert(findValueInHash(hKey, windef.HKEY), 'Mock: Invalid predefined key specified');
        } else {
            assert(hKey.constructor === Buffer);
        }
        assert(typeof valueName === 'string');
        assert(typeof valueType === 'number');
        assert(valueBuffer.constructor === Buffer);
        assert(typeof bufferLength === 'number');

        keys[hKey.address()].values[valueName] = {
            valueType: valueType,
            value: ref.readCString(valueBuffer),
            length: bufferLength
        };
        return 0;
    },
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
    RegCreateKeyExA: function (hKey, subKeyName, shouldBeNull,  shouldBeNull2, securityAttributes, accessLevel, shouldBeNull3, pHkey, shouldBeNull4) {
        debug('Mock: RegCreateKeyExA');
        assert(hKey.constructor === Buffer);
        assert(typeof subKeyName === 'string');
        assert(shouldBeNull === null);
        assert(shouldBeNull2 === null);
        assert(shouldBeNull3 === null);
        assert(shouldBeNull4 === null);
        assert.equal(securityAttributes, 0, 'Mock: Security Attributes are not supported yet');
        assert(findValueInHash(accessLevel, windef.KEY_ACCESS), 'Mock: Invalid access level specified');
        assert(pHkey.deref().constructor === Buffer);
        debug('Mock: Writing: ' + mockIndex + ' 64 bit dummy pointer to buffer with length: ' + pHkey.deref().length);

        ref.writeUInt64LE(pHkey.deref(), 0, mockIndex);
        debug('Mock: Wrote 64 bit dummy pointer');
        mockIndex += 1;
        debug('Mock: Creating fake key for: ' + hKey.address());
        debug('Subkey: ' + subKeyName);
        keys[hKey.address()] = {
            opened: true,
            subkeys: {
                subKeyName: ''
            },
            values: {

            }
        };

        return 0;
    },
    /*
      LONG WINAPI RegDeleteTree(
      _In_     HKEY    hKey,
      _In_opt_ LPCTSTR lpSubKey
      );
    */
    RegDeleteTreeA: function (hKey, subKeyName) {
        if (typeof hKey === 'number') {
            assert(findValueInHash(hKey, windef.HKEY), 'Mock: Invalid predefined key specified');
        } else {
            assert(hKey.constructor === Buffer, 'Mock: hKey should be of type buffer if not a number');
        }

        assert(typeof subKeyName === 'string' || subKeyName === undefined);
        delete keys[hKey.address()];
        return 0;
    },
    /*
    LONG WINAPI RegCloseKey(
    _In_ HKEY hKey
    );
    */
    RegCloseKey: function (hKey) {
        debug('Mock: RegCloseKey');
        assert.equal(hKey.indirections, types.HKEY.indirections);

        delete keys[hKey.address()];
        return 0;
    }
};

module.exports = advApi;
