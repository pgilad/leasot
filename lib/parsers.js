'use strict';

var parsers = {
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
    '.h': function () {
        return require('./parsers/defaultParser');
    },
    '.c': function () {
        return require('./parsers/defaultParser');
    },
    '.cs': function () {
        return require('./parsers/defaultParser');
    },
    '.go': function () {
        return require('./parsers/defaultParser');
    },
    '.sh': function () {
        return require('./parsers/coffeeParser');
    },
    '.zsh': function () {
        return require('./parsers/coffeeParser');
    },
    '.bash': function () {
        return require('./parsers/coffeeParser');
    },
    '.py': function () {
        return require('./parsers/pythonParser');
    },
    '.pm': function () {
        return require('./parsers/coffeeParser');
    },
    '.pl': function () {
        return require('./parsers/coffeeParser');
    },
    '.erl': function () {
        return require('./parsers/erlangParser');
    },
    '.hs': function () {
        return require('./parsers/haskellParser');
    },
};

function isExtSupported(ext) {
    return Boolean(parsers[ext]);
}

function parse(ext, contents, file, customTags) {
    if (!isExtSupported(ext)) {
        throw new Error('extension ' + ext + ' is not supported.');
    }
    if (customTags && !Array.isArray(customTags)) {
        throw new TypeError('`customTags` must be an array');
    }
    var parseOptions = {
        customTags: customTags
    };
    var parser = parsers[ext]()(parseOptions);
    return parser(contents, file);
}

exports.isExtSupported = isExtSupported;
exports.parse = parse;
