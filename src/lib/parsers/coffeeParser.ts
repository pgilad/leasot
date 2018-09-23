import { split } from 'eol';
import { getRegex, prepareComment } from '../utils';
import { ParserFactory, TodoComment } from '../../definitions';

const parserFactory: ParserFactory = ({ customTags }) => {
    const regex = getRegex(customTags);
    const commentsRegex = new RegExp('^\\s*#' + regex + '$', 'mig');

    return function parse(contents, file) {
        const comments: TodoComment[] = [];

        split(contents).forEach(function(line, index) {
            const match = commentsRegex.exec(line);
            const comment = prepareComment(match, index + 1, file);
            if (!comment) {
                return;
            }
            comments.push(comment);
        });
        return comments;
    };
};

export default parserFactory;
