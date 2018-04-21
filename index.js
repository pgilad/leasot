const parsers = require('./lib/parsers');
const reporters = require('./lib/reporters');
const utils = require('./lib/utils');

// expose API
exports.associateExtWithParser = parsers.associateExtWithParser;
exports.isExtSupported = parsers.isExtSupported;
exports.parse = parsers.parse;
exports.reporter = reporters.reporter;
exports.utils = utils;
