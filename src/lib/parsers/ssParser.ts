import { getRegex, prepareComment } from '../utils';
import { ParserFactory, TodoComment } from '../../definitions';
import { split } from 'eol';

const parserFactory: ParserFactory = ({ customTags }) => {
    const regex = getRegex(customTags);
    const ssCommentRegex = new RegExp('<%--' + regex + '--%>', 'mig');
    const htmlCommentRegex = new RegExp('<!--' + regex + '-->', 'mig');

    return function parse(contents, file) {
        const comments: TodoComment[] = [];

        split(contents).forEach(function(line, index) {
            let ssCommentsMatch = ssCommentRegex.exec(line);
            while (ssCommentsMatch) {
                const comment = prepareComment(ssCommentsMatch, index + 1, file);
                if (!comment) {
                    return;
                }
                comments.push(comment);
                ssCommentsMatch = ssCommentRegex.exec(line);
            }

            let htmlCommentMatch = htmlCommentRegex.exec(line);
            while (htmlCommentMatch) {
                const comment = prepareComment(htmlCommentMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                htmlCommentMatch = htmlCommentRegex.exec(line);
            }
        });
        return comments;
    };
};

export default parserFactory;
