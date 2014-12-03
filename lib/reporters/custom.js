var os = require('os');
var compact = require('lodash.compact');
var defaults = require('lodash.defaults');

function getTransformedComments(todos, config) {
    var transformFn = config.transformComment;
    if (!todos.length) {
        //early return in case of no comments
        //FIXME: make the default header a configurable option
        return {
            TODO: []
        };
    }
    var output = todos.reduce(function (mem, comment) {
        var kind = comment.kind;
        mem[kind] = mem[kind] || [];
        // transformed comment as an array item
        var transformedComment = transformFn(comment.file, comment.line, comment.text, kind);
        // enforce array type
        if (!Array.isArray(transformedComment)) {
            transformedComment = [transformedComment];
        }
        // append to kind array
        mem[kind] = mem[kind].concat(transformedComment);
        return mem;
    }, {});
    return output;
}

function joinBlocksByHeaders(output, config) {
    var padding = config.padding;
    var newLine = config.newLine;
    var transformHeader = config.transformHeader;
    var header;
    var contents = '';
    //prepend headers
    Object.keys(output).forEach(function (kind) {
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
    var config = defaults(_config || {}, {
        padding: 2,
        newLine: os.EOL,
        transformComment: function (file, line, text, kind) {
            //jshint unused:false
            return ['file: ' + file, 'line: ' + line, 'text: ' + text];
        },
        transformHeader: function (kind) {
            return ['kind: ' + kind];
        }
    });
    if (typeof config.transformHeader !== 'function') {
        throw new Error('transformHeader must be a function');
    }
    if (typeof config.transformComment !== 'function') {
        throw new Error('transformComment must be a function');
    }
    // padding must be a minimum of 0
    // enforce padding to be a number as well
    config.padding = Math.max(0, parseInt(config.padding, 10));
    return config;
}

module.exports = function (todos, _config) {
    var config = parseConfig(_config);
    var output = getTransformedComments(todos, config);
    return joinBlocksByHeaders(output, config);
};

module.exports.joinBlocksByHeaders = joinBlocksByHeaders;
module.exports.getTransformedComments = getTransformedComments;
