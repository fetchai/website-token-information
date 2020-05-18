'use strict';

module.exports = function mapObject(obj, fn){

    var result = {}

    Object.keys(obj).forEach(function(key){
        result[key] = fn(obj[key])
    })

    return result
}