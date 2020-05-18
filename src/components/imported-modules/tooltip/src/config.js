'use strict';

var assign = require('object-assign')
var clone  = require('clone')

var DEFAULT = {
    attrName: 'data-tooltip',
    throttle: 10,
    showDelay: 500,
    offset: {
        x: 5,
        y: 5
    },
    hideOnChange: true,
    hideOnChangeDelay: 500,
    className: 'tooltip',
    style: {
        padding: 5,
        border: '1px solid gray',
        background: 'white',

    	boxSizing    : 'border-box',
    	pointerEvents: 'none',
    	position     : 'absolute',
    	visibility   : 'hidden',
    	display      : 'inline-block',
        transform    : 'translate3d(0px, 0px, 0px)',
    	transition   : 'opacity 0.3s'//, top 0.2s, left 0.2s'
    },
    visibleStyle: {
        opacity:1,
        visibility: 'visible'
    },
    hiddenStyle : {
        opacity: 0
    },
    alignPositions: null
}

var preparePositions = require('./preparePositions')

var id = 0

module.exports = function(values){
    values = values || {}

    var style        = assign({}, DEFAULT.style, values.style)
    var visibleStyle = assign({}, DEFAULT.visibleStyle, values.visibleStyle)
    var hiddenStyle  = assign({}, DEFAULT.hiddenStyle, values.hiddenStyle)

    var config = clone(assign({}, DEFAULT, values))

    config.style        = style
    config.visibleStyle = visibleStyle
    config.hiddenStyle  = hiddenStyle

    config.selector = '[' + config.attrName + ']'

    config.alignPositions = preparePositions(config.alignPositions)
    config.target = config.target || document.documentElement

    config.id = id++

    return config
}