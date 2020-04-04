import { getRegex, prepareComment } from '../utils';
import { ParserFactory, TodoComment } from '../../definitions';
import { split } from 'eol';

const parserFactory: ParserFactory = ({ customTags }) => {
    const regex = getRegex(customTags);
    const commentsRegex = new RegExp('{{!(?:--)?' + regex + '(?:--)?}}', 'mig');

    return (contents, file) => {
        const comments: TodoComment[] = [];

        split(contents).forEach(function (line, index) {
            let match = commentsRegex.exec(line);
            while (match) {
                const comment = prepareComment(match, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                match = commentsRegex.exec(line);
            }
            commentsRegex.lastIndex = 0;
        });
        return comments;
    };
};

export default parserFactory;
