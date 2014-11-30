module.exports = function (todos, config) {
    return JSON.stringify(todos, null, config.spacing || 2);
};
