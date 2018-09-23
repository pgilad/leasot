'use strict';
exports.__esModule = true;
var DEFAULT_TAGS = ['todo' /* todo */, 'fixme' /* fixme */];
exports.getRegex = function(customTags) {
    if (customTags === void 0) {
        customTags = [];
    }
    var tags = DEFAULT_TAGS.concat(customTags);
    return (
        // Optional space.
        '\\s*' +
        // Optional `@`.
        '@?' +
        // One of the keywords such as `TODO` and `FIXME`.
        '(' +
        tags.join('|') +
        ')' +
        // tag cannot be followed by an alpha-numeric character (strict tag match)
        '(?!\\w)' +
        // Optional space.
        '\\s*' +
        // Optional leading reference in parens.
        '(?:\\(([^)]*)\\))?' +
        // Optional space.
        '\\s*' +
        // Optional colon `:`.
        ':?' +
        // Optional space.
        '\\s*' +
        // Comment text.
        '(.*?)' +
        // Optional trailing reference after a space and a slash, followed by an optional space.
        '(?:\\s+/([^\\s]+)\\s*)?');
};
exports.prepareComment = function(match, line, filename) {
    if (filename === void 0) {
        filename = 'unknown';
    }
    // match = [<entire_match>, required <tag>, <reference>, <text>, <reference>]
    if (!match || !match[1]) {
        return null;
    }
    var ref = match[2] || match[4] || '';
    var text = match[3] || '';
    return {
        file: filename,
        tag: match[1].toUpperCase(),
        line: line,
        ref: ref.trim(),
        text: text.trim(),
    };
};
