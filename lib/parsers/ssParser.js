const eol = require('eol');
const commentsUtil = require('../utils/comments');

module.exports = function({ customTags } = {}) {
    const regex = commentsUtil.getRegex(customTags);
    const ssCommentRegex = new RegExp('<%--' + regex + '--%>', 'mig');
    const htmlCommentRegex = new RegExp('<!--' + regex + '-->', 'mig');

    return function parse(contents, file) {
        const comments = [];

        eol.split(contents).forEach(function(line, index) {
            let ssCommentsMatch = ssCommentRegex.exec(line);
            let comment;
            while (ssCommentsMatch) {
                comment = commentsUtil.prepareComment(ssCommentsMatch, index + 1, file);
                if (!comment) {
                    return;
                }
                comments.push(comment);
                ssCommentsMatch = ssCommentRegex.exec(line);
            }

            let htmlCommentMatch = htmlCommentRegex.exec(line);
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
