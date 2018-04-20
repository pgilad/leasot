const eol = require('eol');
const commentsUtil = require('../utils/comments');

module.exports = function({ customTags } = {}) {
    const regex = commentsUtil.getRegex(customTags);
    const commentsRegex = new RegExp('{{!(?:--)?' + regex + '(?:--)?}}', 'mig');

    return function parse(contents, file) {
        const comments = [];

        eol.split(contents).forEach(function(line, index) {
            let match = commentsRegex.exec(line);
            while (match) {
                const comment = commentsUtil.prepareComment(match, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                match = commentsRegex.exec(line);
            }
        });
        return comments;
    };
};
