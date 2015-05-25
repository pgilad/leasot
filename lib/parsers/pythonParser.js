'use strict';
var regex = require('../regex');
var commentsRegex = new RegExp('^\\s*#' + regex + '$', 'mig');
var multiLineRegex = new RegExp('^\\s*"""' + regex + '"""$', 'mig');

module.exports = function (contents) {
    var lines = contents.split('\n');

    var comments = [];
    lines.forEach(function (line, index) {
        var match = commentsRegex.exec(line);
        while (match) {
            if (!match || !match.length) {
                break;
            }
            //verify kind and text exists
            if (!match[1] || !match[2]) {
                break;
            }
            comments.push({
                kind: match[1],
                text: match[2].trim(),
                line: index + 1
            });
            match = commentsRegex.exec(line);
        }

        var match = multiLineRegex.exec(line);
        while (match) {
            if (!match || !match.length) {
                break;
            }
            //verify kind and text exists
            if (!match[1] || !match[2]) {
                break;
            }
            comments.push({
                kind: match[1],
                text: match[2].trim(),
                line: index + 1
            });
            match = multiLineRegex.exec(line);
        }
    });
    return comments;
};
