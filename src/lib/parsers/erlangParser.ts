import { getRegex } from '../utils';
import { ParserFactory } from '../../definitions';
import { extractSingleLineComments } from '../utils/comments';

const parserFactory: ParserFactory = ({ customTags }) => {
    const regex = getRegex(customTags);
    const lineCommentRegex = new RegExp(`^\\s*%${regex}$`, 'mig');

    return (contents, file) => {
        return extractSingleLineComments(contents, file, lineCommentRegex);
    };
};

export default parserFactory;
