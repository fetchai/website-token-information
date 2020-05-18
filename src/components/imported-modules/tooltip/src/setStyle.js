'use strict';

var toStyleObject = require('to-style').object
var normalize     = require('react-style-normalizer')
var assign = require('object-assign')

function toStyle(style){
	return toStyleObject(normalize(style))
}

function setStyle(element, style){

	style = toStyle(style)

	Object.keys(style).forEach(function(key){
	    element.style[key] = style[key]
	})

	return element
}

module.exports = function(element, style /*, style2 */){

	var args = [].slice.call(arguments, 1)

	var styles = [{}].concat(args).map(toStyle)

	var style = assign.apply(null, styles)

	setStyle(element, style)

	return element
}