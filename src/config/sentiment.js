'use strict';

let idWords = require('../../data/sample-id-words.json');
var Sentiment = require('sentiment');
var sentiment = new Sentiment();

var idLanguage = {
  labels: idWords,
};
sentiment.registerLanguage('id', idLanguage);

module.exports = {
  analyze: function (word = '') {
    return sentiment.analyze(word, { language: 'id' });
  },
};
