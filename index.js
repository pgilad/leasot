var parsers = require('./lib/parsers');
var reporters = require('./lib/reporters');
var utils = require('./lib/utils');

// expose API
exports.associateExtWithParser = parsers.associateExtWithParser;
exports.isExtSupported = parsers.isExtSupported;
exports.parse = parsers.parse;
exports.parseLegacy = parsers.parseLegacy;
exports.reporter = reporters.reporter;
exports.utils = utils;
