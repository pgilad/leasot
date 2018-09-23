'use strict';
exports.__esModule = true;
var BuiltinReporters;
(function(BuiltinReporters) {
    /**
     * @hidden
     */
    BuiltinReporters['custom'] = 'custom';
    /**
     * Return a json string of the todos
     */
    BuiltinReporters['json'] = 'json';
    /**
     *  Return a Markdown string of the todos
     */
    BuiltinReporters['markdown'] = 'markdown';
    /**
     * A raw reporter is the identity function for the todos
     */
    BuiltinReporters['raw'] = 'raw';
    /**
     * Return a table representation of the todos. Useful for CLI
     */
    BuiltinReporters['table'] = 'table';
    /**
     * Returns a markdown version of the todos customized for Visual Studio Code. The file names are
     * transformed as URLs and the line numbers as anchors which makes them clickable when the markdown
     * content produced with this reporter is opened on Visual Studio Code.
     */
    BuiltinReporters['vscode'] = 'vscode';
    /**
     * Return an XML string of the todos
     */
    BuiltinReporters['xml'] = 'xml';
})(BuiltinReporters = exports.BuiltinReporters || (exports.BuiltinReporters = {}));
