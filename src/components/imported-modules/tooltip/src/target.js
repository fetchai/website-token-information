'use strict';

var Region = require('region-align')

var assign = require('object-assign');
var escape = require('escape-html')

var setStyle         = require('./setStyle')
var toOffset         = require('./toOffset')
var parseAsStyle     = require('./parseAsStyle')
var tooltipElement   = require('./tooltipElement')
var preparePositions = require('./preparePositions')
var mapObject        = require('./mapObject')

function emptyObject(obj){
    return mapObject(obj, function(){
        return ''
    })
}

module.exports = function(config){

    var prevStyle

    function showTooltip(target){
        debugger;
        var tooltip = target.getAttribute(config.attrName)

        var el = tooltipElement(config)
        el.innerHTML = config.escape? escape(tooltip): tooltip

        var positions    = config.alignPositions
        var elRegion     = Region.from(el)
        var targetRegion = Region.from(target)

        var attrPosition = target.getAttribute(config.attrName + '-positions')
        var attrStyle    = target.getAttribute(config.attrName + '-style')

        var style = assign({}, prevStyle, config.style)

        if (attrStyle){
            attrStyle = parseAsStyle(attrStyle)
            prevStyle = emptyObject(attrStyle)

            assign(style, attrStyle)
        }

        if (attrPosition){
            positions = preparePositions(attrPosition.split(';'))
        }

        var res = elRegion.alignTo(targetRegion, positions, {
            offset: toOffset(config.offset, positions),
            constrain: true
        })

        var scrollTop = document.body.scrollTop || 0
        var scrollLeft = document.body.scrollLeft || 0

        setStyle(el, style, config.visibleStyle, {
            top : elRegion.top + scrollTop,
            left: elRegion.left + scrollLeft
        })
    }

    function clearTooltip(){
        setStyle(
            tooltipElement(config),
            config.hiddenStyle
        )
    }

    var currentTarget

    var withTarget = (function(){

        var prevId

        return function(target){

            if (target != currentTarget){
                if (prevId){
                    clearTimeout(prevId)
                    prevId = null
                }

                if (target){

                    if (config.showDelay){

                        prevId = setTimeout(function(){
                            prevId = null
                            showTooltip(target)
                        }, config.showDelay)
                    } else {
                        showTooltip(target)
                    }

                } else {
                    clearTooltip()
                }
            }

            currentTarget = target
        }
    })()

    var setter = (function(){
        var lastValue
        var PREV_ID

        return function setter(value){

            if (value == lastValue){
                return
            }

            lastValue = value

            if (config.hideOnChange){

                if (PREV_ID || value){

                    if (PREV_ID){
                        clearTimeout(PREV_ID)
                    }

                    PREV_ID = setTimeout(function(){
                        PREV_ID = null
                        withTarget(lastValue)
                    }, config.hideOnChangeDelay)
                }

                value = null
            }

            withTarget(value)
        }

    })()

    var HOLD = false

    return {

        showTooltip: showTooltip,
        clearTooltip: clearTooltip,
        destroy: function(){
            tooltipElement.destroy(config)
        },

        hold: function() {
            HOLD = true
        },

        onHold: function() {
            return HOLD
        },

        set: function(value){
            HOLD = false
            setter(value)
        },

        getCurrentTarget: function(){
            return currentTarget
        }
    }

}