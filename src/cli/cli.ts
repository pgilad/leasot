import getStdin from 'get-stdin';
import { globbySync } from 'globby';
import logSymbols from 'log-symbols';
import { associateExtWithParser, isExtensionSupported, parse } from '../index.js';
import path from 'path';
import { mapLimit } from 'async';
import { ParseConfig, TodoComment } from '../definitions.js';
import fs from 'fs';
import { Command } from 'commander';
import { outputTodos, ProgramArgs } from './common.js';

const DEFAULT_EXTENSION = '.js';
const CONCURRENCY_LIMIT = 50;

/**
 * @hidden
 */
export const getFiletype = (filetype?: string, filename?: string): string => {
    if (filetype) {
        return filetype;
    }
    if (filename && path.extname(filename)) {
        return path.extname(filename);
    }
    return DEFAULT_EXTENSION;
};

const parseContentSync = async (content: string, options: ProgramArgs, filename?: string): Promise<TodoComment[]> => {
    const extension = getFiletype(options.filetype, filename);

    associateExtWithParser(options.associateParser);

    if (!isExtensionSupported(extension)) {
        if (options.skipUnsupported) {
            return [];
        }
        console.log(logSymbols.error, `Filetype ${extension} is unsupported.`);
        process.exit(1);
    }

    const config: ParseConfig = {
        customTags: options.tags,
        extension: extension,
        filename: filename,
        withInlineFiles: options.inlineFiles,
    };
    return await parse(content, config);
};

const parseAndReportFiles = (fileGlobs: string[], options: ProgramArgs): void => {
    // Get all files and their resolved globs
    const files = globbySync(fileGlobs, {
        ignore: options.ignore || [],
    });

    if (!files || !files.length) {
        console.log(logSymbols.warning, 'No files found for parsing');
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
            const contents = await Promise.all(
                results.map(async function (content: string, index: number) {
                    return await parseContentSync(content, options, files[index]);
                })
            );

            // filter files without any parsed content
            const todos = contents
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

    // data is coming from a pipe
    getStdin()
        .then(async function (content: string) {
            const todos = await parseContentSync(content, options);
            await outputTodos(todos, options);
        })
        .catch(function (e) {
            console.error(e);
            process.exit(1);
        });
};

export default run;
