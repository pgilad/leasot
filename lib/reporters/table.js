var table = require('text-table');
var chalk = require('chalk');
var logSymbols = require('log-symbols');

function outputFooter(todos) {
    var total = todos.length;
    var msg = total + ' problem' + (total === 1 ? '' : 's');
    return '\n ' + logSymbols.error + ' ' + msg;
}

function outputTable(todos) {
    var contents = '';
    var headers = [];
    var prevfile;
    var t = table(todos.map(function (el, i) {
        var line = ['',
            chalk.gray('line ' + el.line),
            chalk.green(el.kind),
            chalk.cyan(el.text)
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
