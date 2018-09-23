import { getTransformedComments, joinBlocksByHeaders, prepareConfig } from './custom';
import { ReportItems, ReporterConfig, TodoComment } from '../../definitions';

const reporterConfig: ReporterConfig = {
    transformComment(file, line, text, _tag, ref) {
        if (ref) {
            text = `@${ref} ${text}`;
        }
        return [`| [${file}](${file}#L${line}) | ${line} | ${text}`];
    },
    transformHeader(tag) {
        return [`### ${tag}s`, `| Filename | line # | ${tag}`, '|:------|:------:|:------'];
    },
};

export const reporter: ReportItems = (todos: TodoComment[], config?: ReporterConfig): string => {
    const parsedConfig = prepareConfig(reporterConfig, config);
    const output = getTransformedComments(todos, parsedConfig);
    return joinBlocksByHeaders(output, parsedConfig);
};
