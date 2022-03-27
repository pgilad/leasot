import json2xml from 'json2xml';
import { ReportItems, TodoComment } from '../../definitions.js';

/**
 * See https://github.com/estheban/node-json2xml#options--behaviour
 */
export interface XMLReporterConfig {
    attributes_key?: string;
    header?: boolean;
}

export const reporter: ReportItems = (todos: TodoComment[], config: XMLReporterConfig = { header: true }): string => {
    return json2xml(todos, {
        header: config.header,
        attributes_key: config.attributes_key,
    });
};
