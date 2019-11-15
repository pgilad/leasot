import { split } from 'eol';
import { getRegex, prepareComment } from '../utils';
import { ParserFactory } from '../../definitions';

const parserFactory: ParserFactory = ({ customTags }) => {
    const regex = getRegex(customTags);
    const commentsRegex = new RegExp('^\\s*#' + regex + '$', 'mig');

    return (contents, file) => {
        return split(contents)
            .map((line, index) => {
                const match = commentsRegex.exec(line);
                commentsRegex.lastIndex = 0;

                const comment = prepareComment(match, index + 1, file);
                if (!comment) {
                    return null;
                }
                return comment;
            })
            .filter(Boolean);
    };
};

export default parserFactory;
