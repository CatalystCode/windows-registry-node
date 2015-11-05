# windows-registry-node

Read and Write to the Windows registry in-process from Node.js. Easily set application file associations and other goodies &amp; such.

## Install

This library interacts with natvive Windows apis. Ensure you have Visual Studio 2013 or newer build tools. Using Visual Studio is not 
required. Then install the package:

```
npm install windows-registry-node
```

## Reading / Writing to the Windows Registry

This library implements only a few of the basic registry commands, which allow you to do basic CRUD 
operations for keys to the registry.

### Opening a Registry Key

Registry keys can be opened by either opening a predefined registry key defined in the [windef](lib/windef.js) module:

```js
var key = registry.openKeyFromPredefined(windef.HKEY.HKEY_CLASSES_ROOT, '.txt', windef.KEY_ACCESS.KEY_ALL_ACCESS);
```

Or you can open a sub key from an already opened key:

```js
var key = registry.openKeyFromPredefined(windef.HKEY.HKEY_CLASSES_ROOT, '.txt', windef.KEY_ACCESS.KEY_ALL_ACCESS);
```

And don't forget to close your key when you're done, otherwise, you'll leak native resources:

```js
key.close();
```

### Creating a Key

Creating a key just requires that you have a [Key](lib/key.js) object from either `registry.openKeyFromPredefined` or
`registry.openKeyFromKeyObject`.

```js
var key = registry.openKeyFromPredefined(windef.HKEY.HKEY_CLASSES_ROOT, '.txt', windef.KEY_ACCESS.KEY_ALL_ACCESS);
registry.createKey(key, '\test_key_name', windef.KEY_ACCESS.KEY_ALL_ACCESS);
```

### Delete a Key

Similarly to creating a key you need a [Key](lib/key.js) object and you must specify the subkey name.

```js
registry.deleteKey(key, '\test_key_name');
```

### Write a Value to a Key

To write a value, you'll again need a [Key](lib/key.js) object and just need to call the `registry.setValueForKeyObject` function:

```js
registry.setValueForKeyObject(key, 'test_value_name', windef.REG_VALUE_TYPE.REG_SZ, 'test_value');
``` 