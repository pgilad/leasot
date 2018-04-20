const eol = require('eol');
const commentsUtil = require('../utils/comments');

module.exports = function({ customTags } = {}) {
    const regex = commentsUtil.getRegex(customTags);
    const hamlRubyComment = new RegExp('^\\s*-#' + regex + '$', 'mig');
    const hamlHtmlComment = new RegExp('^\\s*/' + regex + '$', 'mig');
    const erbComment = new RegExp('<%#' + regex + '%>', 'mig');
    const htmlComment = new RegExp('<!--' + regex + '-->', 'mig');

    return function parse(contents, file) {
        const comments = [];

        eol.split(contents).forEach(function(line, index) {
            let hamlRubyCommentMatch = hamlRubyComment.exec(line);
            let hamlHtmlCommentMatch = hamlHtmlComment.exec(line);
            let erbCommentMatch = erbComment.exec(line);
            let htmlCommentMatch = htmlComment.exec(line);
            let comment;

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
