/* global describe,it */
var cli = require('../lib/cli');
var assert = require('assert');

describe('cli unit tests', function () {
    describe('getFileType', function () {
        it('should return default on no args', function () {
            var getFiletype = cli.getFiletype;
            var ext = getFiletype();
            assert.equal(ext, '.js');
        });

        it('should return specified', function () {
            var getFiletype = cli.getFiletype;
            var ext = getFiletype('.php');
            assert.equal(ext, '.php');
        });

        it('should return default if file is null', function () {
            var getFiletype = cli.getFiletype;
            var ext = getFiletype(null, null);
            assert.equal(ext, '.js');
        });

        it('should return default if file is empty', function () {
            var getFiletype = cli.getFiletype;
            var ext = getFiletype(null, '');
            assert.equal(ext, '.js');
        });

        it('should return file extension', function () {
            var getFiletype = cli.getFiletype;
            var ext = getFiletype(null, 'file.php');
            assert.equal(ext, '.php');
        });

        it('should return default if no file extension found', function () {
            var getFiletype = cli.getFiletype;
            var ext = getFiletype(null, 'file');
            assert.equal(ext, '.js');
        });
    });
});
