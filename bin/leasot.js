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
        console.log(logSymbols.success, 'No todos/fixmes found');
        process.exit(0);
    }
    useReporter(reporter, todos);
    process.exit(1);
}

function readFiles(files) {
    //TOOD: handle multiple files
    var file = files[0];
    var _contents = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
    run(_contents, {
        file: file
    });
}

if (!process.stdin.isTTY) {
    stdin(run);
    return;
}
if (!program.args.length) {
    program.help();
    return;
}
readFiles(program.args);
