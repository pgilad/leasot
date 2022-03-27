import { program } from 'commander';
import fs from 'fs';

import cli from './cli-reporter.js';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8'));

const list = (val: string): string[] => val.split(',');

/* eslint-disable no-console */
program
    .description('Report todos and fixmes from json files or stream')
    .version(pkg.version)
    .usage('[options] <file ...>')
    .option('-i, --ignore <patterns>', 'add ignore patterns', list, [])
    .option('-r, --reporter [reporter]', 'use reporter (table|json|xml|markdown|vscode|raw) (default: table)', 'table')
    .option('-x, --exit-nicely', 'exit with exit code 0 even if todos/fixmes are found', false)
    .on('--help', function () {
        console.log('');
        console.log('Examples:');
        console.log('    # Report todos from a specific file');
        console.log('    $ leasot-reporter index.json');
        console.log('');
        console.log('    # Report todos from a glob pattern');
        console.log(`    $ leasot-reporter '**/*.json'`);
        console.log('');
        console.log('    # Use the json reporter');
        console.log('    $ leasot-reporter --reporter json index.json');
        console.log('');
        console.log('    # Report from a json stream');
        console.log('    $ cat index.json | leasot-reporter --reporter xml');
        console.log('');
        console.log('    # Report from leasot parsing and filter todos using `jq`');
        console.log(
            `    $ leasot 'tests/**/*.styl' --reporter json | jq 'map(select(.tag == "TODO"))' | leasot-reporter`
        );
        console.log('');
        console.log(`App version: ${pkg.version}`);
        console.log('');
    })
    .parse(process.argv);

cli(program);
