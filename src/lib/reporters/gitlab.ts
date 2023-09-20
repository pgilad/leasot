import crypto from 'crypto';

import { ReportItems, TodoComment } from '../../definitions.js';
import { JsonReporterConfig } from './json.js';

export const reporter: ReportItems = (todos: TodoComment[], config: JsonReporterConfig = { spacing: 2 }): string =>
    JSON.stringify(
        todos.map((todo: TodoComment) => {
            return {
                description: `${todo.tag} ${todo.text}`,
                check_name: 'leasot',
                fingerprint: crypto
                    .createHash('md5')
                    .update(`${todo.tag}${todo.text}${todo.file}${todo.line}`)
                    .digest('hex'),
                severity: 'info',
                location: {
                    path: todo.file,
                    lines: {
                        begin: todo.line,
                    },
                },
            };
        }),
        null,
        config.spacing
    );
