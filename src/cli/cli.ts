import getStdin from 'get-stdin';
import globby from 'globby';
import logSymbols from 'log-symbols';
import { associateExtWithParser, isExtensionSupported, parse, report } from '..';
import { extname, resolve } from 'path';
import { mapLimit } from 'async';
import { BuiltinReporters, ExtensionsDb, ParseConfig, ReporterName, Tag, TodoComment } from '../definitions';
import { readFile } from 'fs';
import { CommanderStatic } from 'commander';

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

/**
 * @hidden
 */
export interface ProgramArgs {
    readonly associateParser?: ExtensionsDb;
    readonly exitNicely?: boolean;
    readonly filetype?: string;
    readonly ignore?: string[];
    readonly inlineFiles?: boolean;
    readonly reporter?: BuiltinReporters | ReporterName;
    readonly skipUnsupported?: boolean;
    readonly tags?: Tag[];
}

const parseContentSync = (content: string, options: ProgramArgs, filename?: string): TodoComment[] => {
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
    return parse(content, config);
};

const outputTodos = (todos: TodoComment[], options: ProgramArgs) => {
    try {
        const output = report(todos, options.reporter);
        console.log(output);
    } catch (e) {
        console.error(e);
    }
    if (options.exitNicely) {
        process.exit(0);
    }
    process.exit(todos.length ? 1 : 0);
};

const parseAndReportFiles = (fileGlobs: string[], options: ProgramArgs): void => {
    // Get all files and their resolved globs
    const files = globby.sync(fileGlobs, {
        ignore: options.ignore || [],
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
                .map(function (content: string, index: number) {
                    return parseContentSync(content, options, files[index]);
                })
                // filter files without any parsed content
                .filter(item => item && item.length > 0)
                .reduce((items, item) => items.concat(item), []);

            outputTodos(todos, options);
        }
    );
};

const run = (program: CommanderStatic): void => {
    const options = program.opts();
    if (program.args && program.args.length > 0) {
        return parseAndReportFiles(program.args, options);
    }

    if (process.stdin.isTTY) {
        return program.help();
    }

    // data is coming from a pipe
    getStdin()
        .then(function (content: string) {
            const todos = parseContentSync(content, options);
            outputTodos(todos, options);
        })
        .catch(function (e) {
            console.error(e);
            process.exit(1);
        });
};

export default run;
