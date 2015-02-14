#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var glob = require('glob');
var logSymbols = require('log-symbols');
var mapAsync = require('map-async');
var program = require('commander');
var stdin = require('get-stdin');

var leasot = require('../index');

process.title = 'leasot';

var messages = {
    ok: 'No todos/fixmes found.',
    noFiles: 'No files passed for checking. See --help for examples.'
};

program
    .description('Parse and output TODOs and FIXMEs from comments in your files')
    .version(require(path.join(__dirname, '../package.json')).version)
    .usage('[options] <file ...>')
    .option('-t, --filetype [filetype]', 'Force filetype to parse. Useful for handling files in streams [.js]')
    .option('-r, --reporter [reporter]', 'Which reporter to use (table|json|xml|markdown|raw) [table]', 'table')
    .on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ leasot index.js');
        console.log('    $ leasot **/*.js');
        console.log('    $ leasot index.js lib/*.js');
        console.log('    $ leasot --reporter json index.js');
        console.log('    $ cat index.js | leasot');
        console.log('    $ cat index.coffee | leasot --filetype .coffee');
        console.log('');
    })
    .parse(process.argv);

function useReporter(reporter, todos) {
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
    var reporter = program.reporter;
    var filetype = program.filetype || path.extname(file) || '.js';
    var todos = parseContents(filetype, contents, file);
    if (!todos.length) {
        return true;
    }
    useReporter(reporter, todos);
    return false;
}

function readFiles(files) {

    // Get all of the files, and globs of files
    files = files.reduce(function (newFiles, file) {
        return newFiles.concat(glob(file, {
            sync: true,
            nodir: true,
            cwd: process.cwd()
        }));
    }, []);

    if (!files || !files.length) {
        console.log(logSymbols.warning, messages.noFiles);
        return process.exit(0);
    }

    // Async read all of the given files
    mapAsync(files, function (file, cb) {
        fs.readFile(path.resolve(process.cwd(), file), 'utf8', cb);
    }, function (err, results) {
        if (err) {
            console.log(err);
            return process.exit(1);
        }
        var errors = results.map(function (contents, i) {
            return run(contents, {
                file: files[i]
            });
        }).filter(function (item) {
            return !item;
        });

        var filesScannedMsg;
        var msg;

        if (files.length > 1) {
            filesScannedMsg = 'Scanned a total of ' + files.length + ' files.';
        } else {
            filesScannedMsg = 'Scanned 1 file.';
        }

        if (!errors.length) {
            msg = filesScannedMsg + ' ' + messages.ok;
            console.log('\n' + logSymbols.success, msg);
            return process.exit(0);
        }
        msg = filesScannedMsg + ' ' + errors.length + ' contained todos/fixmes.';
        console.log('\n' + logSymbols.warning, msg);
        process.exit(1);
    });
}

if (!process.stdin.isTTY) {
    return stdin(function (contents) {
        if (run(contents)) {
            console.log(logSymbols.success, messages.ok);
            return process.exit(0);
        }
        process.exit(1);
    });
}
if (!program.args.length) {
    program.help();
    return;
}
readFiles(program.args);
