'use strict';
var ref = require('ref'),
    types = require('./types'),
    shell32 = require('./native/shell32'),
    windef = require('./windef'),
    debug = require('debug')('windows-registry'),
    registry = require('./registry'),
    debug = require('debug')('windows-registry');

// pass in default values for members
var lpVerb = 'runas';
var hInstApp = ref.alloc(types.HINSTANCE);
var SW_SHOWNORMAL = 0x1;

module.exports = {
    elevate: function (filepath, parameters, callback) {
        if(!filepath) {
            debug('Missing filepath');
            callback('Missing filepath');
            return;
        }
        var shellexecuteinfoval = new windef.SHELLEXECUTEINFO({
            cbSize: windef.SHELLEXECUTEINFO.size,
            fMask: 0x00000000,
            hwnd: null,
            lpVerb: lpVerb,
            lpFile: filepath,
            lpParameters: parameters,
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
    },
    associateExeForFile: function (handlerName, handlerDescription, iconPath, exePath, extensionName) {
        var key = registry.openKeyFromPredefined(windef.HKEY.HKEY_CLASSES_ROOT, '', windef.KEY_ACCESS.KEY_ALL_ACCESS);

        registry.createKey(key, extensionName, windef.KEY_ACCESS.KEY_ALL_ACCESS);

        var appKey = registry.openKeyFromKeyObject(key, extensionName, windef.KEY_ACCESS.KEY_ALL_ACCESS);

        registry.setValueForKeyObject(appKey, '', windef.REG_VALUE_TYPE.REG_SZ, handlerName);
        appKey.close();

        registry.createKey(key, handlerName, windef.KEY_ACCESS.KEY_ALL_ACCESS);
        var handlerKey = registry.openKeyFromKeyObject(key, handlerName, windef.KEY_ACCESS.KEY_ALL_ACCESS);

        registry.setValueForKeyObject(handlerKey, '', windef.REG_VALUE_TYPE.REG_SZ, handlerDescription);
        registry.createKey(handlerKey, 'DefaultIcon', windef.KEY_ACCESS.KEY_ALL_ACCESS);

        var defaultIconKey = registry.openKeyFromKeyObject(handlerKey, 'DefaultIcon', windef.KEY_ACCESS.KEY_ALL_ACCESS);

        registry.setValueForKeyObject(defaultIconKey, '', windef.REG_VALUE_TYPE.REG_SZ, iconPath);

        registry.createKey(handlerKey, 'shell\\Open\\Command', windef.KEY_ACCESS.KEY_ALL_ACCESS);

        var commandKey = registry.openKeyFromKeyObject(handlerKey, 'shell\\Open\\Command', windef.KEY_ACCESS.KEY_ALL_ACCESS);
        registry.setValueForKeyObject(commandKey, '', windef.REG_VALUE_TYPE.REG_SZ, exePath);

        commandKey.close();
        handlerKey.close();
        key.close();
    }
};
