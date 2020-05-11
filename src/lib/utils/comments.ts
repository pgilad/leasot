import { DefaultTags, Tag, TodoComment } from '../../definitions';
import { split } from 'eol';
import { getLineFromPos } from './index';

const DEFAULT_TAGS: string[] = [DefaultTags.todo, DefaultTags.fixme];

export const getRegex = (customTags: Tag[] = []): string => {
    const tags = DEFAULT_TAGS.concat(customTags);

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
        // Optional leading reference in parenthesis.
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
        '(?:\\s+/([^\\s]+)\\s*)?'
    );
};

export const prepareComment = (match: string[], line: number, filename: string = 'unknown'): TodoComment => {
    // match = [<entire_match>, required <tag>, <reference>, <text>, <reference>]
    if (!match || !match[1]) {
        return null;
    }
    const ref = match[2] || match[4] || '';
    const text = match[3] || '';
    return {
        file: filename,
        tag: match[1].toUpperCase(),
        line: line,
        ref: ref.trim(),
        text: text.trim(),
    };
};

export const extractSingleLineComments = (contents: string, file: string, lineCommentRegex: RegExp): TodoComment[] => {
    const comments: TodoComment[] = [];

    split(contents).forEach((line, index) => {
        let match = lineCommentRegex.exec(line);
        while (match && match.length > 0) {
            const comment = prepareComment(match, index + 1, file);
            if (!comment) {
                break;
            }
            comments.push(comment);
            match = lineCommentRegex.exec(line);
        }
    });

    return comments.filter(Boolean);
};

export const extractSingleLineFromBlocks = (
    contents: string,
    file: string,
    multiLineCommentRegex: RegExp,
    innerBlockRegex: RegExp
): TodoComment[] => {
    const comments: TodoComment[] = [];

    let match = multiLineCommentRegex.exec(contents);
    while (match && match.length > 0) {
        // use entire match as basis to look into todos/fixmes
        const baseMatch = match[0];

        split(baseMatch).forEach((line, index) => {
            let subMatch = innerBlockRegex.exec(line);
            while (subMatch) {
                const adjustedLine = getLineFromPos(contents, match.index) + index;
                const comment = prepareComment(subMatch, adjustedLine, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                subMatch = innerBlockRegex.exec(line);
            }
        });

        match = multiLineCommentRegex.exec(contents);
    }

    return comments.filter(Boolean);
};
