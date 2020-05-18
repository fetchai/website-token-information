'use strict';

var matches = require('matches-selector')

module.exports = function(root, selector){

	return function(event){

	    var target = event.target

	    while (target) {
	    	if (matches(target, selector)){
	    		return target
	    	}

	    	if (target == root){
	    		return
	    	}

	        target = target.parentNode
	    }

	}
}