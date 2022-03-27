import _ from 'lodash';
import { EOL } from 'os';
import { ReportItems, ReporterConfig, Tag, TodoComment, TransformedComments } from '../../definitions.js';

/**
 * @hidden
 */
export const getTransformedComments = (todos: TodoComment[], config: ReporterConfig): TransformedComments => {
    const transformFn = config.transformComment;
    if (!todos.length) {
        //early return in case of no comments
        //FIXME: make the default header a configurable option
        return {
            TODO: [],
        };
    }
    return todos.reduce(function (mem: TransformedComments, comment: TodoComment) {
        const tag = comment.tag;

        mem[tag] = mem[tag] || [];
        // transformed comment as an array item
        let transformedComment = transformFn(comment.file, comment.line, comment.text, tag, comment.ref);
        // enforce array type
        if (!Array.isArray(transformedComment)) {
            transformedComment = [transformedComment];
        }
        // append to tag array
        mem[tag] = mem[tag].concat(transformedComment);
        return mem;
    }, {});
};

/**
 * @hidden
 */
export const joinBlocksByHeaders = (output: TransformedComments, config: ReporterConfig): string => {
    const padding = config.padding;
    const newLine = config.newLine;
    const transformHeader = config.transformHeader;
    let header;
    let contents = '';

    //prepend headers
    Object.keys(output).forEach(function (tag: Tag) {
        header = transformHeader(tag);
        // enforce array response
        if (!Array.isArray(header)) {
            header = [header];
        }
        output[tag] = _.compact(header.concat(output[tag]));
        // add padding between tag blocks
        if (contents.length) {
            contents += new Array(padding + 1).join(newLine);
        }
        contents += output[tag].join(newLine);
    });

    return contents;
};

/**
 * @hidden
 */
export const prepareConfig = (defaultConfig: ReporterConfig, overrides?: ReporterConfig): ReporterConfig => {
    const config: ReporterConfig = _.defaults({}, overrides, defaultConfig, {
        newLine: EOL,
        padding: 2,
    });

    if (typeof config.transformHeader !== 'function') {
        throw new TypeError('transformHeader must be a function');
    }
    if (typeof config.transformComment !== 'function') {
        throw new TypeError('transformComment must be a function');
    }
    // padding must be a minimum of 0
    // enforce padding to be a number as well
    config.padding = Math.max(0, config.padding);

    return config;
};

const reporterConfig: ReporterConfig = {
    transformComment(file, line, text, _tag, ref) {
        return [`file: ${file}`, `line: ${line}`, `text: ${text}`, `ref:${ref}`];
    },
    transformHeader(tag) {
        return [`tag: ${tag}`];
    },
};

export const reporter: ReportItems = (todos: TodoComment[], config?: ReporterConfig): string => {
    const parsedConfig = prepareConfig(reporterConfig, config);
    const output = getTransformedComments(todos, parsedConfig);
    return joinBlocksByHeaders(output, parsedConfig);
};
