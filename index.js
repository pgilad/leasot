var parsers = require('./lib/parsers');
var reporters = require('./lib/reporters');

// expose API
exports.associateExtWithParser = parsers.associateExtWithParser;
exports.isExtSupported = parsers.isExtSupported;
exports.parse = parsers.parse;
exports.parseLegacy = parsers.parseLegacy;
exports.reporter = reporters.reporter;
