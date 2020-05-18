'use strict';

var setStyle = require('./setStyle')
var map      = {}

var result = function(config){

    var element = map[config.id]

    if (!element){
        element = setStyle(document.createElement('div'), config.style || {})
        element.className = config.className

        if (config.appendTooltip){
            config.appendTooltip(element)
        } else {
            document.body.appendChild(element)
        }
        map[config.id] = element
    }

    return element
}

result.destroy = function(config){
	var element = map[config.id]

	if (element){
		var parent = element.parentNode
		parent && parent.removeChild(element)
	}
}

module.exports = result