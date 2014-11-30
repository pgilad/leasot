'use strict';
var path = require('path');

function loadReporter(reporter) {
    if (typeof reporter === 'function') {
        return reporter;
    }

    if (typeof reporter !== 'string') {
        return;
    }

    var rpt = path.join(__dirname, './reporters', reporter);
    try {
        // own library reporter
        return loadReporter(require(rpt));
    } catch (err) {}
    try {
        // external lib reporter
        return loadReporter(require(reporter));
    } catch (err) {}
}

function useReporter(comments, config) {
    config = config || {};
    var reporter = config.reporter || 'raw';
    var reporterFn = loadReporter(reporter);
    if (typeof reporterFn !== 'function') {
        throw new Error('Cannot find reporter: ' + reporter);
    }

    delete config.reporter;
    return reporterFn(comments, config);
}

exports.loadReporter = loadReporter;
exports.reporter = useReporter;
