#!/usr/bin/env node

var program = require('commander');
var cli = require('../lib/cli');
var pkg = require('../package.json');

program
    .description(pkg.description)
    .version(pkg.version)
    .usage('[options] <file ...>')
    .option('-r, --reporter [reporter]', 'Use reporter (table|json|xml|markdown|raw) (Default: table)', 'table')
    .option('-t, --filetype [filetype]', 'Force the filetype to parse. Useful for streams (Default: .js)')
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

cli(program);
