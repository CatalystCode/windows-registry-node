# windows-registry-node

[![Build status](https://ci.appveyor.com/api/projects/status/ot69wbkyrcv7ig3p/branch/master?svg=true)](https://ci.appveyor.com/project/sedouard/windows-registry-node/branch/master)

Read and Write to the Windows registry in-process from Node.js. Easily set application file associations and other goodies &amp; such. You can also enable your application to run processes as an Administrator.

## Install

This library interacts with natvive Windows apis. Ensure you have Visual Studio 2013 or newer build tools. Using Visual Studio is not 
required. Then install the package:

```
npm install windows-registry-node
```

## Creating File Associations

To create a file association you can call the `fileAssociation.associateExeForFile` api which will make windows assign a default program for
an arbitrary file extension:

```js
var utils = require('windows-registry');
utils.associateExeForFile('myTestHandler', 'A test handler for unit tests', 'C:\\path\\to\\icon', 'C:\\Program Files\\nodejs\\node.exe %1', '.zzz');
```
## Reading / Writing to the Windows Registry

This library implements only a few of the basic registry commands, which allow you to do basic CRUD 
operations for keys to the registry.

### Opening a Registry Key

Registry keys can be opened by either opening a predefined registry key defined in the [windef](lib/windef.js) module:

```js
var Key = require('windows-registry').Key;
var key = new Key(windef.HKEY.HKEY_CLASSES_ROOT, '.txt', windef.KEY_ACCESS.KEY_ALL_ACCESS);
```

Or you can open a sub key from an already opened key:

```js
var key = new Key(windef.HKEY.HKEY_CLASSES_ROOT, '', windef.KEY_ACCESS.KEY_ALL_ACCESS);
var key2 = key.openSubKey('.txt', windef.KEY_ACCESS.KEY_ALL_ACCESS);
```

And don't forget to close your key when you're done, otherwise, you'll leak native resources:

```js
key.close();
```

### Creating a Key

Creating a key just requires that you have a [Key](lib/key.js) object by either using the [predefined keys](https://github.com/CatalystCode/windows-registry-node/blob/master/lib/windef.js#L27) within the `windef.HKEY` or opening a subkey from an existing key.

```js
// predefined key
var key = registry.openKeyFromPredefined(windef.HKEY.HKEY_CLASSES_ROOT, '.txt', windef.KEY_ACCESS.KEY_ALL_ACCESS);
var createdKey = key.createSubKey('\test_key_name', windef.KEY_ACCESS.KEY_ALL_ACCESS);
```

### Delete a Key

To delete a key just call the `Key.deleteKey()` function.

```js
createdKey.deleteKey();
```

### Write a Value to a Key

To write a value, you'll again need a [Key](lib/key.js) object and just need to call the `registry.setValueForKeyObject` function:

```js
var key = new Key(windef.HKEY.HKEY_CLASSES_ROOT, '.txt', windef.KEY_ACCESS.KEY_ALL_ACCESS);
key.setValue('test_value_name', windef.REG_VALUE_TYPE.REG_SZ, 'test_value');
``` 

### Get a Value From a Key

To get a value from a key, just call `Key.getValue`:

```js
var value = key.getValue('test_value_name');
```

The return value depends on the type of the key (REG_SZ for example will give you a string).

## Launching a Process as An Admin

To launch a process as an Administrator, you can call the `uac.elevate` api, which will launch a process as an Administrator causing the UAC (User Account Control) elevation prompt to appear if required. This is similar to the Windows Explorer command "Run as administrator".  Pass in `FILEPATH` to the process you want to elevate. Pass in any`PARAMETERS` to run with the process. Since this is an asychronous call, pass in a callback to handle user's selection.

```js
uac.elevate('C:\\Program Files\\nodejs\\node.exe', 'index.js', function (err, result){console.log('callback');});
```

## More Docs?

Make your way over to the [tests section](test) to see how the module can be used.
