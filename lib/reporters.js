const path = require('path');

function loadReporter(reporter) {
    if (typeof reporter === 'function') {
        return reporter;
    }

    if (typeof reporter !== 'string') {
        return;
    }

    const rpt = path.join(__dirname, './reporters', reporter);
    try {
        // own library reporter
        return loadReporter(require(rpt));
    } catch (err) {
        // eslint-disable-next-line no-empty
    }
    try {
        // external lib reporter
        return loadReporter(require(reporter));
    } catch (err) {
        // eslint-disable-next-line no-empty
    }
}

function useReporter(comments, config = {}) {
    const reporter = config.reporter || 'raw';
    const reporterFn = loadReporter(reporter);

    if (typeof reporterFn !== 'function') {
        throw new Error(`Cannot find reporter: ${reporter}`);
    }
    if (!Array.isArray(comments)) {
        throw new TypeError('Todos must be an array');
    }

    delete config.reporter;
    return reporterFn(comments, config);
}

exports.loadReporter = loadReporter;
exports.reporter = useReporter;
