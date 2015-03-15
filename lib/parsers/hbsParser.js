//test for comments that have todo/fixme + text
var rCommentsValidator = /{{!(?:--)?\s*@?(todo|fixme)[\s:]+(.+?)\s*(?:--)?}}/mig;

module.exports = function(contents) {
    'use strict';

    var comments = [];
    contents.split('\n').forEach(function(line, index) {
        var match = rCommentsValidator.exec(line);
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
            match = rCommentsValidator.exec(line);
        }
    });
    return comments;
};
