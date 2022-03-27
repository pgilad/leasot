import { getRegex, prepareComment } from '../utils/index.js';
import { ParserFactory, TodoComment } from '../../definitions.js';
import eol from 'eol';

const parserFactory: ParserFactory = ({ customTags }) => {
    const regex = getRegex(customTags);
    const bangComment = new RegExp(`<%#${regex}%>`, 'mig');
    const htmlComment = new RegExp(`<!--${regex}-->`, 'mig');

    return function parse(contents, file) {
        const comments: TodoComment[] = [];

        eol.split(contents).forEach(function (line, index) {
            let bangCommentMatch = bangComment.exec(line);
            while (bangCommentMatch) {
                const comment = prepareComment(bangCommentMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                bangCommentMatch = bangComment.exec(line);
            }
            bangComment.lastIndex = 0;

            let htmlCommentMatch = htmlComment.exec(line);
            while (htmlCommentMatch) {
                const comment = prepareComment(htmlCommentMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                htmlCommentMatch = htmlComment.exec(line);
            }
            htmlComment.lastIndex = 0;
        });
        return comments;
    };
};

export default parserFactory;
