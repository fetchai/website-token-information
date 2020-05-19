'use strict';

module.exports = function(str){

	var result = {}

	str.split(';').forEach(function(style){
		var parts = style.split(':')

		if (parts.length){
			result[parts[0].trim()] = parts[1].trim()
		}
	})

	return result
}