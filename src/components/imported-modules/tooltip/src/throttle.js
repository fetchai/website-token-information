'use strict';

module.exports = function(fn, delay, scope) {
    var timeoutId = -1
    var self
    var args

    if (delay === undefined){
        delay = 0
    }

    if (delay < 0){
        return fn
    }

    return function () {

        self = scope || this
        args = arguments

        if (timeoutId !== -1) {
            //the function was called once again in the delay interval
        } else {
            timeoutId = setTimeout(function () {
                fn.apply(self, args)

                self = null
                timeoutId = -1
            }, delay)
        }

    }

}