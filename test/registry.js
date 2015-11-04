/* global describe, it */
'use strict';
var registry = require('../lib/registry'),
	windef = require('../lib/windef'),
	assert = require('assert');

describe('Registry API open tests', function() {
	
	it('Should open a subkey provided a predefined key', () => {
		var key = registry.openKey(windef.HKEY.HKEY_CLASSES_ROOT, 'MyProgram');
	
		assert.equal(key.pointer != null);
	});
	
	it('Should open a subkey provided a previously opened key', () => {
		var key = registry.openKey(windef.HKEY.HKEY_CLASSES_ROOT, 'TestProgram');
		var key2 = registry.openKey(key, 'Subkey');
		assert.equal(key2.pointer != null);
	});
	
	it('Should open a subkey provided a previously opened key', () => {
		var key = registry.openKey(windef.HKEY.HKEY_CLASSES_ROOT, 'TestProgram');
		var key2 = registry.openKey(key, 'Subkey');
		assert.equal(key2.pointer != null);
	});
});


describe('Registry API key read test', function() {
	
	it('Should read a key value provided a key and value name', () => {
		var key = registry.openKey(windef.HKEY.HKEY_CLASSES_ROOT, 'MyProgram');
		
		assert.equal(key.pointer != null);
	});
	
	it('Should open a subkey provided a previously opened key', () => {
		var key = registry.openKey(windef.HKEY.HKEY_CLASSES_ROOT, 'TestProgram');
		var key2 = registry.openKey(key, 'Subkey');
		assert.equal(key2.pointer != null);
	});
	
	it('Should open a subkey provided a previously opened key', () => {
		var key = registry.openKey(windef.HKEY.HKEY_CLASSES_ROOT, 'TestProgram');
		var key2 = registry.openKey(key, 'Subkey');
		assert.equal(key2.pointer != null);
	})

});
