import { getRegex, prepareComment } from '../utils/index.js';
import { ParserFactory, TodoComment } from '../../definitions.js';
import eol from 'eol';

const parserFactory: ParserFactory = ({ customTags }) => {
    const regex = getRegex(customTags);
    const commentsRegex = new RegExp(`^\\s*#${regex}$`, 'mig');
    const multiLineRegex = new RegExp(`^\\s*"""${regex}"""$`, 'mig');

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

            let multiLineMatch = multiLineRegex.exec(line);
            while (multiLineMatch) {
                const comment = prepareComment(multiLineMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                multiLineMatch = multiLineRegex.exec(line);
            }
            multiLineRegex.lastIndex = 0;
        });
        return comments;
    };
};

export default parserFactory;
