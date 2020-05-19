'use strict';

var TRANSLATE_POS = {
    top: 'bc-tc',
    bottom: 'tc-bc',
    left: 'rc-lc',
    right: 'lc-rc',
    topleft: 'br-tl',
    topright: 'bl-tr',
    bottomleft: 'tr-bl',
    bottomright: 'tl-br'
}

module.exports = function preparePositions(positions){
    positions = positions || [
        'topleft',
        'topright',
        'bottomleft',
        'bottomright',
        'top',
        'bottom'
    ]

    return positions.map(function(pos){
        pos = pos.trim()
        return TRANSLATE_POS[pos] || pos
    }).filter(function(pos){
        return !!pos
    })
}