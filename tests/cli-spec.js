'use strict';
var path = require('path');
var chalk = require('chalk');
var should = require('should');
var childProcess = require('child_process');

function getFixturePath(file) {
    return path.join('./tests/fixtures/', file);
}

function testCli(files, extraArgs, cb) {
    var args = files.map(getFixturePath).concat(extraArgs || []);

    var cp = childProcess.spawn('./bin/leasot.js', args, {
        cwd: path.resolve(__dirname, '..'),
        env: process.env,
        stdio: [process.stdin, 'pipe', 'pipe']
    });
    var chunks = '';
    cp.stdout.on('data', function (data) {
        chunks = new Buffer(data).toString();
    });
    cp.on('close', function (exitCode) {
        cb(exitCode, chalk.stripColor(chunks.split('\n')));
    });
}

describe('check cli', function () {
    it('should be ok with no files found', function (callback) {
        testCli(['*.impossible'], null, function (exitCode, log) {
            should.exist(log);
            should.exist(exitCode);
            exitCode.should.equal(1);
            log.should.eql([
                '⚠ No files found for parsing',
                ''
            ]);
            callback();
        });
    });
    it('should parse multiple files (single file per arg)', function (callback) {
        this.timeout(10000);
        testCli(['block.less', 'coffee.coffee'], null, function (exitCode, log) {
            should.exist(exitCode);
            should.exist(log);
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
            callback();
        });
    });

    it('should parse multiple files (globbing)', function (callback) {
        testCli(['*.styl'], null, function (exitCode, log) {
            should.exist(exitCode);
            should.exist(log);
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
            callback();
        });
    });

    it('should test unsupported file', function (callback) {
        testCli(['file.unsupported'], [], function (exitCode, log) {
            should.exist(exitCode);
            should.exist(log);
            exitCode.should.equal(1);
            log.should.eql([
                '✖ Filetype .unsupported is unsupported.',
                '',
            ]);
            callback();
        });
    });

    it('should skip unsupported files if asked', function (callback) {
        testCli(['file.unsupported'], ['--skip-unsupported'], function (exitCode, log) {
            should.exist(exitCode);
            should.exist(log);
            exitCode.should.equal(0);
            log.should.eql([
                '',
                '',
                ' ✔ No todos/fixmes found',
                ''
            ]);
            callback();
        });
    });

    it('should not parse file with unknown extension', function (callback) {
        testCli(['salesforce-apex.cls'], [], function (exitCode, log) {
            should.exist(exitCode);
            should.exist(log);
            exitCode.should.equal(1);
            log.should.eql([
                '✖ Filetype .cls is unsupported.',
                ''
            ]);
            callback();
        });
    });

    it('should parse file with newly associated extension', function (callback) {
        testCli(['salesforce-apex.cls'], ['--associate-parser', '.cls,defaultParser'], function (exitCode, log) {
            should.exist(exitCode);
            should.exist(log);
            exitCode.should.equal(1);
            log.should.eql([
                '',
                'tests/fixtures/salesforce-apex.cls',
                '  line 4  TODO   Add detail',
                '  line 7  FIXME  do something with the file contents',
                '',
                ' ✖ 2 todos/fixmes found',
                ''
            ]);
            callback();
        });
    });

    it('should get no error exitCode if no todos or fixmes are found', function (callback) {
        testCli(['no-todos.js'], null, function (exitCode, log) {
            should.exist(log);
            should.exist(exitCode);
            exitCode.should.equal(0);
            log.should.eql([
                '',
                '',
                ' ✔ No todos/fixmes found',
                ''
            ]);
            callback();
        });
    });

    it('should apply the ignore pattern', function (callback) {
        testCli(['*.styl'], ['--ignore', '**/block.styl'], function (exitCode, log) {
            should.exist(exitCode);
            should.exist(log);
            exitCode.should.equal(1);
            log.should.eql([
                '',
                'tests/fixtures/line.styl',
                '  line 4  FIXME  use fixmes as well',
                '',
                ' ✖ 1 todo/fixme found',
                ''
            ]);
            callback();
        });
    });

    it('should exit with 0 on output', function (callback) {
        this.timeout(10000);
        testCli(['coffee.coffee'], ['--exit-nicely'], function (exitCode, log) {
            should.exist(exitCode);
            should.exist(log);
            exitCode.should.equal(0);
            log.should.eql([
                '',
                'tests/fixtures/coffee.coffee',
                '  line 1  TODO   Do something',
                '  line 3  FIXME  Fix something',
                '',
                ' ✖ 2 todos/fixmes found',
                ''
            ]);
            callback();
        });
    });
});
