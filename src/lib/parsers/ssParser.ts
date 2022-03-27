import { getRegex, prepareComment } from '../utils/index.js';
import { ParserFactory, TodoComment } from '../../definitions.js';
import eol from 'eol';

const parserFactory: ParserFactory = ({ customTags }) => {
    const regex = getRegex(customTags);
    const ssCommentRegex = new RegExp('<%--' + regex + '--%>', 'mig');
    const htmlCommentRegex = new RegExp('<!--' + regex + '-->', 'mig');

    return (contents, file) => {
        const comments: TodoComment[] = [];

        eol.split(contents).forEach((line, index) => {
            let ssCommentsMatch = ssCommentRegex.exec(line);
            while (ssCommentsMatch) {
                const comment = prepareComment(ssCommentsMatch, index + 1, file);
                if (!comment) {
                    return;
                }
                comments.push(comment);
                ssCommentsMatch = ssCommentRegex.exec(line);
            }
            ssCommentRegex.lastIndex = 0;

            let htmlCommentMatch = htmlCommentRegex.exec(line);
            while (htmlCommentMatch) {
                const comment = prepareComment(htmlCommentMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                htmlCommentMatch = htmlCommentRegex.exec(line);
            }
            htmlCommentRegex.lastIndex = 0;
        });
        return comments;
    };
};

export default parserFactory;
