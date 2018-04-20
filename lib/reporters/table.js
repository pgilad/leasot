const chalk = require('chalk');
const eol = require('eol');
const logSymbols = require('log-symbols');
const os = require('os');
const stripAnsi = require('strip-ansi');
const table = require('text-table');

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
    let prevfile;
    let t = table(
        todos.map(
            function(el, i) {
                let text = chalk.cyan(el.text);
                if (el.ref) {
                    text = chalk.gray('@' + el.ref) + ' ' + text;
                }
                const line = ['', chalk.gray('line ' + el.line), chalk.green(el.kind), text];
                if (el.file !== prevfile) {
                    headers[i] = el.file;
                }
                prevfile = el.file;
                return line;
            },
            {
                stringLength: function(str) {
                    return stripAnsi(str).length;
                },
            }
        )
    );

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

module.exports = function(todos) {
    let contents = '';
    contents += outputTable(todos);
    contents += outputFooter(todos);
    return contents;
};
