const eol = require('eol');
const commentsUtil = require('../utils/comments');
// I know this is different style, but I wasn't able to get the escape
// characters right
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
        // doing the multiline match outside of the loop because we need
        // multiple lines
        const multilineRegex = new RegExp('^\\s*\\\\begin{comment}' + regex + '\\\\end{comment}$', 'misg');
        let multiLineMatch = multilineRegex.exec(contents);
        if (multiLineMatch) {
            // Since we no longer know the line number as index, we have to
            // count it out. This could be inefficient for large files, so I
            // hope it doesn't become a performance problem
            preceeding_lines = contents.slice(0, multiLineMatch.index)
            line_no = preceeding_lines.split(/\r\n|\r|\n/).length
            // Now prepare the comment
            comment = commentsUtil.prepareComment(multiLineMatch, line_no + 1, file);
            comments.push(comment);
        }
        return comments;
    };
};
