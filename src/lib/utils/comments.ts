import { DefaultTags, Tag, TodoComment } from '../../definitions';

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
