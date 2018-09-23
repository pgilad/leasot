import { getRegex, prepareComment } from '../utils';
import { ParserFactory, TodoComment } from '../../definitions';
import { split } from 'eol';

const parserFactory: ParserFactory = ({ customTags }) => {
    const regex = getRegex(customTags);
    const hamlRubyComment = new RegExp('^\\s*-#' + regex + '$', 'mig');
    const hamlHtmlComment = new RegExp('^\\s*/' + regex + '$', 'mig');
    const erbComment = new RegExp('<%#' + regex + '%>', 'mig');
    const htmlComment = new RegExp('<!--' + regex + '-->', 'mig');

    return function parse(contents, file) {
        const comments: TodoComment[] = [];

        split(contents).forEach(function(line, index) {
            let hamlRubyCommentMatch = hamlRubyComment.exec(line);
            let hamlHtmlCommentMatch = hamlHtmlComment.exec(line);
            let erbCommentMatch = erbComment.exec(line);
            let htmlCommentMatch = htmlComment.exec(line);

            while (hamlRubyCommentMatch) {
                const comment = prepareComment(hamlRubyCommentMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                hamlRubyCommentMatch = hamlRubyComment.exec(line);
            }

            while (hamlHtmlCommentMatch) {
                const comment = prepareComment(hamlHtmlCommentMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);

                hamlHtmlCommentMatch = hamlHtmlComment.exec(line);
            }

            while (erbCommentMatch) {
                const comment = prepareComment(erbCommentMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                erbCommentMatch = erbComment.exec(line);
            }

            while (htmlCommentMatch) {
                const comment = prepareComment(htmlCommentMatch, index + 1, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                htmlCommentMatch = htmlComment.exec(line);
            }
        });
        return comments;
    };
};

export default parserFactory;
