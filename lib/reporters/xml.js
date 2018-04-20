const json2xml = require('json2xml');

module.exports = function(todos, config) {
    //jshint camelcase:false
    return json2xml(todos, {
        header: typeof config.header === 'undefined' ? true : config.header,
        attributes_key: config.attributes_key,
    });
};
