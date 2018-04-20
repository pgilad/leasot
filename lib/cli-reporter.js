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
        function(file, cb) {
            fs.readFile(path.resolve(cwd, file), 'utf8', cb);
        },
        function(err, results) {
            if (err) {
                console.log(err);
                return process.exit(1);
            }
            const todos = results
                .map(function(content) {
                    return JSON.parse(content);
                })
                .filter(function(item) {
                    // filter files without any parsed content
                    return item && item.length > 0;
                })
                .reduce(function(items, item) {
                    // flatten list
                    return items.concat(item);
                }, []);

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
