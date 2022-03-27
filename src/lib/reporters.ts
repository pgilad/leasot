import { BuiltinReporters, ReporterConfig, ReporterName, ReportItems, TodoComment } from '../definitions.js';

/**
 * Load the given reporter
 */
export const loadReporter = async (reporter: ReporterName | ReportItems): Promise<ReportItems | void> => {
    if (typeof reporter === 'function') {
        return reporter;
    }

    if (typeof reporter !== 'string') {
        return;
    }

    if (reporter in BuiltinReporters) {
        const { reporter: reporterFunc } = await import(`./reporters/${reporter}.js`);
        return await loadReporter(reporterFunc);
    }

    try {
        // external reporter
        const { reporter: reporterFunc } = await import(reporter);
        return await loadReporter(reporterFunc);
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
export const report = async (
    items: TodoComment[],
    reporter: BuiltinReporters | ReporterName | ReportItems = BuiltinReporters.raw,
    config: ReporterConfig = {}
): Promise<any> => {
    const reporterFn = await loadReporter(reporter);

    if (typeof reporterFn !== 'function') {
        throw new Error(`Cannot find or load reporter: ${reporter}`);
    }
    if (!Array.isArray(items)) {
        throw new TypeError('Todos must be an array');
    }

    return reporterFn(items, config);
};
