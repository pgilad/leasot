#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var program = require('commander');
var leasot = require('../index');
var logSymbols = require('log-symbols');
process.title = 'leasot';

program
    .description('Parse and output TODOs and FIXMEs from comments in your files')
    .version(require(path.join(__dirname, '../package.json')).version)
    .usage('[options] [file]')
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
    process.exit(1);
}

function parseContents(filetype, contents, file) {
    var todos;
    try {
        todos = leasot.parse(filetype, contents, file);
    } catch (e) {
        console.log(logSymbols.error, e.toString());
        process.exit(1);
    }
    if (!todos.length) {
        console.log(logSymbols.success, 'No todos/fixmes found');
        process.exit(0);
    }
    return todos;
}

function run(contents, params) {
    params = params || {};
    var file = params.file;
    var reporter = program.reporter;
    var filetype = program.filetype || path.extname(file) || '.js';
    var todos = parseContents(filetype, contents, file);
    useReporter(reporter, todos);
}

//assume any unconsumed option is a file path
var filePath = program.args;
if (filePath && filePath.length) {
    //currently only handle 1 file
    //TODO: handle multiple incoming files in args
    var _file = filePath[0];
    var _contents = fs.readFileSync(path.resolve(process.cwd(), _file), 'utf8');
    run(_contents, {
        file: _file
    });
    return;
}

//get data from stream
process.stdin.setEncoding('utf8');
if (process.stdin.isTTY) {
    program.help();
    return;
}
var data = [];
process.stdin.on('data', function (chunk) {
    data.push(chunk);
}).on('end', function () {
    data = data.join();
    run(data);
});
