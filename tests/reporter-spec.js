/* global describe,it */
'use strict';
var fs = require('fs');
var should = require('should');
var path = require('path');
var eol = require('eol');
var leasot = require('../index');

function getFixturePath(file) {
    return path.join('./tests/fixtures/', file);
}

function getReport(fileName, reporterOptions, parseOptions) {
    parseOptions = parseOptions || {};
    parseOptions.content = fs.readFileSync(fileName, 'utf8');
    parseOptions.fileName = fileName;
    parseOptions.ext = path.extname(fileName);
    var comments = leasot.parse(parseOptions);
    reporterOptions = reporterOptions || {};
    var report = leasot.reporter(comments, reporterOptions);
    return eol.split(report);
}

describe('reporting', function () {
    describe('vscode', function () {
        it('typescript', function () {
            var file = getFixturePath('typescript.ts');
            var report = getReport(file, { reporter: 'vscode' });
            report.should.eql([
                '### TODOs',
                '| Filename | line # | TODO',
                '|:------|:------:|:------',
                '| [' + file + '](' + file + '#L1) | 1 | change to public',
                '',
                '### FIXMEs',
                '| Filename | line # | FIXME',
                '|:------|:------:|:------',
                '| [' + file + '](' + file + '#L11) | 11 | use jquery'
            ]);
        });
        it('reference-leading', function () {
            var file = getFixturePath('reference-leading.js');
            var report = getReport(file, { reporter: 'vscode' });
            report.should.eql([
                '### TODOs',
                '| Filename | line # | TODO',
                '|:------|:------:|:------',
                '| [' + file + '](' + file + '#L3) | 3 | @tregusti Use Symbol instead'
            ]);
        });
        it('edge-cases', function () {
            var file = getFixturePath('edge-cases.js');
            var report = getReport(file, { reporter: 'vscode' });
            report.should.eql([
                '### TODOs',
                '| Filename | line # | TODO',
                '|:------|:------:|:------',
                '| [' + file + '](' + file + '#L1) | 1 | ',
                '| [' + file + '](' + file + '#L2) | 2 | ',
                '| [' + file + '](' + file + '#L3) | 3 | text',
                '| [' + file + '](' + file + '#L4) | 4 | something / after slash',
                '| [' + file + '](' + file + '#L5) | 5 | something with a URL http://example.com/path'
            ]);
        });
    });
});
