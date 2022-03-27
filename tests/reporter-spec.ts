import fs from 'fs';
import * as leasot from '../src/index.js';
import path from 'path';
import should from 'should';
import { BuiltinReporters, ParseConfig, ReporterName } from '../src/definitions.js';
import eol from 'eol';

function getFixturePath(file: string): string {
    return path.join('./tests/fixtures/', file);
}

async function getReport(filename: string, reporter: ReporterName, parseOptions: ParseConfig) {
    parseOptions.filename = filename;

    const content = fs.readFileSync(filename, 'utf8');
    const comments = await leasot.parse(content, parseOptions);
    const report = await leasot.report(comments, reporter);
    return eol.split(report);
}

describe('reporting', function () {
    describe('vscode', function () {
        it('typescript', async function () {
            const file = getFixturePath('typescript.ts');
            const report = await getReport(file, BuiltinReporters.vscode, { extension: '.ts' });
            should.exist(report);
            report.should.eql([
                '### TODOs',
                '| Filename | line # | TODO',
                '|:------|:------:|:------',
                '| [' + file + '](' + file + '#L1) | 1 | change to public',
                '',
                '### FIXMEs',
                '| Filename | line # | FIXME',
                '|:------|:------:|:------',
                '| [' + file + '](' + file + '#L11) | 11 | use jquery',
            ]);
        });

        it('reference-leading', async function () {
            const file = getFixturePath('reference-leading.js');
            const report = await getReport(file, BuiltinReporters.vscode, { extension: '.js' });
            should.exist(report);
            report.should.eql([
                '### TODOs',
                '| Filename | line # | TODO',
                '|:------|:------:|:------',
                '| [' + file + '](' + file + '#L3) | 3 | @tregusti Use Symbol instead',
            ]);
        });

        it('edge-cases', async function () {
            const file = getFixturePath('edge-cases.js');
            const report = await getReport(file, BuiltinReporters.vscode, { extension: '.js' });
            should.exist(report);
            report.should.eql([
                '### TODOs',
                '| Filename | line # | TODO',
                '|:------|:------:|:------',
                '| [' + file + '](' + file + '#L1) | 1 | ',
                '| [' + file + '](' + file + '#L2) | 2 | ',
                '| [' + file + '](' + file + '#L3) | 3 | text',
                '| [' + file + '](' + file + '#L4) | 4 | something / after slash',
                '| [' + file + '](' + file + '#L5) | 5 | something with a URL http://example.com/path',
            ]);
        });
    });
});
