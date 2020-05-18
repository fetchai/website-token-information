'use strict';

var config          = require('./config')
var matchesSelector = require('matches-selector')

module.exports = function(target){
    return matchesSelector(target, '[' + config().attrName + ']')
}