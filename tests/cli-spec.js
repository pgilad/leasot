'use strict';
var path = require('path');
var chalk = require('chalk');
var should = require('should');
var childProcess = require('child_process');

function getFixturePath(file) {
    return path.join('./tests/fixtures/', file);
}

function testCli(files, cb) {
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
}

describe('check cli', function () {
    describe('multiple files', function () {
        it('should parse multiple files (single file per arg)', function (done) {
            this.timeout(10000);
            testCli(['block.less', 'coffee.coffee'], function (exitCode, log) {
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
                done();
            });
        });

        it('should parse multiple files (globbing)', function (done) {
            testCli(['*.styl'], function (exitCode, log) {
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
                done();
            });
        });

        it('should get no error exitCode if no todos or fixmes are found', function (done) {
            testCli(['no-todos.js'], function (exitCode, log) {
                should.exist(log);
                should.exist(exitCode);
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
