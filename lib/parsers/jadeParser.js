'use strict';
var regex = require('../regex');
var commentsRegex = new RegExp('^\\s*\\/\\/-?' + regex + '$', 'mig');

module.exports = function (contents) {
    var comments = [];
    contents.split('\n').forEach(function (line, index) {
        var match = commentsRegex.exec(line);
        if (!match || !match.length) {
            return;
        }
        //verify kind exists
        if (!match[1]) {
            return;
        }
        comments.push({
            kind: match[1],
            text: match[2].trim(),
            line: index + 1
        });
    });
    return comments;
};
