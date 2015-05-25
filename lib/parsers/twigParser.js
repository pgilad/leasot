'use strict';
var regex = require('../regex');

var bangComment = new RegExp('{#' + regex + '#}', 'mig');
var htmlComment = new RegExp('<!--' + regex + '-->', 'mig');

module.exports = function (contents) {
    var comments = [];
    contents.split('\n').forEach(function (line, index) {
        var bangCommentMatch = bangComment.exec(line);
        while (bangCommentMatch) {
            if (!bangCommentMatch || !bangCommentMatch.length) {
                break;
            }
            //verify kind and text exists
            if (!bangCommentMatch[1] || !bangCommentMatch[2]) {
                break;
            }
            comments.push({
                kind: bangCommentMatch[1],
                text: bangCommentMatch[2].trim(),
                line: index + 1
            });
            bangCommentMatch = bangComment.exec(line);
        }

        var htmlCommentMatch = htmlComment.exec(line);
        while (htmlCommentMatch) {
            if (!htmlCommentMatch || !htmlCommentMatch.length) {
                break;
            }
            //verify kind and text exists
            if (!htmlCommentMatch[1] || !htmlCommentMatch[2]) {
                break;
            }
            comments.push({
                kind: htmlCommentMatch[1],
                text: htmlCommentMatch[2].trim(),
                line: index + 1
            });
            htmlCommentMatch = htmlComment.exec(line);
        }
    });
    // sort by line number
    comments = comments.sort(function (a, b) {
        return a.line - b.line;
    });
    return comments;
};
