'use strict';
var ffi = require('ffi'),
  ref = require('ref'),
  struct = require('ref-struct'),
  uniontype = require('ref-union'),
  types = require('./types');

// Create the SHELLEXECUTEINFO struct

// yes, this is the name in the official MSDN doc
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

var SHELLEXECUTEINFOPtr = ref.refType(SHELLEXECUTEINFO);

var shell32 = new ffi.Library('Shell32', {
    ShellExecuteExA: ['bool',  [SHELLEXECUTEINFOPtr]]
});

// pass in default values for members
var lpVerb = 'runas';
var lpFile = null;
var lpParameters = null;
var hInstApp = ref.alloc(types.HINSTANCE);
var SW_SHOWNORMAL = 0x1;

var uac = {
    FILEPATH: lpFile,
    PARAMETERS: lpParameters,
    elevate: function (filepath, parameters, callback) {
        this.FILEPATH = filepath;
        this.PARAMETERS = parameters;
        if(this.FILEPATH === null || this.FILEPATH === '') {
            console.log('Missing parameters FILEPATH');
            return;
        }
        var shellexecuteinfoval = new SHELLEXECUTEINFO({
            cbSize: SHELLEXECUTEINFO.size,
            fMask: 0x00000000,
            hwnd: null,
            lpVerb: lpVerb,
            lpFile: this.FILEPATH,
            lpParameters: this.PARAMETERS,
            lpDirectory: null,
            nShow: SW_SHOWNORMAL,
            hInstApp: hInstApp,
            lpIDList: null,
            lpCLass: null,
            hkeyClass: null,
            dwHotKey: null,
            DUMMYUNIONNAME: {
                hIcon: null,
                hMonitor: null
            },
            hProcess: ref.alloc(types.HANDLE)
        });

        shell32.ShellExecuteExA.async(shellexecuteinfoval.ref(), callback);
    }
};

module.exports = uac;
