'use strict';

var testEventMatches = require('../eventMatches');

function returnTrue(){
    return true
}

function contains(haystack, needle) {
    var targ = needle
    while (targ && targ !== haystack) {
        targ = targ.parentNode
    }
    return targ !== haystack
}

module.exports = function(el, selector, fn, config){

    var has = config && config.allowNested?
                returnTrue:
                contains

    var eventMatches = testEventMatches(el, selector)

    var onMouseOut = function(event){
        var target = event.target
        var related = event.relatedTarget

        // console.log(event.target, event.relatedTarget)

        // has() returns true if we move into target from related, 
        // where related is a child of target

        var match

        if (!related || (related !== target && has(target, related))){
            if (match = eventMatches(event)){
                fn(match, event)
            }
        }
    }

    el.addEventListener('mouseout', onMouseOut)

    return function(){
        el.removeEventListener('mouseout', onMouseOut)
    }
}
