'use strict';
var commentsUtil = require('../utils/comments');

module.exports = function (params) {
    params = params || {};
    var regex = commentsUtil.getRegex(params.customTags);
    var ssCommentRegex = new RegExp('<%--' + regex + '--%>', 'mig');
    var htmlCommentRegex = new RegExp('<!--' + regex + '-->', 'mig');

    return function parse(contents, file) {
        var comments = [];

        contents.split('\n').forEach(function (line, index) {
            var ssCommentsMatch = ssCommentRegex.exec(line);
            var comment;
            while (ssCommentsMatch) {
                comment = commentsUtil.prepareComment(ssCommentsMatch, index + 1, file);
                if (!comment) {
                    return;
                }
                comments.push(comment);
                ssCommentsMatch = ssCommentRegex.exec(line);
            }

            var htmlCommentMatch = htmlCommentRegex.exec(line);
            while (htmlCommentMatch) {
                comment = commentsUtil.prepareComment(htmlCommentMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                htmlCommentMatch = htmlCommentRegex.exec(line);
            }
        });
        return comments;
    };
};
