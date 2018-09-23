import { getRegex, prepareComment } from '../utils';
import { ParserFactory, TodoComment } from '../../definitions';
import { split } from 'eol';

const parserFactory: ParserFactory = ({ customTags }) => {
    const regex = getRegex(customTags);
    const commentsRegex = new RegExp('^\\s*%' + regex + '$', 'mig');

    return function parse(contents, file) {
        const comments: TodoComment[] = [];

        split(contents).forEach(function(line, index) {
            let hashMatch = commentsRegex.exec(line);
            while (hashMatch) {
                const comment = prepareComment(hashMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                hashMatch = commentsRegex.exec(line);
            }
        });
        return comments;
    };
};

export default parserFactory;
