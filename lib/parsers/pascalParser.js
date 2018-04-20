const eol = require('eol');
const commentsUtil = require('../utils/comments');

module.exports = function({ customTags } = {}) {
    const regex = commentsUtil.getRegex(customTags);
    const commentsRegex = new RegExp('^\\s*//' + regex + '$', 'mig');
    const multiLineRegex = new RegExp('^\\s*{' + regex + '}$', 'mig');

    return function parse(contents, file) {
        let comments = [];

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

            let multiLineMatch = multiLineRegex.exec(line);
            while (multiLineMatch) {
                comment = commentsUtil.prepareComment(multiLineMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                multiLineMatch = multiLineRegex.exec(line);
            }
        });
        // sort by line number
        comments = comments.sort(function(a, b) {
            return a.line - b.line;
        });
        return comments;
    };
};
