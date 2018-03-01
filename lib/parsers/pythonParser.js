'use strict';
var eol = require('eol');
var commentsUtil = require('../utils/comments');

module.exports = function (params) {
    params = params || {};
    var regex = commentsUtil.getRegex(params.customTags);
    var commentsRegex = new RegExp('^\\s*#' + regex + '$', 'mig');
    var multiLineRegex = new RegExp('^\\s*"""' + regex + '"""$', 'mig');

    return function parse(contents, file) {
        var comments = [];

        eol.split(contents).forEach(function (line, index) {
            var hashMatch = commentsRegex.exec(line);
            var comment;
            while (hashMatch) {
                comment = commentsUtil.prepareComment(hashMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                hashMatch = commentsRegex.exec(line);
            }

            var multiLineMatch = multiLineRegex.exec(line);
            while (multiLineMatch) {
                comment = commentsUtil.prepareComment(multiLineMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                multiLineMatch = multiLineRegex.exec(line);
            }
        });
        return comments;
    };
};
