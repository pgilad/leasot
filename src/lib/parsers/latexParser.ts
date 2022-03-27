import { getRegex, prepareComment } from '../utils/index.js';
import { ParserFactory, TodoComment } from '../../definitions.js';
import eol from 'eol';

// I know this is different style, but I wasn't able to get the escape
// characters right

const parserFactory: ParserFactory = ({ customTags }) => {
    const regex = getRegex(customTags);
    const commentsRegex = new RegExp(`^\\s*%${regex}$`, 'mig');

    return (contents, file) => {
        const comments: TodoComment[] = [];

        eol.split(contents).forEach((line, index) => {
            let hashMatch = commentsRegex.exec(line);
            while (hashMatch) {
                const comment = prepareComment(hashMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                hashMatch = commentsRegex.exec(line);
            }
            commentsRegex.lastIndex = 0;
        });
        // doing the multi line match outside of the loop because we need
        // multiple lines
        const multilineRegex = new RegExp(
            '^[ |\\t]*\\\\begin{comment}\\s*@?(todo|fixme)(?!\\w)\\s*(?:\\(([^)]*)\\))?\\s*:?\\s*((.*?)(?:\\s+([^\\s]+)\\s*)?)\\\\end{comment}',
            'gmi'
        );
        let m;
        while ((m = multilineRegex.exec(contents)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === multilineRegex.lastIndex) {
                multilineRegex.lastIndex++;
            }

            // Since we no longer know the line number as index, we have to
            // count it out. This could be inefficient for large files, so I
            // hope it doesn't become a performance problem
            const preceeding_lines = contents.slice(0, m.index);
            const line_no = preceeding_lines.split(/\r\n|\r|\n/).length;
            // Now prepare the comment
            const comment = prepareComment(m, line_no, file);
            comments.push(comment);
        }
        return comments;
    };
};

export default parserFactory;
