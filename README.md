# windows-registry-node

[![Build status](https://ci.appveyor.com/api/projects/status/ot69wbkyrcv7ig3p/branch/master?svg=true)](https://ci.appveyor.com/project/sedouard/windows-registry-node/branch/master)

Read and Write to the Windows registry in-process from Node.js. Easily set application file associations and launch processes as an Administrator.

## Install

This library interacts with native Windows APIs. To add this module to your Node application, install the package:

```
npm install windows-registry

```

To install node modules that require compilation on Windows, make sure you have installed the [necessary build tools](https://github.com/nodejs/node-gyp#installation). Specifically, we need `npm install -g node-gyp`, a cross-platform cli written in Node.js for native addon modules for Node.js. 

To install `node-gyp`, install [python v2.7.3](http://www.python.org/download/releases/2.7.3#download) and [Visual Studio 2013 build tools](http://www.microsoft.com/en-gb/download/details.aspx?id=44914). You do not need to install the full Visual Studio, only the build tools are required. Once the build tools are installed, you should be able to do `npm install -g node-gyp`. 

## Creating File Associations

To create a file association, you can call the `fileAssociation.associateExeForFile` API, which will make windows assign a default program for an arbitrary file extension:

```js
var utils = require('windows-registry').utils;
utils.associateExeForFile('myTestHandler', 'A test handler for unit tests', 'C:\\path\\to\\icon', 'C:\\Program Files\\nodejs\\node.exe %1', '.zzz');

```
After running the code above, you will see files with the extension of `.zzz` will be automatically associated with the Node program and their file icon will be changed to the Node file icon.

!['GIF showing file association'](https://github.com/CatalystCode/windows-registry-node/blob/readmeblob/fileassoc.jpg)

## Reading and Writing to the Windows Registry

This library implements only a few of the basic registry commands, which allow you to do basic CRUD 
operations for keys in the registry.

### Opening a Registry Key

Registry keys can be opened by either opening a predefined registry key defined in the [windef](lib/windef.js) module:

```js
var Key = require('windows-registry').Key;
var key = new Key(windef.HKEY.HKEY_CLASSES_ROOT, '.txt', windef.KEY_ACCESS.KEY_ALL_ACCESS);

```

Or you can open a sub key from an already opened key:

```js
var Key = require('windows-registry').Key;
var key = new Key(windef.HKEY.HKEY_CLASSES_ROOT, '', windef.KEY_ACCESS.KEY_ALL_ACCESS);
var key2 = key.openSubKey('.txt', windef.KEY_ACCESS.KEY_ALL_ACCESS);

```

And don't forget to close your key when you're done. Otherwise, you will leak native resources:

```js
key.close();

```

### Creating a Key

Creating a key just requires that you have a [Key](lib/key.js) object by either using the [predefined keys](https://github.com/CatalystCode/windows-registry-node/blob/master/lib/windef.js#L27) within the `windef.HKEY` or opening a subkey from an existing key.

```js
var Key = require('windows-registry').Key;
// predefined key
var key = new Key(windef.HKEY.HKEY_CLASSES_ROOT, '', windef.KEY_ACCESS.KEY_ALL_ACCESS);
var createdKey = key.createSubKey('\test_key_name', windef.KEY_ACCESS.KEY_ALL_ACCESS);

```

### Deleting a Key
To delete a key just call the `Key.deleteKey()` function.

```js
createdKey.deleteKey();

```

### Writing a Value to a Key

To write a value, you will again need a [Key](lib/key.js) object and just need to call the `Key.setValue` function:

```js
var Key = require('windows-registry').Key,
	windef = require('windows-registry').windef;

var key = new Key(windef.HKEY.HKEY_CLASSES_ROOT, '.txt', windef.KEY_ACCESS.KEY_ALL_ACCESS);
key.setValue('test_value_name', windef.REG_VALUE_TYPE.REG_SZ, 'test_value');

``` 

### Get a Value From a Key

To get a value from a key, just call `Key.getValue`:

```js
var value = key.getValue('test_value_name');
```

The return value depends on the type of the key (REG_SZ for example will give you a string).

## Launching a Process as an Admin

To launch a process as an Administrator, you can call the `utils.elevate` API, which will launch a process as an Administrator causing the UAC (User Account Control) elevation prompt to appear if required. This is similar to the Windows Explorer command "Run as administrator".  Pass in `FILEPATH` to the process you want to elevate. Pass in any`PARAMETERS` to run with the process. Since this is an asynchronous call, pass in a callback to handle user's selection.

```js
var utils = require('windows-registry').utils;
utils.elevate('C:\\Program Files\\nodejs\\node.exe', 'index.js', function (err, result){console.log(result);});

```
The process you want to launch with admin access will only be launched after the callback is called and only if the user clicks Yes in the UAC prompt. Otherwise, the process will not be launched. If the user is already running as an admin, the UAC prompt will not be triggered and the process you provided will be launched as an administrator automatically.

!['GIF showing launch process as an admin'](https://github.com/CatalystCode/windows-registry-node/blob/readmeblob/elevate.gif)

## More Docs?

Make your way over to the [tests section](test) to see how the module can be used.

