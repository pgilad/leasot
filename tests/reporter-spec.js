const fs = require('fs');
const should = require('should');
const path = require('path');
const eol = require('eol');

const leasot = require('../index');

function getFixturePath(file) {
    return path.join('./tests/fixtures/', file);
}

function getReport(fileName, reporterOptions, parseOptions) {
    parseOptions = parseOptions || {};
    parseOptions.content = fs.readFileSync(fileName, 'utf8');
    parseOptions.fileName = fileName;
    parseOptions.ext = path.extname(fileName);
    const comments = leasot.parse(parseOptions);
    reporterOptions = reporterOptions || {};
    const report = leasot.reporter(comments, reporterOptions);
    return eol.split(report);
}

describe('reporting', function() {
    describe('vscode', function() {
        it('typescript', function() {
            const file = getFixturePath('typescript.ts');
            const report = getReport(file, { reporter: 'vscode' });
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
        it('reference-leading', function() {
            const file = getFixturePath('reference-leading.js');
            const report = getReport(file, { reporter: 'vscode' });
            should.exist(report);
            report.should.eql([
                '### TODOs',
                '| Filename | line # | TODO',
                '|:------|:------:|:------',
                '| [' + file + '](' + file + '#L3) | 3 | @tregusti Use Symbol instead',
            ]);
        });
        it('edge-cases', function() {
            const file = getFixturePath('edge-cases.js');
            const report = getReport(file, { reporter: 'vscode' });
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
