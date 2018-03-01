'use strict';
var eol = require('eol');
var commentsUtil = require('../utils/comments');

module.exports = function (params) {
    params = params || {};
    var regex = commentsUtil.getRegex(params.customTags);
    var bangComment = new RegExp('<%#' + regex + '%>', 'mig');
    var htmlComment = new RegExp('<!--' + regex + '-->', 'mig');

    return function parse(contents, file) {
        var comments = [];

        eol.split(contents).forEach(function (line, index) {
            var bangCommentMatch = bangComment.exec(line);
            var comment;
            while (bangCommentMatch) {
                comment = commentsUtil.prepareComment(bangCommentMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                bangCommentMatch = bangComment.exec(line);
            }

            var htmlCommentMatch = htmlComment.exec(line);
            while (htmlCommentMatch) {
                comment = commentsUtil.prepareComment(htmlCommentMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                htmlCommentMatch = htmlComment.exec(line);
            }
        });
        return comments;
    };
};
