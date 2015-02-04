/* global describe,it */
'use strict';
var fs = require('fs');
var should = require('should');
var path = require('path');
var util = require('util');
var leasot = require('../index');

var binPath = path.resolve(__dirname, '..', 'bin', 'leasot.js');

var getFixturePath = function (file) {
    return path.join('./tests/fixtures/', file);
};

var getComments = function (file) {
    var content = fs.readFileSync(file, 'utf8');
    var ext = path.extname(file);
    return leasot.parse(ext, content, file);
};

var testCli = function (files, cb) {
    var consoleLog = console.log;
    var processExit = process.exit;
    var log = '';
    var args = files.map(getFixturePath);
    process.argv = ['node', binPath].concat(args);

    console.log = function () {
        var output = util.format.apply(util.format, arguments);
        log += require('chalk').stripColor(output) + '\n';
    };

    process.exit = function (code) {
        process.exit = processExit;
        console.log = consoleLog;
        delete require.cache[require.resolve('../bin/leasot')];
        cb(code, log.split('\n'));
    };
    require('../bin/leasot');
};

describe('check parsing', function () {
    describe('stylus', function () {
        it('parse simple line comments', function () {
            var file = getFixturePath('line.styl');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            comments[0].kind.should.equal('FIXME');
            comments[0].line.should.equal(4);
            comments[0].text.should.equal('use fixmes as well');
        });

        it('parse block line comments', function () {
            var file = getFixturePath('block.styl');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(5);
            comments[0].text.should.equal('single line comment with a todo');
            comments[1].kind.should.equal('FIXME');
            comments[1].line.should.equal(6);
            comments[1].text.should.equal('single line comment with a todo');
        });
    });

    describe('handlebars', function () {
        it('parse {{! }} and {{!-- --}} comments', function () {
            var file = getFixturePath('handlebars.hbs');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(4);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(2);
            comments[0].text.should.equal('only output this author names if an author exists');
            comments[1].kind.should.equal('FIXME');
            comments[1].line.should.equal(8);
            comments[1].text.should.equal('This comment will not be in the output');
            comments[2].kind.should.equal('TODO');
            comments[2].text.should.equal('Multiple line comment');
            comments[2].line.should.equal(13);
            comments[3].kind.should.equal('TODO');
            comments[3].line.should.equal(13);
            comments[3].text.should.equal('and again');
        });
    });

    describe('sass', function () {
        it('parse // and /* comments', function () {
            var file = getFixturePath('block.sass');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(4);
            comments[0].kind.should.equal('TODO');
            comments[0].text.should.equal('it will appear in the CSS output.');
            comments[0].line.should.equal(2);
            comments[1].kind.should.equal('FIXME');
            comments[1].text.should.equal('this is a block comment too');
            comments[1].line.should.equal(3);
            comments[2].kind.should.equal('FIXME');
            comments[2].text.should.equal('They won\'t appear in the CSS output,');
            comments[2].line.should.equal(10);
            comments[3].kind.should.equal('TODO');
            comments[3].text.should.equal('improve this syntax');
            comments[3].line.should.equal(14);
        });
    });

    describe('scss', function () {
        it('parse // and /* comments', function () {
            var file = getFixturePath('block.scss');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            comments[0].kind.should.equal('TODO');
            comments[0].text.should.equal('add another class');
            comments[0].line.should.equal(4);
        });
    });

    describe('typescript', function () {
        it('parse // and /* comments', function () {
            var file = getFixturePath('typescript.ts');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(1);
            comments[0].text.should.equal('change to public');
            comments[1].kind.should.equal('FIXME');
            comments[1].line.should.equal(11);
            comments[1].text.should.equal('use jquery');
        });
    });

    describe('jsdoc', function () {
        it('handle jsdoc comments', function () {
            var file = getFixturePath('jsdoc.js');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(14);
            comments[0].text.should.equal('Show my TODO please');
        });
    });

    describe('coffeescript', function () {
        it('handle # comments', function () {
            var file = getFixturePath('coffee.coffee');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(1);
            comments[0].text.should.equal('Do something');
            comments[1].kind.should.equal('FIXME');
            comments[1].line.should.equal(3);
            comments[1].text.should.equal('Fix something');
        });
    });

    describe('less', function () {
        it('handles block and inline comment forms', function () {
            var file = getFixturePath('block.less');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(4);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(2);
            comments[0].text.should.equal('it will appear in the CSS output.');
            comments[1].kind.should.equal('FIXME');
            comments[1].line.should.equal(3);
            comments[1].text.should.equal('this is a block comment too');
            comments[2].kind.should.equal('FIXME');
            comments[2].line.should.equal(10);
            comments[2].text.should.equal('They won\'t appear in the CSS output,');
            comments[3].kind.should.equal('TODO');
            comments[3].line.should.equal(14);
            comments[3].text.should.equal('improve this syntax');
        });
    });

    describe('jsx', function () {
        it('handles standard js comments in jsx', function () {
            var file = getFixturePath('react.jsx');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(14);
            comments[0].text.should.equal('Show my TODO please');
            comments[1].kind.should.equal('FIXME');
            comments[1].line.should.equal(21);
            comments[1].text.should.equal('illogical');
        });
    });
});

describe('check cli', function () {
    describe('multiple files', function () {
        it('should parse multiple files (single file per arg)', function (done) {
            testCli(['block.less', 'coffee.coffee'], function (code, log) {
                code.should.equal(1);
                log.should.eql([
                    '',
                    'tests/fixtures/block.less',
                    '  line 2   TODO   it will appear in the CSS output.',
                    '  line 3   FIXME  this is a block comment too',
                    '  line 10  FIXME  They won\'t appear in the CSS output,',
                    '  line 14  TODO   improve this syntax',
                    '',
                    ' ✖ 4 problems',
                    '',
                    'tests/fixtures/coffee.coffee',
                    '  line 1  TODO   Do something',
                    '  line 3  FIXME  Fix something',
                    '',
                    ' ✖ 2 problems',
                    '',
                    '⚠ Scanned a total of 2 files. 2 contained todos/fixmes.',
                    ''
                ]);
                done();
            });
        });

        it('should parse multiple files (globbing)', function (done) {
            testCli(['*.styl'], function (code, log) {
                code.should.equal(1);
                log.should.eql([
                    '',
                    'tests/fixtures/block.styl',
                    '  line 5  TODO   single line comment with a todo',
                    '  line 6  FIXME  single line comment with a todo',
                    '',
                    ' ✖ 2 problems',
                    '',
                    'tests/fixtures/line.styl',
                    '  line 4  FIXME  use fixmes as well',
                    '',
                    ' ✖ 1 problem',
                    '',
                    '⚠ Scanned a total of 2 files. 2 contained todos/fixmes.',
                    ''
                ]);
                done();
            });
        });

        it('should get no error code if no todos or fixmes are found', function (done) {
            testCli(['no-todos.js'], function (code, log) {
                code.should.equal(0);
                log.should.eql([
                    '',
                    '✔ Scanned 1 file. No todos/fixmes found.',
                    ''
                ]);
                done();
            });
        });
    });
});
