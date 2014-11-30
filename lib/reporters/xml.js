var json2xml = require('json2xml');

module.exports = function (todos, config) {
    //jshint camelcase:false
    var str = json2xml(todos, {
        header: typeof config.header === 'undefined' ? true : config.header,
        attributes_key: config.attributes_key
    });
    return str;
};
