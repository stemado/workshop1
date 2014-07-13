//http://stackoverflow.com/questions/8595509/how-do-you-share-constants-in-nodejs-modules

//usage example
//var constants = require('./lib/constants');
//console.log(constants.MY_CONSTANT); // 'some value'


module.exports = Object.freeze({
    MY_DEFAULT_WORDS: ["I", "Love", "Node.js"],
    MY_DEFAULT_WORDS_2: ["I", "also", "love", "MongoDB"]
});


