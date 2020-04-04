import commander from 'commander';
import cli from './cli';
import { ExtensionsDb } from '../definitions';

const list = (val: string): string[] => val.split(',');

const parseAssociateParser = (val: string, req: ExtensionsDb): ExtensionsDb => {
    const data = val.split(',');
    if (data.length === 0 || data.length > 2) {
        throw new TypeError('Incorrectly formatted extension / parser registration. (param: ' + val + ')');
    }
    const parser = data[1] || 'defaultParser';
    const ext = data[0];

    req[ext] = { parserName: parser };
    return req;
};

/* eslint-disable no-console */
commander
    .storeOptionsAsProperties(false)
    .description(require('../../package.json').description)
    .version(require('../../package.json').version)
    .usage('[options] <file ...>')
    .option(
        '-A, --associate-parser [ext,parser]',
        'associate unknown extensions with bundled parsers (parser optional / default: defaultParser)',
        parseAssociateParser,
        {}
    )
    .option('-i, --ignore <patterns>', 'add ignore patterns', list, [])
    .option('-I, --inline-files', 'parse possible inline files', false)
    .option('-r, --reporter [reporter]', 'use reporter (table|json|xml|markdown|vscode|raw) (default: table)', 'table')
    .option('-S, --skip-unsupported', 'skip unsupported filetypes', false)
    .option('-t, --filetype [filetype]', 'force the filetype to parse. Useful for streams (default: .js)')
    .option('-T, --tags <tags>', 'add additional comment types to find (alongside todo & fixme)', list, [])
    .option('-x, --exit-nicely', 'exit with exit code 0 even if todos/fixmes are found', false)
    .on('--help', function () {
        console.log('');
        console.log('Examples:');
        console.log('    # Check a specific file');
        console.log('    $ leasot index.js');
        console.log('');
        console.log('    # Check php files with glob');
        console.log(`    $ leasot '**/*.php'`);
        console.log('');
        console.log('    # Check multiple different filetypes');
        console.log(`    $ leasot 'app/**/*.js' test.rb`);
        console.log('');
        console.log('    # Use the json reporter');
        console.log('    $ leasot --reporter json index.js');
        console.log('');
        console.log('    # Search for REVIEW comments as well');
        console.log('    $ leasot --tags review index.js');
        console.log('');
        console.log('    # Add ignore pattern to filter matches');
        console.log(`    $ leasot 'app/**/*.js' --ignore '**/custom.js'`);
        console.log('');
        console.log('    # Search for REVIEW comments as well');
        console.log('    $ leasot --tags review index.js');
        console.log('');
        console.log('    # Check a stream specifying the filetype as coffee');
        console.log('    $ cat index.coffee | leasot --filetype .coffee');
        console.log('');
        console.log('    # Report from leasot parsing and filter todos using `jq`');
        console.log(
            `    $ leasot 'tests/**/*.styl' --reporter json | jq 'map(select(.tag == "TODO"))' | leasot-reporter`
        );
        console.log('');
        console.log('    # Associate a parser for an unknown extension`');
        console.log(`    $ leasot -A '.svelte,twigParser' -A '.svelte,defaultParser' 'frontend/*.svelte'`);
        console.log('');
    })
    .parse(process.argv);

cli(commander);
