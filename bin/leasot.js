#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var program = require('commander');
var leasot = require('../index');
var logSymbols = require('log-symbols');
var stdin = require('get-stdin');
var async = require('async');
var glob = require('glob');
process.title = 'leasot';

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
        console.log(logSymbols.error, 'Filetype ' + filetype + ' is not supported.');
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
        return newFiles.concat(glob.sync(file, {cwd: process.cwd()}));
    }, []);
    // Async read all of the given files
    async.map(files, function (file, cb) {
        fs.readFile(path.resolve(process.cwd(), file), 'utf8', cb);
    }, function (err, result) {
        if (err) {
          console.log(err);
          return process.exit(1);
        }
        // This will be an array of trues (successes) and falses (failures)
        var successes = result.map(function (contents, i) {
            return run(contents, {file: files[i]});
        });
        // If all files returned with success, log success
        if (successes.indexOf(false) === -1) {
          console.log(logSymbols.success, 'No todos/fixmes found');
          return process.exit(0);
        }
        // otherwise, quit with exit code 1
        process.exit(1);
    });
}

if (!process.stdin.isTTY) {
    var success = stdin(run);
    if (success) {
      console.log(logSymbols.success, 'No todos/fixmes found');
      return process.exit(0);
    }
    return process.exit(1);
}
if (!program.args.length) {
    program.help();
    return;
}
readFiles(program.args);
