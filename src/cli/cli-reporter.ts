import getStdin from 'get-stdin';
import globby from 'globby';
import logSymbols from 'log-symbols';
import { mapLimit } from 'async';
import { readFile } from 'fs';
import { report } from '..';
import { ReporterProgramArgs } from './leasot-reporter';
import { resolve } from 'path';
import { TodoComment } from '../definitions';

const concurrencyLimit = 50;

const outputTodos = (todos: TodoComment[], program: ReporterProgramArgs) => {
    try {
        const output = report(todos, program.reporter);
        console.log(output);
    } catch (e) {
        console.error(e);
    }
    if (program.exitNicely) {
        process.exit(0);
    }
    process.exit(todos.length ? 1 : 0);
};

const parseAndReportFiles = (fileGlobs: string[], program: ReporterProgramArgs): void => {
    // Get all files and their resolved globs
    const files = globby.sync(fileGlobs, {
        ignore: program.ignore || [],
    });

    if (!files || !files.length) {
        console.log(logSymbols.warning, 'No files found for reporting');
        process.exit(1);
    }

    // Parallel read all of the given files
    mapLimit(
        files,
        concurrencyLimit,
        (file, cb) => readFile(resolve(process.cwd(), file), 'utf8', cb),
        (err, results: string[]) => {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            const todos = results
                .map(content => JSON.parse(content))
                // filter files without any parsed content
                .filter(item => item && item.length > 0)
                .reduce((items, item) => items.concat(item), []);

            outputTodos(todos, program);
        }
    );
};

const run = (program: ReporterProgramArgs): void => {
    if (program.args && program.args.length > 0) {
        return parseAndReportFiles(program.args, program);
    }

    if (process.stdin.isTTY) {
        return program.help();
    }

    getStdin()
        .then(function(content: string) {
            const todos = JSON.parse(content);
            outputTodos(todos, program);
        })
        .catch(function(e) {
            console.error(e);
            process.exit(1);
        });
};

export default run;
