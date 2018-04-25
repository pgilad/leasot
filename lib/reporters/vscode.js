const os = require('os');
const defaults = require('lodash/defaults');

const customReporter = require('./custom');

/**
 * Returns a markdown version of the todos customized for Visual Studio Code. The file names are
 transformed as URLs and the line numbers as anchors which makes them clickable when the markdown
 content produced with this reporter is opened on Visual Studio Code.
 * @module vscode-reporter
 */

/**
 * @default
 * @param {string} file - Filename being reported
 * @param {number} line - Line the comment appeared
 * @param {string} text - Text of comment
 * @param {string} kind - Kind of comment (todo/fixme)
 * @param {string} ref - The reference found in comment
 * @returns {string|string[]} If you return an array of strings they will be joined by newlines
 */
const transformComment = function(file, line, text, kind, ref) {
    if (ref) {
        text = `@${ref} ${text}`;
    }
    return [`| [${file}](${file}#L${line}) | ${line} | ${text}`];
};

/**
 * @default
 * @param {string} kind - The kind of todo/fixme
 * @returns {string|string[]} If you return an array of strings they will be joined by newlines
 */
const transformHeader = function(kind) {
    return [`### ${kind}s`, `| Filename | line # | ${kind}`, '|:------|:------:|:------'];
};

const defaultConfig = {
    padding: 2,
    newLine: os.EOL,
    transformComment: transformComment,
    transformHeader: transformHeader,
};

function parseConfig(_config = {}) {
    const config = defaults(_config, defaultConfig);
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

/**
 * @alias module:vscode-reporter
 * @param {Object[]} todos - The parsed todos
 * @param {Object} [config]
 * @param {number} [config.padding=2] - How many new lines should separate between comment type blocks.
 * @param {string} [config.newLine=os.EOL] - How to separate lines in the output file. Defaults to your OS's default line separator.
 * @param {function} [config.transformComment=transformComment] - Control the output for each comment.
 * @param {function} [config.transformHeader=transformHeader] - Control the output of a header for each comment kind (i.e todo, fixme).
 * @returns {string}
 */
const reporter = (todos, config) => {
    const parsedConfig = parseConfig(config);
    const output = customReporter.getTransformedComments(todos, parsedConfig);
    return customReporter.joinBlocksByHeaders(output, parsedConfig);
};

module.exports = reporter;
