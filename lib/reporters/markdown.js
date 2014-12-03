'use strict';
var os = require('os');
var customReporter = require('./custom');
var defaults = require('lodash.defaults');

function parseConfig(_config) {
    var config = defaults(_config || {}, {
        padding: 2,
        newLine: os.EOL,
        transformComment: function (file, line, text, kind) {
            //jshint unused:false
            return ['| ' + file + ' | ' + line + ' | ' + text];
        },
        transformHeader: function (kind) {
            return ['### ' + kind + 's',
                '| Filename | line # | ' + kind,
                '|:------|:------:|:------'
            ];
        }
    });
    if (typeof config.transformHeader !== 'function') {
        throw new Error('transformHeader must be a function');
    }
    if (typeof config.transformComment !== 'function') {
        throw new Error('transformComment must be a function');
    }
    // padding must be a minimum of 0
    // enforce padding to be a number as well
    config.padding = Math.max(0, parseInt(config.padding, 10));
    return config;
}

module.exports = function (todos, _config) {
    var config = parseConfig(_config);
    var output = customReporter.getTransformedComments(todos, config);
    return customReporter.joinBlocksByHeaders(output, config);
};
