import { BuiltinReporters, ReportItems, ReporterConfig, ReporterName, TodoComment } from '../definitions';
import { join } from 'path';

/**
 * Load the given reporter
 */
export const loadReporter = (reporter: ReporterName | ReportItems): ReportItems | void => {
    if (typeof reporter === 'function') {
        return reporter;
    }

    if (typeof reporter !== 'string') {
        return;
    }

    if (reporter in BuiltinReporters) {
        const reporterPath = join(__dirname, './reporters', reporter);
        const reporterFac = require(reporterPath).reporter;
        return loadReporter(reporterFac);
    }

    try {
        // external reporter
        return loadReporter(require(reporter).reporter);
    } catch (err) {
        // eslint-disable-next-line no-empty
    }
};

/**
 * Report the provided items
 * @param items The items to report
 * @param reporter The reporter to use
 * @param config Reporter configuration
 */
export const report = (
    items: TodoComment[],
    reporter: BuiltinReporters | ReporterName | ReportItems = BuiltinReporters.raw,
    config: ReporterConfig = {}
): any => {
    const reporterFn = loadReporter(reporter);

    if (typeof reporterFn !== 'function') {
        throw new Error(`Cannot find or load reporter: ${reporter}`);
    }
    if (!Array.isArray(items)) {
        throw new TypeError('Todos must be an array');
    }

    return reporterFn(items, config);
};
