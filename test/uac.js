/* global describe, it */
'use strict';
var uac = require('../lib/uac'),
	assert = require('assert');

describe('UAC elevate tests', () => {
    it('Empty file path, should return', () => {
        uac.elevate('', null, function (err, result) {
            assert.equal(result, true);
        });
        assert.equal(uac.FILEPATH, '');
    });

    it('Missing file path, should return', () => {
        uac.elevate(null, null, function (err, result) {
            assert.equal(result, true);
        });
        assert.equal(uac.FILEPATH, null);
        assert.equal(uac.PARAMETERS, null);
    });

    it('Should get results for elevate for a given file', (done) => {
        uac.elevate('C:\\Program Files\\nodejs\\node.exe', null, function (err, result) {
            try {
                assert.ok(true);
                console.log('callback');
                assert(result !== null);
                done();
            } catch (x) {
                done(x);
            }
        });
        assert.equal(uac.FILEPATH, 'C:\\Program Files\\nodejs\\node.exe');
        assert.equal(uac.PARAMETERS, null);
    });

    it('Should get results for elevate for a given file and parameter', (done) => {
        uac.elevate('C:\\Program Files\\nodejs\\node.exe', '--version', function (err, result) {
            try {
                assert.ok(true);
                console.log('callback');
                assert(result !== null);
                done();
            } catch (x) {
                done(x);
            }
        });
        assert.equal(uac.FILEPATH, 'C:\\Program Files\\nodejs\\node.exe');
        assert.equal(uac.PARAMETERS, '--version');
    });
});
