'use strict';
var ffi = require('ffi'),
	types = require('./types');

var advApi = ffi.Library('Advapi32', {
  'RegOpenCurrentUser': [ 'uint64', [ types.REGSAM, types.PHKEY ] ],
  'RegQueryValueExA' : ['uint64', [types.HKEY, 'string', 'pointer', types.LPDWORD, types.LPBYTE, types.LPDWORD]],
  'RegOpenKeyExA' : ['uint64', ['uint64', 'string', types.DWORD, types.REGSAM, types.PHKEY]],
  'RegSetValueExA' : [ 'uint64', [types.HKEY, 'string', 'pointer', types.DWORD, types.LPBYTE, types.DWORD ] ]
});

class Key {
	constructor(pHkey, path) {
		
	}
}

var api = {
  openKey: function (key, subKeyName) {
    
  },
  queryValue: function (key, valueName) {
    
  },
  setValue: function (key, valueName, valueType, value) {
    
  }
}

module.exports = api;