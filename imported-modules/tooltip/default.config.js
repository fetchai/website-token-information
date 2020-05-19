'use strict';

module.exports = {
	entry: './src/index.js',
	node: {
	    global: true,
	    events: true,
	    
	    Buffer: false,
	    process: false,
	    __filename: false,
	    __dirname: false
	}
}