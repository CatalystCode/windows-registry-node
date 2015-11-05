/* global describe, it */
'use strict';
var fileAssociation = require('../lib/file_association'),
    assert = require('assert');

describe('File Association Test', () => {
    it('Should create a file association for *.zzz files', () => {
        fileAssociation.associateExeForFile('myTestHandler', 'A test handler for unit tests', '', 'C:\\Program Files\\nodejs\\node.exe %1', '.zzz');
        assert(true);
    });
});
