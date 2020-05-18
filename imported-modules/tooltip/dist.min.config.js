'use strict';

var assign = require('object-assign');
var config = require('./default.config.js')

module.exports = assign(config, {
    output: {
        path         : __dirname + '/dist',
        libraryTarget: 'umd',
        library      : 'Tooltip',
        filename     : 'Tooltip.min.js'
    }
})