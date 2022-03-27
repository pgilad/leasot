import { ReportItems, TodoComment } from '../../definitions.js';

export interface JsonReporterConfig {
    spacing?: number;
}

export const reporter: ReportItems = (todos: TodoComment[], config: JsonReporterConfig = { spacing: 2 }): string =>
    JSON.stringify(todos, null, config.spacing);
