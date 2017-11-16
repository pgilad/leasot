var fs = require('fs');
var getStdin = require('get-stdin');
var globby = require('globby');
var logSymbols = require('log-symbols');
var mapLimit = require('async/mapLimit');
var path = require('path');

var leasot = require('../index');
var concurrencyLimit = 50;

function outputTodos(todos, params) {
    try {
        var output = leasot.reporter(todos, {
            reporter: params.reporter
        });
        console.log(output);
    } catch (e) {
        console.error(e);
    }
    if (params.exitNicely) process.exit(0)
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
        console.log(logSymbols.warning, 'No files found for reporting');
        return process.exit(1);
    }

    // Parallel read all of the given files
    mapLimit(files, concurrencyLimit, function (file, cb) {
        fs.readFile(path.resolve(cwd, file), 'utf8', cb);
    }, function (err, results) {
        if (err) {
            console.log(err);
            return process.exit(1);
        }
        var todos = results.map(function (content) {
            return JSON.parse(content);
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
    if (!process.stdin.isTTY) {
        return getStdin().then(function (content) {
            var todos = JSON.parse(content);
            outputTodos(todos, program);
        }).catch(function (e) {
            console.error(e);
            process.exit(1);
        });
    }
    var files = program.args;
    if (files.length === 0) {
        return program.help();
    }
    parseAndReportFiles(files, program);
};
