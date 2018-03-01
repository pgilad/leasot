'use strict';
var eol = require('eol');
var commentsUtil = require('../utils/comments');

var rBlockComment = /\/\*(?:[\s\S]*?)\*\//gmi;

// Bases on get-line-from-pos to support Windows as well
// See https://github.com/pgilad/get-line-from-pos/blob/master/index.js
function getLineFromPos(str, pos) {
    if (pos === 0) {
        return 1;
    }
    //adjust for negative pos
    if (pos < 0) {
        pos = str.length + pos;
    }
    var lines = eol.split(str.substr(0, pos));
    return lines.length;
}

module.exports = function (params) {
    params = params || {};
    var regex = commentsUtil.getRegex(params.customTags);
    var rLineComment = new RegExp('^\\s*\\/\\/' + regex + '$', 'mig');
    var rInnerBlock = new RegExp('^\\s*(?:\\/\\*)?\\**!?' + regex + '(?:\\**\\/)?$', 'mig');

    return function parse(contents, file) {
        var comments = [];

        eol.split(contents).forEach(function (line, index) {
            var match = rLineComment.exec(line);
            while (match) {
                var comment = commentsUtil.prepareComment(match, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                match = rLineComment.exec(line);
            }
        });

        //look for block comments
        var match = rBlockComment.exec(contents);
        while (match) {
            if (!match || !match.length) {
                break;
            }
            //use first match as basis to look into todos/fixmes
            var baseMatch = match[0];
            // jshint loopfunc:true
            eol.split(baseMatch).forEach(function (line, index) {
                var subMatch = rInnerBlock.exec(line);
                while (subMatch) {
                    var adjustedLine = getLineFromPos(contents, match.index) + index;
                    var comment = commentsUtil.prepareComment(subMatch, adjustedLine, file);
                    if (!comment) {
                        break;
                    }
                    comments.push(comment);
                    subMatch = rInnerBlock.exec(line);
                }
            });
            match = rBlockComment.exec(contents);
        }

        return comments;
    };
};
