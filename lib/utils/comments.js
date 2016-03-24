var DEFAULT_TAGS = ['todo', 'fixme'];

function getRegex(customTags) {
    var tags = DEFAULT_TAGS;
    if (customTags && customTags.length) {
        tags = tags.concat(customTags);
    }

    return '\\s*@?(' + tags.join('|') + ')\\s*(?:\\(([^)]*)\\))?\\s*:?\\s*(.*?)\\s*\\s*(?:/(.*)\\s*)?';
}

function prepareComment(match, line, file) {
    // match = [<entire_match>, required <kind>, <reference>, <text>, <reference>]
    if (!match || !match[1]) {
        return null;
    }
    var ref = match[2] || match[4] || '';
    var text = match[3] || '';
    return {
        file: file || 'unknown file',
        kind: match[1].toUpperCase(),
        line: line,
        text: text.trim(),
        ref:  ref.trim()
    };
}

exports.getRegex = getRegex;
exports.prepareComment = prepareComment;
