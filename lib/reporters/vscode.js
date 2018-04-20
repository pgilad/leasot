const os = require('os');

const defaults = require('lodash/defaults');

const customReporter = require('./custom');

function parseConfig(_config) {
    const config = defaults(_config || {}, {
        padding: 2,
        newLine: os.EOL,
        transformComment: function(file, line, text, kind, ref) {
            //jshint unused:false
            if (ref) {
                text = `@${ref} ${text}`;
            }
            return [`| [${file}](${file}#L${line}) | ${line} | ${text}`];
        },
        transformHeader: function(kind) {
            return [`### ${kind}s`, `| Filename | line # | ${kind}`, '|:------|:------:|:------'];
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
    const output = customReporter.getTransformedComments(todos, config);
    return customReporter.joinBlocksByHeaders(output, config);
};
