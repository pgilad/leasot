const parsers = require('./lib/parsers');
const reporters = require('./lib/reporters');

// expose API
exports.associateExtWithParser = parsers.associateExtWithParser;
exports.isExtSupported = parsers.isExtSupported;
exports.parse = parsers.parse;
exports.reporter = reporters.reporter;
