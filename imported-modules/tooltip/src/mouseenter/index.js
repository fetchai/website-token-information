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

module.exports = function(el, selector, fn, isMobile){

    var eventMatches = testEventMatches(el, selector)

    var onMouseOver = function(event){
        var target = event.target
        var related = event.relatedTarget

        // console.log(event.target, event.relatedTarget)

        // has() returns true if we move into target from related,
        // where related is a child of target

        var match

        // if (!related || (related !== target && has(target, related))){
            if (match = eventMatches(event)){
                fn(match, event)
            }
        // }
    }
    debugger;
    if(!isMobile) {
        el.addEventListener('mouseover', onMouseOver)
    }

    return function(){
        el.removeEventListener('mouseover', onMouseOver)
    }
}
