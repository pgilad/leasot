/* eslint-disable no-console */

const path = require('path');
const fs = require('fs');

const getStdin = require('get-stdin');
const globby = require('globby');
const logSymbols = require('log-symbols');
const mapLimit = require('async/mapLimit');

const leasot = require('../index');
const concurrencyLimit = 50;

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
        console.log(logSymbols.warning, 'No files found for reporting');
        return process.exit(1);
    }

    // Parallel read all of the given files
    mapLimit(
        files,
        concurrencyLimit,
        (file, cb) => fs.readFile(path.resolve(cwd, file), 'utf8', cb),
        (err, results) => {
            if (err) {
                console.log(err);
                return process.exit(1);
            }
            const todos = results
                .map(content => JSON.parse(content))
                // filter files without any parsed content
                .filter(item => item && item.length > 0)
                .reduce((items, item) => items.concat(item), []);

            outputTodos(todos, program);
        }
    );
}

module.exports = function(program) {
    if (!process.stdin.isTTY) {
        return getStdin()
            .then(function(content) {
                const todos = JSON.parse(content);
                outputTodos(todos, program);
            })
            .catch(function(e) {
                console.error(e);
                process.exit(1);
            });
    }
    const files = program.args;
    if (files.length === 0) {
        return program.help();
    }
    parseAndReportFiles(files, program);
};
