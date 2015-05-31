var fs = require('fs');
var glob = require('glob');
var logSymbols = require('log-symbols');
var mapAsync = require('map-async');
var stdin = require('get-stdin');
var path = require('path');

var leasot = require('../index');
var DEFAULT_EXTENSION = '.js';

function getFiletype(specified, file) {
    return specified || path.extname(file) || DEFAULT_EXTENSION;
}

function run(contents, params) {
    params = params || {};
    var file = params.file;
    var filetype = getFiletype(params.filetype, file);
    var tags = params.tags;

    if (!leasot.isExtSupported(filetype)) {
        console.log(logSymbols.error, 'Filetype ' + filetype + ' is unsupported.');
        process.exit(1);
    }
    return leasot.parse(filetype, contents, file, tags);
}

function outputTodos(todos, reporter) {
    try {
        var output = leasot.reporter(todos, {
            reporter: reporter
        });
        console.log(output);
    } catch (e) {
        console.log(logSymbols.error, e.toString());
    }
    process.exit(todos.length ? 1 : 0);
}

function readFiles(program) {
    var files = program.args;
    var tags = program.tags;
    var filetype = program.filetype;
    // Get all files and their resolved globs
    files = files.reduce(function (newFiles, file) {
        return newFiles.concat(glob(file, {
            sync: true,
            nodir: true,
            cwd: process.cwd()
        }));
    }, []);

    if (!files || !files.length) {
        console.log(logSymbols.warning, 'No files found for parsing');
        return process.exit(1);
    }

    var cwd = process.cwd();

    // Async read all of the given files
    mapAsync(files, function (file, cb) {
        fs.readFile(path.resolve(cwd, file), 'utf8', cb);
    }, function (err, results) {
        if (err) {
            console.log(err);
            return process.exit(1);
        }
        var todos = results.map(function (contents, i) {
            return run(contents, {
                file: files[i],
                filetype: filetype,
                tags: tags
            });
        }).filter(function (item) {
            return item && item.length;
        }).reduce(function (items, item) {
            return items.concat(item);
        }, []);

        outputTodos(todos, program.reporter);
    });
}

module.exports = function (program) {
    if (!process.stdin.isTTY) {
        return stdin(function (contents) {
            var todos = run(contents, {
                filetype: program.filetype,
                tags: program.tags
            });
            outputTodos(todos, program.reporter);
        });
    }
    if (!program.args.length) {
        return program.help();
    }
    readFiles(program);
};
