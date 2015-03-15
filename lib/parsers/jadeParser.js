//test for comments that have todo/fixme + text
var rCommentsValidator = /^\s*\/\/-?\s*@?(todo|fixme)[\s:]+(.+)/i;

module.exports = function (contents) {
    'use strict';

    var comments = [];
    contents.split('\n').forEach(function (line, index) {
        var match = line.match(rCommentsValidator);
        if (!match || !match.length) {
            return;
        }
        //verify kind and text exists
        if (!match[1] || !match[2]) {
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
