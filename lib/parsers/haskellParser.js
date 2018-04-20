const eol = require('eol');
const commentsUtil = require('../utils/comments');

module.exports = function({ customTags } = {}) {
    const regex = commentsUtil.getRegex(customTags);
    const commentsRegex = new RegExp('^\\s*--' + regex + '$', 'mig');

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
