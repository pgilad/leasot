const eol = require('eol');
const commentsUtil = require('../utils/comments');

module.exports = function({ customTags } = {}) {
    const regex = commentsUtil.getRegex(customTags);
    const commentsRegex = new RegExp('^\\s*%' + regex + '$', 'mig');

    return function parse(contents, file) {
        const comments = [];

        eol.split(contents).forEach(function(line, index) {
            let hashMatch = commentsRegex.exec(line);
            let comment;
            while (hashMatch) {
                comment = commentsUtil.prepareComment(hashMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                hashMatch = commentsRegex.exec(line);
            }
        });
        return comments;
    };
};
