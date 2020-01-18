import * as fs from 'fs';
import * as leasot from '../src/index';
import * as path from 'path';
import * as should from 'should';
import { BuiltinReporters, ParseConfig, ReporterName } from '../src/definitions';
import { split } from 'eol';

function getFixturePath(file: string): string {
    return path.join('./tests/fixtures/', file);
}

function getReport(filename: string, reporter: ReporterName, parseOptions: ParseConfig) {
    parseOptions.filename = filename;

    const content = fs.readFileSync(filename, 'utf8');
    const comments = leasot.parse(content, parseOptions);
    const report = leasot.report(comments, reporter);
    return split(report);
}

describe('reporting', function() {
    describe('vscode', function() {
        it('typescript', function() {
            const file = getFixturePath('typescript.ts');
            const report = getReport(file, BuiltinReporters.vscode, { extension: '.ts' });
            should.exist(report);
            report.should.eql([
                '## TODOs',
                '',
                '| Filename | line # | TODO',
                '|:------|:------:|:------',
                '| [' + file + '](' + file + '#L1) | 1 | change to public',
                '',
                '## FIXMEs',
                '',
                '| Filename | line # | FIXME',
                '|:------|:------:|:------',
                '| [' + file + '](' + file + '#L11) | 11 | use jquery',
            ]);
        });

        it('reference-leading', function() {
            const file = getFixturePath('reference-leading.js');
            const report = getReport(file, BuiltinReporters.vscode, { extension: '.js' });
            should.exist(report);
            report.should.eql([
                '## TODOs',
                '',
                '| Filename | line # | TODO',
                '|:------|:------:|:------',
                '| [' + file + '](' + file + '#L3) | 3 | @tregusti Use Symbol instead',
            ]);
        });

        it('edge-cases', function() {
            const file = getFixturePath('edge-cases.js');
            const report = getReport(file, BuiltinReporters.vscode, { extension: '.js' });
            should.exist(report);
            report.should.eql([
                '## TODOs',
                '',
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
