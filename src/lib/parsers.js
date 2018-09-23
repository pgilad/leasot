'use strict';
exports.__esModule = true;
var lodash_1 = require('lodash');
var parsersDb = {
    '.bash': { parserName: 'coffeeParser' },
    '.c': { parserName: 'defaultParser' },
    '.cjsx': { parserName: 'coffeeParser' },
    '.coffee': { parserName: 'coffeeParser' },
    '.cpp': { parserName: 'defaultParser' },
    '.cr': { parserName: 'coffeeParser' },
    '.cs': { parserName: 'defaultParser' },
    '.cson': { parserName: 'coffeeParser' },
    '.css': { parserName: 'defaultParser' },
    '.ejs': { parserName: 'ejsParser' },
    '.erb': { parserName: 'ejsParser' },
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
    '.hrl': { parserName: 'erlangParser' },
    '.hs': { parserName: 'haskellParser' },
    '.htm': { parserName: 'twigParser' },
    '.html': { parserName: 'twigParser' },
    '.jade': { parserName: 'jadeParser' },
    '.java': { parserName: 'defaultParser' },
    '.js': { parserName: 'defaultParser' },
    '.jsx': { parserName: 'defaultParser' },
    '.kt': { parserName: 'defaultParser' },
    '.less': { parserName: 'defaultParser' },
    '.m': { parserName: 'defaultParser' },
    '.mm': { parserName: 'defaultParser' },
    '.mustache': { parserName: 'hbsParser' },
    '.njk': { parserName: 'twigParser' },
    '.pas': { parserName: 'pascalParser' },
    '.php': { parserName: 'defaultParser', includedFiles: ['.html', '.js', '.css'] },
    '.pl': { parserName: 'coffeeParser' },
    '.pm': { parserName: 'coffeeParser' },
    '.pug': { parserName: 'jadeParser' },
    '.py': { parserName: 'pythonParser' },
    '.rb': { parserName: 'coffeeParser' },
    '.sass': { parserName: 'defaultParser' },
    '.scala': { parserName: 'defaultParser' },
    '.scss': { parserName: 'defaultParser' },
    '.sh': { parserName: 'coffeeParser' },
    '.sql': { parserName: ['defaultParser', 'haskellParser'] },
    '.ss': { parserName: 'ssParser' },
    '.styl': { parserName: 'defaultParser' },
    '.swift': { parserName: 'defaultParser' },
    '.tex': { parserName: 'latexParser' },
    '.ts': { parserName: 'defaultParser' },
    '.tsx': { parserName: 'defaultParser' },
    '.twig': { parserName: 'twigParser' },
    '.vue': { parserName: 'twigParser', includedFiles: ['.html', '.js', '.css'] },
    '.yaml': { parserName: 'coffeeParser', includedFiles: ['.yml'] },
    '.zsh': { parserName: 'coffeeParser' },
};
/**
 * Extend the extensions database at runtime, by either adding support for new extensions or overriding existing ones
 * @param extendedDb The extension database to extend with
 */
exports.associateExtWithParser = function(extendedDb) {
    var keys = Object.keys(extendedDb);
    if (keys.length === 0) {
        return;
    }
    keys.forEach(function(extension) {
        if (extension.length <= 1 || extension[0] !== '.') {
            throw new TypeError('Cannot register extension: invalid extension ' + extension);
        }
        var parser = extendedDb[extension];
        if (!parser || !parser.parserName) {
            throw new TypeError('Cannot register extension: `parserName` is missing');
        }
    });
    // Add any additional parsers.
    Object.assign(parsersDb, extendedDb);
};
/**
 * Check whether the provided extension is currently supported
 * @param extension the extension to check
 */
exports.isExtensionSupported = function(extension) {
    return parsersDb.hasOwnProperty(extension);
};
/**
 * Get the effective active parser names from an extension
 */
var getActiveParserNames = function(extension, withInlineFiles) {
    var originalParser = parsersDb[extension];
    var parserNames = [].concat(originalParser.parserName);
    var includedFiles = originalParser.includedFiles || [];
    if (withInlineFiles) {
        includedFiles.forEach(function(includedExtension) {
            // parserName could be an array
            parserNames = parserNames.concat(parsersDb[includedExtension].parserName);
        });
        parserNames = lodash_1.uniq(parserNames);
    }
    return parserNames;
};
/**
 * Parse the provided content and return an array of parsed items
 * @param content The contents to parse
 * @param config The parse configuration
 */
exports.parse = function(content, config) {
    var _a = config.associateParser, associateParser = _a === void 0 ? {} : _a, _b = config.customParsers,
        customParsers = _b === void 0 ? {} : _b, _c = config.customTags, customTags = _c === void 0 ? [] : _c,
        extension = config.extension, filename = config.filename, _d = config.withInlineFiles,
        withInlineFiles = _d === void 0 ? false : _d;
    // Associate extensions with bundled parsers
    exports.associateExtWithParser(associateParser);
    if (!exports.isExtensionSupported(extension)) {
        throw new Error('extension ' + extension + ' is not supported.');
    }
    if (customTags && !Array.isArray(customTags)) {
        throw new TypeError('`customTags` must be an array');
    }
    var parseOptions = { customTags: customTags };
    var parserNames = getActiveParserNames(extension, withInlineFiles);
    var parsed = parserNames
        .map(function(parserName) {
            var parserFactory = customParsers[parserName] || require('./parsers/' + parserName)['default'];
            var parser = parserFactory(parseOptions);
            return parser(content, filename);
        })
        .reduce(function(items, item) {
            return items.concat(item);
        }, [])
        .sort(function(item1, item2) {
            return item1.line - item2.line;
        });
    return lodash_1.uniqWith(parsed, function(a, b) {
        return a.line === b.line && a.tag === b.tag && a.text === b.text;
    });
};
