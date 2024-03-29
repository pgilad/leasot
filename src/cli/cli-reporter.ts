import getStdin from 'get-stdin';
import { globbySync } from 'globby';
import logSymbols from 'log-symbols';
import fs from 'fs';
import path from 'path';
import { mapLimit } from 'async';
import { Command } from 'commander';
import { outputTodos, ProgramArgs } from './common.js';

const CONCURRENCY_LIMIT = 50;

const parseAndReportFiles = (fileGlobs: string[], options: ProgramArgs): void => {
    // Get all files and their resolved globs
    const files = globbySync(fileGlobs, {
        ignore: options.ignore || [],
    });

    if (!files || !files.length) {
        console.log(logSymbols.warning, 'No files found for reporting');
        process.exit(1);
    }

    // Parallel read all the given files
    mapLimit(
        files,
        CONCURRENCY_LIMIT,
        (file, cb) => fs.readFile(path.resolve(process.cwd(), file), 'utf8', cb),
        async (err, results: string[]) => {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            const todos = results
                .map((content) => JSON.parse(content))
                // filter files without any parsed content
                .filter((item) => item && item.length > 0)
                .reduce((items, item) => items.concat(item), []);

            await outputTodos(todos, options);
        }
    );
};

const run = (program: Command): void => {
    const options = program.opts();
    if (program.args && program.args.length > 0) {
        return parseAndReportFiles(program.args, options);
    }

    if (process.stdin.isTTY) {
        return program.help();
    }

    getStdin()
        .then(async function (content: string) {
            const todos = JSON.parse(content);
            await outputTodos(todos, options);
        })
        .catch(function (e) {
            console.error(e);
            process.exit(1);
        });
};

export default run;
