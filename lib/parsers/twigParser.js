//test for comments that have todo/fixme + text
var bangComment = /{#\s*@?(todo|fixme)\s*:?\s*(.+?)\s*#}/mig;
var htmlComment = /<!--\s*@?(todo|fixme)\s*:?\s*(.+?)\s*-->/mig;

module.exports = function (contents) {
    'use strict';

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
    return comments;
};
