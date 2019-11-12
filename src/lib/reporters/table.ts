import * as logSymbols from 'log-symbols';
import chalk = require('chalk');
import stripAnsi from 'strip-ansi';
import table from 'text-table';
import { EOL } from 'os';
import { ReportItems, TodoComment } from '../../definitions';
import { split } from 'eol';

function outputFooter(todos: TodoComment[]): string {
    const total = todos.length;
    if (!total) {
        return EOL + ' ' + logSymbols.success + ' No todos/fixmes found';
    }
    let msg = total + ' todo' + (total === 1 ? '' : 's');
    msg += '/fixme' + (total === 1 ? '' : 's') + ' found';
    return EOL + ' ' + (total ? logSymbols.error : logSymbols.success) + ' ' + msg;
}

function outputTable(todos: TodoComment[]): string {
    let contents = '';
    const headers: string[] = [];
    let previousFile: string;

    const mapTodo = (item: TodoComment, index: number) => {
        let text = chalk.cyan(item.text);
        if (item.ref) {
            text = chalk.gray('@' + item.ref) + ' ' + text;
        }
        const line = ['', chalk.gray('line ' + item.line), chalk.green(item.tag), text];
        if (item.file !== previousFile) {
            headers[index] = item.file;
        }
        previousFile = item.file;
        return line;
    };

    let t = table(todos.map(mapTodo), {
        stringLength(str: string) {
            return stripAnsi(str).length;
        },
    });

    //set filename headers
    t = split(t)
        .map(function(el: string, i: number) {
            return headers[i] ? EOL + chalk.underline(headers[i]) + EOL + el : el;
        })
        .join(EOL);

    contents += t + EOL;
    return contents;
}

/**
 * Report the items using a formatted table (Useful for CLI)
 */
export const reporter: ReportItems = (todos: TodoComment[]): string =>
    [outputTable(todos), outputFooter(todos)].join('');
