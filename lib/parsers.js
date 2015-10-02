'use strict';

var uniq = require('lodash.uniq');

var parsersDb = {
    '.js': {
        parserName: 'defaultParser'
    },
    '.php': {
        includedFiles: ['.html', '.js', '.css'],
        parserName: 'defaultParser'
    },
    '.jade': {
        parserName: 'jadeParser'
    },
    '.styl': {
        parserName: 'defaultParser'
    },
    '.hbs': {
        parserName: 'hbsParser'
    },
    '.handlebars': {
        parserName: 'hbsParser'
    },
    '.hgn': {
        parserName: 'hbsParser'
    },
    '.hogan': {
        parserName: 'hbsParser'
    },
    '.mustache': {
        parserName: 'hbsParser'
    },
    '.twig': {
        parserName: 'twigParser'
    },
    '.sass': {
        parserName: 'defaultParser'
    },
    '.scss': {
        parserName: 'defaultParser'
    },
    '.css': {
        parserName: 'defaultParser'
    },
    '.ts': {
        parserName: 'defaultParser'
    },
    '.coffee': {
        parserName: 'coffeeParser'
    },
    '.cjsx': {
        parserName: 'coffeeParser'
    },
    '.less': {
        parserName: 'defaultParser'
    },
    '.jsx': {
        parserName: 'defaultParser'
    },
    '.rb': {
        parserName: 'coffeeParser'
    },
    '.cpp': {
        parserName: 'defaultParser'
    },
    '.h': {
        parserName: 'defaultParser'
    },
    '.c': {
        parserName: 'defaultParser'
    },
    '.cs': {
        parserName: 'defaultParser'
    },
    '.go': {
        parserName: 'defaultParser'
    },
    '.sh': {
        parserName: 'coffeeParser'
    },
    '.zsh': {
        parserName: 'coffeeParser'
    },
    '.bash': {
        parserName: 'coffeeParser'
    },
    '.py': {
        parserName: 'pythonParser'
    },
    '.pm': {
        parserName: 'coffeeParser'
    },
    '.pl': {
        parserName: 'coffeeParser'
    },
    '.erl': {
        parserName: 'erlangParser'
    },
    '.hs': {
        parserName: 'haskellParser'
    },
    '.html': {
        parserName: 'twigParser'
    },
    '.htm': {
        parserName: 'twigParser'
    },
    '.ejs': {
        parserName: 'ejsParser'
    }
};

function isExtSupported(ext) {
    return Boolean(parsersDb[ext]);
}

function parse(options) {
    var ext = options.ext;
    var content = options.content;
    var fileName = options.fileName;
    var customTags = options.customTags;
    var withInlineFiles = options.withInlineFiles || false;

    if (!isExtSupported(ext)) {
        throw new Error('extension ' + ext + ' is not supported.');
    }
    if (customTags && !Array.isArray(customTags)) {
        throw new TypeError('`customTags` must be an array');
    }
    var parseOptions = {
        customTags: customTags
    };
    var originalParser = parsersDb[ext];
    var parsers = [originalParser.parserName];

    var includedFiles = originalParser.includedFiles || [];
    if (withInlineFiles) {
        includedFiles.forEach(function (ext) {
            parsers.push(parsersDb[ext].parserName);
        });
        parsers = uniq(parsers);
    }

    var parsed = parsers
        .map(function (parser) {
            var parserFactory = require('./parsers/' + parser);
            return parserFactory(parseOptions)(content, fileName);
        })
        .reduce(function (items, item) {
            // flatten
            return items.concat(item);
        }, [])
        .sort(function (item1, item2) {
            return item1.line - item2.line;
        });

    return uniq(parsed, true, function (item) {
        return {
            line: item.line,
            kind: item.kind,
            text: item.text
        };
    });
}

/* legacy parse method, kept for backwards compatibility */
function parseLegacy(ext, content, fileName, customTags, withInlineFiles) {
    return parse({
        ext: ext,
        content: content,
        fileName: fileName,
        customTags: customTags,
        withInlineFiles: withInlineFiles
    });
}

exports.isExtSupported = isExtSupported;
exports.parse = parse;
exports.parseLegacy = parseLegacy;
