#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var glob = require('glob');
var logSymbols = require('log-symbols');
var mapAsync = require('map-async');
var program = require('commander');
var stdin = require('get-stdin');

var leasot = require('../index');
var DEFAULT_EXTENSION = '.js';
var pkg = require(path.join(__dirname, '../package.json'));

process.title = pkg.name;

program
    .description(pkg.description)
    .version(pkg.version)
    .usage('[options] <file ...>')
    .option('-t, --filetype [filetype]', 'Force the filetype to parse. Useful for streams (Default: .js)')
    .option('-r, --reporter [reporter]', 'Use reporter (table|json|xml|markdown|raw) (Default: table)', 'table')
    .on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ leasot index.js');
        console.log('    $ leasot **/*.js');
        console.log('    $ leasot index.js lib/*.js');
        console.log('    $ leasot --reporter json index.js');
        console.log('    $ cat index.js | leasot');
        console.log('    $ cat index.cjsx | leasot --filetype .coffee');
        console.log('');
    })
    .parse(process.argv);

function outputReport(reporter, todos) {
    try {
        var output = leasot.reporter(todos, {
            reporter: reporter
        });
        console.log(output);
    } catch (e) {
        console.log(logSymbols.error, e.toString());
    }
}

function parseContents(filetype, contents, file) {
    if (!leasot.isExtSupported(filetype)) {
        console.log(logSymbols.error, 'Filetype ' + filetype + ' is unsupported.');
        process.exit(1);
    }
    var todos = leasot.parse(filetype, contents, file);
    return todos;
}

function run(contents, params) {
    params = params || {};
    var file = params.file;
    var filetype = program.filetype || path.extname(file) || DEFAULT_EXTENSION;
    return parseContents(filetype, contents, file);
}

function outputTodos(todos) {
    outputReport(program.reporter, todos);
    if (!todos.length) {
        process.exit(0);
    }
    process.exit(1);
}

function readFiles(files) {
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

    // Async read all of the given files
    mapAsync(files, function (file, cb) {
        fs.readFile(path.resolve(process.cwd(), file), 'utf8', cb);
    }, function (err, results) {
        if (err) {
            console.log(err);
            return process.exit(1);
        }
        var todos = results.map(function (contents, i) {
            return run(contents, {
                file: files[i]
            });
        }).filter(function (item) {
            return item && item.length;
        }).reduce(function (items, item) {
            return items.concat(item);
        }, []);

        outputTodos(todos);
    });
}

if (!process.stdin.isTTY) {
    return stdin(function (contents) {
        outputTodos(run(contents));
    });
}
if (!program.args.length) {
    program.help();
    return;
}
readFiles(program.args);
