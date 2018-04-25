const json2xml = require('json2xml');

/**
 * Return an unformatted XML valid representation of the todos.
 * @module xml-reporter
 */

/**
 * @alias module:xml-reporter
 * @param {Object[]} todos - The parsed todos
 * @param {Object} [config] - the configuration object
 * @param {boolean} [config.header=true] - Whether to include xml header
 * @param {boolean} [config.attributes_key] - See https://github.com/estheban/node-json2xml#options--behaviour
 * @returns {string}
 */
const reporter = (todos, { attributes_key, header = true } = {}) => {
    return json2xml(todos, {
        header: header,
        attributes_key: attributes_key,
    });
};

module.exports = reporter;
