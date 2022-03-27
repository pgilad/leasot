import { getRegex } from '../utils/index.js';
import { ParserFactory } from '../../definitions.js';
import { extractSingleLineComments } from '../utils/comments.js';

const parserFactory: ParserFactory = ({ customTags }) => {
    const regex = getRegex(customTags);
    const lineCommentRegex = new RegExp(`^\\s*;+${regex}$`, 'ig');

    return (contents, file) => {
        return extractSingleLineComments(contents, file, lineCommentRegex);
    };
};

export default parserFactory;
