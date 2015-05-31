var DEFAULT_TAGS = ['todo', 'fixme'];

function getRegex(customTags) {
    var tags = DEFAULT_TAGS;
    if (customTags && customTags.length) {
        tags = tags.concat(customTags);
    }

    return '\\s*@?(' + tags.join('|') + ')\\s*:?\\s*(.*?)\\s*';
}

function prepareComment(match, line, file) {
    // match = [ <entire_match>, required <kind>, <text> ]
    if (!match || !match[1]) {
        return null;
    }
    var text = match[2] || '';
    return {
        file: file || 'unknown file',
        kind: match[1].toUpperCase(),
        line: line,
        text: text.trim(),
    };
}

exports.getRegex = getRegex;
exports.prepareComment = prepareComment;
