var assert = require('assert');
var cli = require('../src/cli/cli');
describe('cli unit tests', function () {
    describe('getFileType', function () {
        it('should return default on no args', function () {
            assert.strictEqual(cli.getFiletype(), '.js');
        });
        it('should return specified', function () {
            assert.strictEqual(cli.getFiletype('.php'), '.php');
        });
        it('should return default if file is null', function () {
            assert.strictEqual(cli.getFiletype(), '.js');
        });
        it('should return default if file is empty', function () {
            assert.strictEqual(cli.getFiletype(null, ''), '.js');
        });
        it('should return file extension', function () {
            assert.strictEqual(cli.getFiletype(null, 'file.php'), '.php');
        });
        it('should return default if no file extension found', function () {
            assert.strictEqual(cli.getFiletype(null, 'file'), '.js');
        });
    });
});
