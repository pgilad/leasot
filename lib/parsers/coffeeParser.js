const eol = require('eol');
const commentsUtil = require('../utils/comments');

module.exports = function(params) {
    params = params || {};
    const regex = commentsUtil.getRegex(params.customTags);
    const commentsRegex = new RegExp('^\\s*#' + regex + '$', 'mig');

    return function parse(contents, file) {
        const comments = [];

        eol.split(contents).forEach(function(line, index) {
            const match = commentsRegex.exec(line);
            const comment = commentsUtil.prepareComment(match, index + 1, file);
            if (!comment) {
                return;
            }
            comments.push(comment);
        });
        return comments;
    };
};
