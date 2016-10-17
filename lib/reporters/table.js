var chalk = require('chalk');
var logSymbols = require('log-symbols');
var table = require('text-table');

function outputFooter(todos) {
    var total = todos.length;
    if (!total) {
        return '\n ' + logSymbols.success + ' No todos/fixmes found';
    }
    var msg = total + ' todo' + (total === 1 ? '' : 's');
    msg += '/fixme' + (total === 1 ? '' : 's') + ' found';
    return '\n ' + (total ? logSymbols.error : logSymbols.success) + ' ' + msg;
}

function outputTable(todos) {
    var contents = '';
    var headers = [];
    var prevfile;
    var t = table(todos.map(function (el, i) {
        var text = chalk.cyan(el.text);
        if (el.ref) {
            text = chalk.gray('@' + el.ref) + ' ' + text;
        }
        var line = ['',
            chalk.gray('line ' + el.line),
            chalk.green(el.kind),
            text
        ];
        if (el.file !== prevfile) {
            headers[i] = el.file;
        }
        prevfile = el.file;
        return line;
    }, {
        stringLength: function (str) {
            return chalk.stripColor(str).length;
        }
    }));

    //set filename headers
    t = t.split('\n').map(function (el, i) {
        return headers[i] ? '\n' + chalk.underline(headers[i]) + '\n' + el : el;
    }).join('\n');
    contents += t + '\n';
    return contents;
}

module.exports = function (todos) {
    var contents = '';
    contents += outputTable(todos);
    contents += outputFooter(todos);
    return contents;
};
