/* global describe, it */
'use strict';
if (process.env.TEST_MOCKS_ON) {
    require('./test_helper');
}

var utils = require('../index').utils,
    assert = require('assert');

describe('File Association Test', () => {
    it('Should create a file association for *.zzz files', () => {
        utils.associateExeForFile('myTestHandler', 'A test handler for unit tests', '', 'C:\\Program Files\\nodejs\\node.exe %1', '.zzz');
        assert(true);
    });
});

describe('UAC elevate tests', () => {
    it('Should get results for elevate for a given file', (done) => {
        utils.elevate('C:\\Program Files\\nodejs\\node.exe', 'index.js', function (err, result) {
            assert.equal(err, null);
            assert.equal(result, true);
            done();
        });
    });

    it('Empty file path, should return with error', (done) => {
        utils.elevate('', null, function (err, result) {
            assert.equal(err, 'Missing filepath');
            assert.equal(result, null);
            done();
        });
    });

    it('Null file path, should return with error', (done) => {
        utils.elevate(null, null, function (err, result) {
            assert.equal(err, 'Missing filepath');
            assert.equal(result, null);
            done();
        });
    });
});
