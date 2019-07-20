import * as globby from 'globby';
import * as logSymbols from 'log-symbols';
import getStdin from 'get-stdin';
import { extname, resolve } from 'path';
import { associateExtWithParser, isExtensionSupported, parse, report } from '..';
import { mapLimit } from 'async';
import { ParseConfig, TodoComment } from '../definitions';
import { ProgramArgs } from './leasot';
import { readFile } from 'fs';

const DEFAULT_EXTENSION = '.js';
const CONCURRENCY_LIMIT = 50;

/**
 * @hidden
 */
export const getFiletype = (filetype?: string, filename?: string): string => {
    if (filetype) {
        return filetype;
    }
    if (filename && extname(filename)) {
        return extname(filename);
    }
    return DEFAULT_EXTENSION;
};

const parseContentSync = (content: string, program: ProgramArgs, filename?: string): TodoComment[] => {
    const extension = getFiletype(program.filetype, filename);

    associateExtWithParser(program.associateParser);

    if (!isExtensionSupported(extension)) {
        if (program.skipUnsupported) {
            return [];
        }
        console.log(logSymbols.error, `Filetype ${extension} is unsupported.`);
        process.exit(1);
    }

    const config: ParseConfig = {
        customTags: program.tags,
        extension: extension,
        filename: filename,
        withInlineFiles: program.inlineFiles,
    };
    return parse(content, config);
};

const outputTodos = (todos: TodoComment[], { reporter, exitNicely }: ProgramArgs) => {
    try {
        const output = report(todos, reporter);
        console.log(output);
    } catch (e) {
        console.error(e);
    }
    if (exitNicely) {
        process.exit(0);
    }
    process.exit(todos.length ? 1 : 0);
};

const parseAndReportFiles = (fileGlobs: string[], program: ProgramArgs): void => {
    // Get all files and their resolved globs
    const files = globby.sync(fileGlobs, {
        ignore: program.ignore || [],
    });

    if (!files || !files.length) {
        console.log(logSymbols.warning, 'No files found for parsing');
        process.exit(1);
    }

    // Parallel read all of the given files
    mapLimit(
        files,
        CONCURRENCY_LIMIT,
        (file, cb) => readFile(resolve(process.cwd(), file), 'utf8', cb),
        (err, results: string[]) => {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            const todos = results
                .map(function(content: string, index: number) {
                    return parseContentSync(content, program, files[index]);
                })
                // filter files without any parsed content
                .filter(item => item && item.length > 0)
                .reduce((items, item) => items.concat(item), []);

            outputTodos(todos, program);
        }
    );
};

const run = (program: ProgramArgs): void => {
    if (program.args && program.args.length > 0) {
        return parseAndReportFiles(program.args, program);
    }

    if (process.stdin.isTTY) {
        return program.help();
    }

    // data is coming from a pipe
    getStdin()
        .then(function(content: string) {
            const todos = parseContentSync(content, program);
            outputTodos(todos, program);
        })
        .catch(function(e) {
            console.error(e);
            process.exit(1);
        });
};

export default run;
