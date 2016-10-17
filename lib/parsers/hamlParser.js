'use strict';
var commentsUtil = require('../utils/comments');

module.exports = function (params) {
    params = params || {};
    var regex = commentsUtil.getRegex(params.customTags);
    var hamlRubyComment = new RegExp('^\\s*-#' + regex + '$', 'mig');
    var hamlHtmlComment = new RegExp('^\\s*/' + regex + '$', 'mig');
    var erbComment = new RegExp('<%#' + regex + '%>', 'mig');
    var htmlComment = new RegExp('<!--' + regex + '-->', 'mig');

    return function parse(contents, file) {
        var comments = [];

        contents.split('\n').forEach(function (line, index) {

            var hamlRubyCommentMatch = hamlRubyComment.exec(line);
            var hamlHtmlCommentMatch = hamlHtmlComment.exec(line);
            var erbCommentMatch = erbComment.exec(line);
            var htmlCommentMatch = htmlComment.exec(line);
            var comment;

            while (hamlRubyCommentMatch) {
                comment = commentsUtil.prepareComment(hamlRubyCommentMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                hamlRubyCommentMatch = hamlRubyComment.exec(line);
            }

            while (hamlHtmlCommentMatch) {
                comment = commentsUtil.prepareComment(hamlHtmlCommentMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);

                hamlHtmlCommentMatch = hamlHtmlComment.exec(line);
            }

            while (erbCommentMatch) {
                comment = commentsUtil.prepareComment(erbCommentMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                erbCommentMatch = erbComment.exec(line);
            }

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
