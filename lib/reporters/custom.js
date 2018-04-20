const os = require('os');

const compact = require('lodash/compact');
const defaults = require('lodash/defaults');

function getTransformedComments(todos, config) {
    const transformFn = config.transformComment;
    if (!todos.length) {
        //early return in case of no comments
        //FIXME: make the default header a configurable option
        return {
            TODO: [],
        };
    }
    return todos.reduce(function(mem, comment) {
        const kind = comment.kind;
        mem[kind] = mem[kind] || [];
        // transformed comment as an array item
        let transformedComment = transformFn(comment.file, comment.line, comment.text, kind, comment.ref);
        // enforce array type
        if (!Array.isArray(transformedComment)) {
            transformedComment = [transformedComment];
        }
        // append to kind array
        mem[kind] = mem[kind].concat(transformedComment);
        return mem;
    }, {});
}

function joinBlocksByHeaders(output, config) {
    const padding = config.padding;
    const newLine = config.newLine;
    const transformHeader = config.transformHeader;
    let header;
    let contents = '';
    //prepend headers
    Object.keys(output).forEach(function(kind) {
        header = transformHeader(kind);
        // enforce array response
        if (!Array.isArray(header)) {
            header = [header];
        }
        output[kind] = compact(header.concat(output[kind]));
        // add padding between kind blocks
        if (contents.length) {
            contents += new Array(padding + 1).join(newLine);
        }
        contents += output[kind].join(newLine);
    });
    return contents;
}

function parseConfig(_config) {
    const config = defaults(_config || {}, {
        padding: 2,
        newLine: os.EOL,
        transformComment: function(file, line, text, kind, ref) {
            //jshint unused:false
            return [`file: ${file}`, `line: ${line}`, `text: ${text}`, `ref:${ref}`];
        },
        transformHeader: function(kind) {
            return [`kind: ${kind}`];
        },
    });
    if (typeof config.transformHeader !== 'function') {
        throw new TypeError('transformHeader must be a function');
    }
    if (typeof config.transformComment !== 'function') {
        throw new TypeError('transformComment must be a function');
    }
    // padding must be a minimum of 0
    // enforce padding to be a number as well
    config.padding = Math.max(0, parseInt(config.padding, 10));
    return config;
}

module.exports = function(todos, _config) {
    const config = parseConfig(_config);
    const output = getTransformedComments(todos, config);
    return joinBlocksByHeaders(output, config);
};

module.exports.joinBlocksByHeaders = joinBlocksByHeaders;
module.exports.getTransformedComments = getTransformedComments;
