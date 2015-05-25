'use strict';

var getParser = {
    '.js': function () {
        return require('./parsers/defaultParser');
    },
    '.php': function () {
        return require('./parsers/defaultParser');
    },
    '.jade': function () {
        return require('./parsers/jadeParser');
    },
    '.styl': function () {
        return require('./parsers/defaultParser');
    },
    '.hbs': function () {
        return require('./parsers/hbsParser');
    },
    '.twig': function () {
        return require('./parsers/twigParser');
    },
    '.sass': function () {
        return require('./parsers/defaultParser');
    },
    '.scss': function () {
        return require('./parsers/defaultParser');
    },
    '.ts': function () {
        return require('./parsers/defaultParser');
    },
    '.coffee': function () {
        return require('./parsers/coffeeParser');
    },
    '.cjsx': function () {
        return require('./parsers/coffeeParser');
    },
    '.less': function () {
        return require('./parsers/defaultParser');
    },
    '.jsx': function () {
        return require('./parsers/defaultParser');
    },
    '.rb': function () {
        return require('./parsers/coffeeParser');
    },
    '.cpp': function () {
        return require('./parsers/defaultParser');
    },
    '.h': function() {
        return require('./parsers/defaultParser');
    },
    '.c': function() {
        return require('./parsers/defaultParser');
    },
    '.go': function() {
        return require('./parsers/defaultParser');
    },
    '.sh': function() {
        return require('./parsers/coffeeParser');
    },
    '.zsh': function() {
        return require('./parsers/coffeeParser');
    },
};

function isExtSupported(ext) {
    return Boolean(getParser[ext]);
}

function getMappedComment(comment, file) {
    return {
        file: file || 'unknown file',
        text: comment.text.trim(),
        kind: comment.kind.toUpperCase(),
        line: comment.line
    };
}

function mapComments(comments, file) {
    return comments.map(function (comment) {
        return getMappedComment(comment, file);
    });
}

function parse(ext, contents, file) {
    if (!isExtSupported(ext)) {
        throw Error('extension ' + ext + ' is not supported.');
    }
    var comments = getParser[ext]()(contents);
    return mapComments(comments, file);
}

exports.isExtSupported = isExtSupported;
exports.parse = parse;
