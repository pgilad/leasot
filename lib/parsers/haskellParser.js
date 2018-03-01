'use strict';
var eol = require('eol');
var commentsUtil = require('../utils/comments');

module.exports = function (params) {
    params = params || {};
    var regex = commentsUtil.getRegex(params.customTags);
    var commentsRegex = new RegExp('^\\s*--' + regex + '$', 'mig');

    return function parse(contents, file) {
        var comments = [];

        eol.split(contents).forEach(function (line, index) {
            var match = commentsRegex.exec(line);
            var comment = commentsUtil.prepareComment(match, index + 1, file);
            if (!comment) {
                return;
            }
            comments.push(comment);
        });
        return comments;
    };
};
