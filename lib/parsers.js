'use strict';

var uniq = require('lodash.uniq');

var parsersDb = {
    '.bash': { parserName: 'coffeeParser' },
    '.c': { parserName: 'defaultParser' },
    '.cjsx': { parserName: 'coffeeParser' },
    '.coffee': { parserName: 'coffeeParser' },
    '.cpp': { parserName: 'defaultParser' },
    '.cs': { parserName: 'defaultParser' },
    '.css': { parserName: 'defaultParser' },
    '.ejs': { parserName: 'ejsParser' },
    '.erb': { parserName: 'twigParser' },
    '.erl': { parserName: 'erlangParser' },
    '.es': { parserName: 'defaultParser' },
    '.es6': { parserName: 'defaultParser' },
    '.go': { parserName: 'defaultParser' },
    '.h': { parserName: 'defaultParser' },
    '.haml': { parserName: 'hamlParser' },
    '.handlebars': { parserName: 'hbsParser' },
    '.hbs': { parserName: 'hbsParser' },
    '.hgn': { parserName: 'hbsParser' },
    '.hogan': { parserName: 'hbsParser' },
    '.hs': { parserName: 'haskellParser' },
    '.htm': { parserName: 'twigParser' },
    '.html': { parserName: 'twigParser' },
    '.jade': { parserName: 'jadeParser' },
    '.js': { parserName: 'defaultParser' },
    '.jsx': { parserName: 'defaultParser' },
    '.less': { parserName: 'defaultParser' },
    '.mustache': { parserName: 'hbsParser' },
    '.pas': { parserName: 'pascalParser' },
    '.php': { parserName: 'defaultParser', includedFiles: ['.html', '.js', '.css'] },
    '.pl': { parserName: 'coffeeParser' },
    '.pm': { parserName: 'coffeeParser' },
    '.py': { parserName: 'pythonParser' },
    '.rb': { parserName: 'coffeeParser' },
    '.sass': { parserName: 'defaultParser' },
    '.scss': { parserName: 'defaultParser' },
    '.sh': { parserName: 'coffeeParser' },
    '.styl': { parserName: 'defaultParser' },
    '.ts': { parserName: 'defaultParser' },
    '.twig': { parserName: 'twigParser' },
    '.zsh': { parserName: 'coffeeParser' },
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
