'use strict';

var signs = {
	t: { 
		x: 1,
		y: 1
	},
	l: {
		x: 1,
		y: 1
	},
	b: {
		x: 1,
		y: -1
	},
	r: {
		x: -1,
		y: 1
	}
}

/**
 * Given the offset (x,y, or left,top or array), returns an array of offsets, for each given position
 *
 * For example, if we align br-tl, it means we align br of tooltip to tl of target,
 * so for this position we should return an offset of {-x,-y} of the original offset
 * 
 * @param  {Object}
 * @param  {Array}
 * @return {Array}
 */
module.exports = function(offset, positions){

	if (!offset){
		return
	}

	var array

	if (Array.isArray(offset)){
		array = offset
	}

	array = offset.x != undefined?
			[offset.x, offset.y]:
			[offset.left, offset.top]

	var x = array[0]
	var y = array[1]

	return positions.map(function(pos){
		var parts = pos.split('-')

		var first = parts[0]

		var side1 = first[0]
		var side2 = first[1]

		var sign1 = signs[side1]
		var sign2 = signs[side2]

		var xSign = 1
		var ySign = 1

		if (sign1){
			xSign *= sign1.x
			ySign *= sign1.y
		}
		if (sign2){
			xSign *= sign2.x
			ySign *= sign2.y
		}

		return [x * xSign, y * ySign]
	})
}