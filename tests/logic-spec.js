const assert = require('assert');

const cli = require('../lib/cli');

describe('cli unit tests', function() {
    describe('getFileType', function() {
        it('should return default on no args', function() {
            assert.equal(cli.getFiletype(), '.js');
        });

        it('should return specified', function() {
            assert.equal(cli.getFiletype('.php'), '.php');
        });

        it('should return default if file is null', function() {
            assert.equal(cli.getFiletype(null, null), '.js');
        });

        it('should return default if file is empty', function() {
            assert.equal(cli.getFiletype(null, ''), '.js');
        });

        it('should return file extension', function() {
            assert.equal(cli.getFiletype(null, 'file.php'), '.php');
        });

        it('should return default if no file extension found', function() {
            assert.equal(cli.getFiletype(null, 'file'), '.js');
        });
    });
});
