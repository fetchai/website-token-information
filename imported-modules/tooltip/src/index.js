'use strict';

var throttle  = require('./throttle')
var targetFn  = require('./target')
var configure = require('./config')

var mouseenter = require('./mouseenter')
var mouseleave = require('./mouseleave')

var contains = require('contains')

var TOOLTIP = function(cfg){

	var config = configure(cfg)
	var target = targetFn(config)
	var root   = config.target
	var t      = config.throttle

	//make the target && protection since it might be destroyed by that time
    var onMouseOver = throttle(function(eventTarget){
        target && target.set(eventTarget)
    }, t)

    var onMouseOut = throttle(function(eventTarget){

        target && target.hold()
        setTimeout(function(){
            if (target && target.onHold()){
                target.set(null)
            }
        }, t)

    }, t)

    var removeMouseEnter = mouseenter(root, config.selector, onMouseOver, cfg.isMobile)
    var removeMouseLeave = mouseleave(root, config.selector, onMouseOut)

    var onMouseMove = throttle(function(){
        var currentTarget = target.getCurrentTarget()

        if (currentTarget && !contains(document.documentElement, currentTarget)){
            target.set(null)
        }
    }, 200)

    root.addEventListener('mousemove', onMouseMove)

    return {
	      target: target,
        destroy: function(){

        	target.destroy()

            removeMouseEnter()
            removeMouseLeave()
            root.removeEventListener('mousemove', onMouseMove)

			root   = null
			target = null
			config = null
        }
    }
}

module.exports = TOOLTIP