/* global describe,it */
'use strict';
var fs = require('fs');
var should = require('should');
var path = require('path');
var leasot = require('../index');
var chalk = require('chalk');
var childProcess = require('child_process');

var getFixturePath = function (file) {
    return path.join('./tests/fixtures/', file);
};

var getComments = function (file) {
    var content = fs.readFileSync(file, 'utf8');
    var ext = path.extname(file);
    return leasot.parse(ext, content, file);
};

var testCli = function (files, cb) {
    var args = files.map(getFixturePath);

    var cp = childProcess.spawn('./bin/leasot.js', args, {
        cwd: path.resolve(__dirname, '..'),
        env: process.env,
        stdio: [process.stdin, 'pipe', 'pipe']
    });
    var chunks;
    cp.stdout.on('data', function (data) {
        chunks = new Buffer(data).toString();
    });
    cp.on('close', function (exitCode) {
        cb(exitCode, chalk.stripColor(chunks.split('\n')));
    });
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

        it('handle jsdoc @todo comments', function () {
            var file = getFixturePath('jsdoc2.js');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(9);
            comments[0].text.should.equal('make this supported');
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

    describe('coffee-react', function () {
        it('handle # comments', function () {
            var file = getFixturePath('coffee-react.cjsx');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(1);
            comments[0].text.should.equal('better document');
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

    describe('twig', function () {
        it('matches bang and html comment style', function () {
            var file = getFixturePath('twig.twig');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            comments[0].kind.should.equal('FIXME');
            comments[0].line.should.equal(1);
            comments[0].text.should.equal("Hey, I'm a fixme!");
            comments[1].kind.should.equal('TODO');
            comments[1].line.should.equal(13);
            comments[1].text.should.equal("Hey, I'm a todo!");
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

    describe('php', function () {
        it('handles standard js comments in php', function () {
            var file = getFixturePath('sample.php');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(3);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(2);
            comments[0].text.should.equal('This is a single-line comment');
            comments[1].kind.should.equal('FIXME');
            comments[1].line.should.equal(7);
            comments[1].text.should.equal('implement single line comment');
            comments[2].kind.should.equal('TODO');
            comments[2].line.should.equal(14);
            comments[2].text.should.equal('supported?');
        });
    });
});

describe('check cli', function () {
    describe('multiple files', function () {
        it('should parse multiple files (single file per arg)', function (done) {
            this.timeout(10000);
            testCli(['block.less', 'coffee.coffee'], function (exitCode, log) {
                exitCode.should.equal(1);
                log.should.eql([
                    '',
                    'tests/fixtures/block.less',
                    '  line 2   TODO   it will appear in the CSS output.',
                    '  line 3   FIXME  this is a block comment too',
                    '  line 10  FIXME  They won\'t appear in the CSS output,',
                    '  line 14  TODO   improve this syntax',
                    '',
                    'tests/fixtures/coffee.coffee',
                    '  line 1   TODO   Do something',
                    '  line 3   FIXME  Fix something',
                    '',
                    ' ✖ 6 todos/fixmes found',
                    ''
                ]);
                done();
            });
        });

        it('should parse multiple files (globbing)', function (done) {
            testCli(['*.styl'], function (exitCode, log) {
                exitCode.should.equal(1);
                log.should.eql([
                    '',
                    'tests/fixtures/block.styl',
                    '  line 5  TODO   single line comment with a todo',
                    '  line 6  FIXME  single line comment with a todo',
                    '',
                    'tests/fixtures/line.styl',
                    '  line 4  FIXME  use fixmes as well',
                    '',
                    ' ✖ 3 todos/fixmes found',
                    ''
                ]);
                done();
            });
        });

        it('should get no error exitCode if no todos or fixmes are found', function (done) {
            testCli(['no-todos.js'], function (exitCode, log) {
                exitCode.should.equal(0);
                log.should.eql([
                    '',
                    '',
                    ' ✔ No todos/fixmes found',
                    ''
                ]);
                done();
            });
        });
    });
});
