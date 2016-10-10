var register = require('babel-core/register');
require("babel-polyfill");

register({
    presets: ['stage-3']
});

require('./app.js');