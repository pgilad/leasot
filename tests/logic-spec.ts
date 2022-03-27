import assert from 'assert';

import { getFiletype } from '../src/cli/cli.js';

describe('cli unit tests', function () {
    describe('getFileType', function () {
        it('should return default on no args', function () {
            assert.strictEqual(getFiletype(), '.js');
        });

        it('should return specified', function () {
            assert.strictEqual(getFiletype('.php'), '.php');
        });

        it('should return default if file is null', function () {
            assert.strictEqual(getFiletype(), '.js');
        });

        it('should return default if file is empty', function () {
            assert.strictEqual(getFiletype(null, ''), '.js');
        });

        it('should return file extension', function () {
            assert.strictEqual(getFiletype(null, 'file.php'), '.php');
        });

        it('should return default if no file extension found', function () {
            assert.strictEqual(getFiletype(null, 'file'), '.js');
        });
    });
});
