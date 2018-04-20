const uniq = require('lodash/uniq');
const uniqWith = require('lodash/uniqWith');

const parsersDb = {
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
    '.ts': { parserName: 'defaultParser' },
    '.tsx': { parserName: 'defaultParser' },
    '.twig': { parserName: 'twigParser' },
    '.vue': { parserName: 'twigParser', includedFiles: ['.html', '.js', '.css'] },
    '.yaml': { parserName: 'coffeeParser', includedFiles: ['.yml'] },
    '.zsh': { parserName: 'coffeeParser' },
};

// Support for associating an extension with a parser
function associateExtWithParser(parsers) {
    const keys = Object.keys(parsers);
    if (keys.length === 0) {
        return;
    }
    keys.forEach(function(ext) {
        if (ext.length <= 1 || ext[0] !== '.') {
            throw new TypeError('Cannot register extension: invalid extension ' + ext);
        }
        const parser = parsers[ext];
        if (!parser || !parser.parserName) {
            throw new TypeError('Cannot register extension: parser name missing.');
        }
    });

    // Add any additional parsers.
    Object.assign(parsersDb, parsers);
}

function isExtSupported(ext) {
    return Boolean(parsersDb[ext]);
}

function parse({ ext, content, fileName, customTags, withInlineFiles = false, associateParser = {} }) {
    // Associate extensions with bundled parsers
    associateExtWithParser(associateParser);

    if (!isExtSupported(ext)) {
        throw new Error(`extension ${ext} is not supported.`);
    }
    if (customTags && !Array.isArray(customTags)) {
        throw new TypeError('`customTags` must be an array');
    }
    const parseOptions = {
        customTags: customTags,
    };
    const originalParser = parsersDb[ext];
    let parsers = [].concat(originalParser.parserName);

    const includedFiles = originalParser.includedFiles || [];
    if (withInlineFiles) {
        includedFiles.forEach(ext => {
            parsers.push(parsersDb[ext].parserName);
        });
        parsers = uniq(parsers);
    }

    const parsed = parsers
        .map(function(parser) {
            const parserFactory = require('./parsers/' + parser);
            return parserFactory(parseOptions)(content, fileName);
        })
        .reduce((items, item) => items.concat(item), [])
        .sort((item1, item2) => item1.line - item2.line);

    return uniqWith(parsed, function(a, b) {
        return a.line === b.line && a.kind === b.kind && a.text === b.text;
    });
}

exports.associateExtWithParser = associateExtWithParser;
exports.isExtSupported = isExtSupported;
exports.parse = parse;
