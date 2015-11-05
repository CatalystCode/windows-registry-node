'use strict';
var registry = require('./registry'),
    windef = require('./windef');
module.exports = {
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
    }
};
