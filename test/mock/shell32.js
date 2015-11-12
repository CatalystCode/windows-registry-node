/**
 * A mock implementation of the Windows shell execute API.
 * This is used for our tests
 */
'use strict';
require('ref');
var debug = require('debug')('windows-registry'),
    assert = require('assert'),
    struct = require('ref-struct'),
    uniontype = require('ref-union'),
    types = require('../../lib/types');

var DUMMYUNIONNAME = uniontype({
    hIcon: types.HANDLE,
    hMonitor: types.HANDLE
});

var SHELLEXECUTEINFO  = struct({
    cbSize: types.DWORD,
    fMask: types.ULONG,
    hwnd: types.HWND,
    lpVerb:  types.STRING,
    lpFile:  types.STRING,
    lpParameters: types.STRING,
    lpDirectory: types.STRING,
    nShow: types.INT,
    hInstApp: types.HINSTANCE,
    lpIDList: types.LPVOID,
    lpClass: types.STRING,
    hkeyClass: types.HKEY,
    dwHotKey: types.DWORD,
    DUMMYUNIONNAME: DUMMYUNIONNAME,
    hProcess: types.HANDLE
});

var shell32Mock = {
    ShellExecuteExA: function () {
    }
};
shell32Mock.ShellExecuteExA.async = function (type, cb) {
    debug('async');
    debug(type.deref().lpFile);
    assert.deepEqual(type.type.fields.cbSize, SHELLEXECUTEINFO.fields.cbSize);
    cb(null, true);
};

module.exports = shell32Mock;
