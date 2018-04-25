const chalk = require('chalk');
const eol = require('eol');
const logSymbols = require('log-symbols');
const os = require('os');
const stripAnsi = require('strip-ansi');
const table = require('text-table');

/**
 * Returns a pretty formatted table of the todos.
 * @module table-reporter
 */

function outputFooter(todos) {
    const total = todos.length;
    if (!total) {
        return os.EOL + ' ' + logSymbols.success + ' No todos/fixmes found';
    }
    let msg = total + ' todo' + (total === 1 ? '' : 's');
    msg += '/fixme' + (total === 1 ? '' : 's') + ' found';
    return os.EOL + ' ' + (total ? logSymbols.error : logSymbols.success) + ' ' + msg;
}

function outputTable(todos) {
    let contents = '';
    const headers = [];
    let previousFile;

    const mapTodo = (el, i) => {
        let text = chalk.cyan(el.text);
        if (el.ref) {
            text = chalk.gray('@' + el.ref) + ' ' + text;
        }
        const line = ['', chalk.gray('line ' + el.line), chalk.green(el.kind), text];
        if (el.file !== previousFile) {
            headers[i] = el.file;
        }
        previousFile = el.file;
        return line;
    };

    let t = table(todos.map(mapTodo), {
        stringLength: function(str) {
            return stripAnsi(str).length;
        },
    });

    //set filename headers
    t = eol
        .split(t)
        .map(function(el, i) {
            return headers[i] ? os.EOL + chalk.underline(headers[i]) + os.EOL + el : el;
        })
        .join(os.EOL);

    contents += t + os.EOL;
    return contents;
}

/**
 * @alias module:table-reporter
 * @param {Object[]} todos - The parsed todos
 * @returns {string}
 */
const reporter = todos => [outputTable(todos), outputFooter(todos)].join('');

module.exports = reporter;
