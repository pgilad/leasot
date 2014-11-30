var parsers = require('./lib/parsers');
var reporters = require('./lib/reporters');

// expose API
exports.isExtSupported = parsers.isExtSupported;
exports.parse = parsers.parse;
exports.reporter = reporters.reporter;
