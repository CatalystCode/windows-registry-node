/* global process, after */
var mockery = require('mockery');

if (process.env.TEST_MOCKS_ON) {
    mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false
    });
}

mockery.registerMock('ffi', require('./mock/ffi'));

after(() => {
    mockery.disable();
});
