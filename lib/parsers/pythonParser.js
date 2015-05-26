'use strict';
var regex = require('../regex');

var commentsRegex = new RegExp('^\\s*#' + regex + '$', 'mig');
var multiLineRegex = new RegExp('^\\s*"""' + regex + '"""$', 'mig');

module.exports = function (contents) {
    var comments = [];
    contents.split('\n').forEach(function (line, index) {
        var hashMatch = commentsRegex.exec(line);
        while (hashMatch) {
            if (!hashMatch || !hashMatch.length) {
                break;
            }
            //verify kind exists
            if (!hashMatch[1]) {
                break;
            }
            comments.push({
                kind: hashMatch[1],
                text: hashMatch[2].trim(),
                line: index + 1
            });
            hashMatch = commentsRegex.exec(line);
        }

        var multiLineMatch = multiLineRegex.exec(line);
        while (multiLineMatch) {
            if (!multiLineMatch || !multiLineMatch.length) {
                break;
            }
            //verify kind exists
            if (!multiLineMatch[1]) {
                break;
            }
            comments.push({
                kind: multiLineMatch[1],
                text: multiLineMatch[2].trim(),
                line: index + 1
            });
            multiLineMatch = multiLineRegex.exec(line);
        }
    });
    // sort by line number
    comments = comments.sort(function (a, b) {
        return a.line - b.line;
    });
    return comments;
};
