/**
 * Return a JSON valid representation of the todos.
 * @module json-reporter
 */

/**
 * @alias module:json-reporter
 * @param {Object[]} todos - The parsed todos
 * @param {Object} [config] - Config passed to this reporter
 * @param {number} [config.spacing=2] - The amount of spacing for the json output
 * @returns {string}
 */
const reporter = (todos, { spacing = 2 } = {}) => JSON.stringify(todos, null, spacing);

module.exports = reporter;
