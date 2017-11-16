var fs = require('fs');
var getStdin = require('get-stdin');
var globby = require('globby');
var logSymbols = require('log-symbols');
var mapLimit = require('async/mapLimit');
var path = require('path');

var leasot = require('../index');

var DEFAULT_EXTENSION = '.js';
var CONCURRENCY_LIMIT = 50;

function getFiletype(specified, file) {
    if (specified) {
        return specified;
    }
    if (file && path.extname(file)) {
        return path.extname(file);
    }
    return DEFAULT_EXTENSION;
}

function parseContentSync(content, params) {
    params = params || {};
    var file = params.file;
    var ext = getFiletype(params.filetype, file);
    var associateParser = params.associateParser;

    leasot.associateExtWithParser(associateParser);

    if (!leasot.isExtSupported(ext)) {
        if (params.skipUnsupported) {
            return [];
        }
        console.log(logSymbols.error, 'Filetype ' + ext + ' is unsupported.');
        process.exit(1);
    }
    return leasot.parse({
        content: content,
        customTags: params.tags,
        ext: ext,
        fileName: file,
        withInlineFiles: params.inlineFiles,
    });
}

function outputTodos(todos, params) {
    try {
        var output = leasot.reporter(todos, {
            reporter: params.reporter
        });
        console.log(output);
    } catch (e) {
        console.error(e);
    }
    if (params.exitNicely) process.exit(0);
    process.exit(todos.length ? 1 : 0);

}

function parseAndReportFiles(fileGlobs, program) {
    var cwd = process.cwd();
    var ignore = program.ignore || [];

    // Get all files and their resolved globs
    var files = globby.sync(fileGlobs, {
        cwd: cwd,
        ignore: ignore,
        nodir: true,
    });

    if (!files || !files.length) {
        console.log(logSymbols.warning, 'No files found for parsing');
        return process.exit(1);
    }

    // Parallel read all of the given files
    mapLimit(files, CONCURRENCY_LIMIT, function (file, cb) {
        fs.readFile(path.resolve(cwd, file), 'utf8', cb);
    }, function (err, results) {
        if (err) {
            console.log(err);
            return process.exit(1);
        }
        var todos = results.map(function (content, i) {
            var parseParams = Object.assign({ file: files[i] }, program);
            return parseContentSync(content, parseParams);
        }).filter(function (item) {
            // filter files without any parsed content
            return item && item.length > 0;
        }).reduce(function (items, item) {
            // flatten list
            return items.concat(item);
        }, []);

        outputTodos(todos, program);
    });
}

module.exports = function (program) {
    var files = program.args;
    if (files && files.length > 0) {
        return parseAndReportFiles(files, program);
    }
    if (!process.stdin.isTTY) {
        // data is coming from a pipe
        return getStdin()
            .then(function (content) {
                var todos = parseContentSync(content, program);
                outputTodos(todos, program);
            })
            .catch(function (e) {
                console.error(e);
                process.exit(1);
            });
    }
    program.help();
};

module.exports.getFiletype = getFiletype;
