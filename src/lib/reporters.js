"use strict";
exports.__esModule = true;
var definitions_1 = require("../definitions");
var path_1 = require("path");
/**
 * Load the given reporter
 */
exports.loadReporter = function (reporter) {
    if (typeof reporter === 'function') {
        return reporter;
    }
    if (typeof reporter !== 'string') {
        return;
    }
    if (reporter in definitions_1.BuiltinReporters) {
        var reporterPath = path_1.join(__dirname, './reporters', reporter);
        var reporterFac = require(reporterPath).reporter;
        return exports.loadReporter(reporterFac);
    }
    try {
        // external reporter
        return exports.loadReporter(require(reporter).reporter);
    }
    catch (err) {
        // eslint-disable-next-line no-empty
    }
};
/**
 * Report the provided items
 * @param items The items to report
 * @param reporter The reporter to use
 * @param config Reporter configuration
 */
exports.report = function (items, reporter, config) {
    if (reporter === void 0) { reporter = definitions_1.BuiltinReporters.raw; }
    if (config === void 0) { config = {}; }
    var reporterFn = exports.loadReporter(reporter);
    if (typeof reporterFn !== 'function') {
        throw new Error("Cannot find or load reporter: " + reporter);
    }
    if (!Array.isArray(items)) {
        throw new TypeError('Todos must be an array');
    }
    return reporterFn(items, config);
};
