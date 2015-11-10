// Minimnal wrappers for shell32.js
var windef = require('../windef'),
    ffi = require('ffi'),
    ref = require('ref');

var SHELLEXECUTEINFOPtr = ref.refType(windef.SHELLEXECUTEINFO);
var shell32 = new ffi.Library('Shell32', {
    /*
    BOOL ShellExecuteEx(
    _Inout_ SHELLEXECUTEINFO *pExecInfo
    );
    */
    ShellExecuteExA: ['bool',  [SHELLEXECUTEINFOPtr]]
});

module.exports = shell32;
