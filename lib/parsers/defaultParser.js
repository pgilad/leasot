'use strict';
var getLineFromPos = require('get-line-from-pos');
//test for comments that have todo/fixme + text
var rLineComment = /^\s*\/\/\s*@?(todo|fixme)[\s:]+(.+)/mig;
var rBlockComment = /\/\*(?:[\s\S]*?)\*\//gmi;
var rInnerBlock = /^\s*(?:\/\*)?\**!?\s@?(todo|fixme)[\s:]+(.+?)\s*(?:\**\/)?$/gi;

module.exports = function (contents) {
    var comments = [];

    contents.split('\n').forEach(function (line, index) {
        var match = rLineComment.exec(line);
        while (match) {
            if (!match || !match.length) {
                break;
            }
            //verify kind and text exists
            if (!match[1] || !match[2]) {
                break;
            }
            comments.push({
                kind: match[1],
                text: match[2].trim(),
                line: index + 1
            });
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
        baseMatch.split('\n').forEach(function (line, index) {
            var subMatch = rInnerBlock.exec(line);
            while (subMatch) {
                if (!subMatch || !subMatch.length) {
                    break;
                }
                //verify kind and text exists
                if (!subMatch[1] || !subMatch[2]) {
                    break;
                }
                comments.push({
                    kind: subMatch[1],
                    text: subMatch[2].trim(),
                    line: getLineFromPos(contents, match.index) + index
                });
                subMatch = rInnerBlock.exec(line);
            }
        });
        match = rBlockComment.exec(contents);
    }
    // sort by line number
    comments = comments.sort(function (a, b) {
        return a.line - b.line;
    });

    return comments;
};
