#!/usr/bin/env node

var program = require('commander');
var cli = require('../lib/cli');
var pkg = require('../package.json');

function list(val) {
    return val.split(',');
}

function parseAssociateParser(val, req) {
    var data = val.split(',');
    if (data.length === 0 || data.length > 2) {
        throw new Error('Incorrectly formatted extension / parser registration. (param: ' + val + ')');
    }
    var parser = data[1] || 'defaultParser';
    var ext = data[0];

    req[ext] = { parserName: parser };
    return req;
}

program
    .description(pkg.description)
    .version(pkg.version)
    .usage('[options] <file ...>')
    .option('-r, --reporter [reporter]', 'use reporter (table|json|xml|markdown|raw) (default: table)', 'table')
    .option('-t, --filetype [filetype]', 'force the filetype to parse. Useful for streams (default: .js)')
    .option('-T, --tags <tags>', 'add additional comment types to find (alongside todo & fixme)', list, [])
    .option('-S, --skip-unsupported', 'skip unsupported filetypes', false)
    .option('-I, --inline-files', 'parse possible inline files', false)
    .option('-A, --associate-parser [ext,parser]',
            'associate unknown extensions with bundled parsers (parser optional / default: defaultParser)',
            parseAssociateParser, {})
    .on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    # Check a specific file');
        console.log('    $ leasot index.js');
        console.log('');
        console.log('    # Check php files with glob');
        console.log('    $ leasot **/*.php');
        console.log('');
        console.log('    # Check multiple different filetypes');
        console.log('    $ leasot app/**/*.js test.rb');
        console.log('');
        console.log('    # Use the json reporter');
        console.log('    $ leasot --reporter json index.js');
        console.log('');
        console.log('    # Search for REVIEW comments as well');
        console.log('    $ leasot --tags review index.js');
        console.log('');
        console.log('    # Export TODOS as markdown to a TODO.md file');
        console.log('    $ leasot --reporter markdown app/**/*.py > TODO.md');
        console.log('');
        console.log('    # Check a stream specifying the filetype as coffee');
        console.log('    $ cat index.coffee | leasot --filetype .coffee');
        console.log('');
    })
    .parse(process.argv);

cli(program);
