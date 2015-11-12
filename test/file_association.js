/* global describe, it */
'use strict';
if (process.env.TEST_MOCKS_ON) {
    require('./test_helper');
}

var utils = require('../lib/utils'),
    assert = require('assert');

describe('File Association Test', () => {
    it('Should create a file association for *.zzz files', () => {
        utils.associateExeForFile('myTestHandler', 'A test handler for unit tests', '', 'C:\\Program Files\\nodejs\\node.exe %1', '.zzz');
        assert(true);
    });
});
