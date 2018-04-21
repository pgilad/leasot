/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const getStdin = require('get-stdin');
const globby = require('globby');
const logSymbols = require('log-symbols');
const mapLimit = require('async/mapLimit');

const leasot = require('../index');

const DEFAULT_EXTENSION = '.js';
const CONCURRENCY_LIMIT = 50;

function getFiletype(specified, file) {
    if (specified) {
        return specified;
    }
    if (file && path.extname(file)) {
        return path.extname(file);
    }
    return DEFAULT_EXTENSION;
}

function parseContentSync(content, { file, filetype, inlineFiles, skipUnsupported, tags, associateParser } = {}) {
    const ext = getFiletype(filetype, file);

    leasot.associateExtWithParser(associateParser);

    if (!leasot.isExtSupported(ext)) {
        if (skipUnsupported) {
            return [];
        }
        console.log(logSymbols.error, `Filetype ${ext} is unsupported.`);
        process.exit(1);
    }
    return leasot.parse({
        content: content,
        customTags: tags,
        ext: ext,
        fileName: file,
        withInlineFiles: inlineFiles,
    });
}

function outputTodos(todos, { reporter, exitNicely }) {
    try {
        const output = leasot.reporter(todos, {
            reporter: reporter,
        });
        console.log(output);
    } catch (e) {
        console.error(e);
    }
    if (exitNicely) process.exit(0);
    process.exit(todos.length ? 1 : 0);
}

function parseAndReportFiles(fileGlobs, program) {
    const cwd = process.cwd();
    const ignore = program.ignore || [];

    // Get all files and their resolved globs
    const files = globby.sync(fileGlobs, {
        cwd: cwd,
        ignore: ignore,
        onlyFiles: true,
    });

    if (!files || !files.length) {
        console.log(logSymbols.warning, 'No files found for parsing');
        return process.exit(1);
    }

    // Parallel read all of the given files
    mapLimit(
        files,
        CONCURRENCY_LIMIT,
        (file, cb) => fs.readFile(path.resolve(cwd, file), 'utf8', cb),
        (err, results) => {
            if (err) {
                console.log(err);
                return process.exit(1);
            }
            const todos = results
                .map(function(content, i) {
                    const parseParams = Object.assign({ file: files[i] }, program);
                    return parseContentSync(content, parseParams);
                })
                // filter files without any parsed content
                .filter(item => item && item.length > 0)
                .reduce((items, item) => items.concat(item), []);

            outputTodos(todos, program);
        }
    );
}

module.exports = function(program) {
    const files = program.args;
    if (files && files.length > 0) {
        return parseAndReportFiles(files, program);
    }
    if (!process.stdin.isTTY) {
        // data is coming from a pipe
        return getStdin()
            .then(function(content) {
                const todos = parseContentSync(content, program);
                outputTodos(todos, program);
            })
            .catch(function(e) {
                console.error(e);
                process.exit(1);
            });
    }
    program.help();
};

module.exports.getFiletype = getFiletype;
