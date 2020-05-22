import { getRegex } from '../utils';
import { ParserFactory } from '../../definitions';
import { extractSingleLineComments, extractSingleLineFromBlocks } from '../utils/comments';

const multiLineCommentRegex = /\(\*(?:[\s\S]*?)\*\)/gim;

const parserFactory: ParserFactory = ({ customTags }) => {
    const regex = getRegex(customTags);
    const lineCommentRegex = new RegExp(`^\\s*\\/\\/${regex}$`, 'ig');
    const innerBlockRegex = new RegExp(`^${regex}$`, 'ig');

    return (contents, file) => {
        const singleLineComments = extractSingleLineComments(contents, file, lineCommentRegex);
        const singleLineMultiBlockComments = extractSingleLineFromBlocks(
            contents,
            file,
            multiLineCommentRegex,
            innerBlockRegex
        );

        return singleLineComments.concat(singleLineMultiBlockComments);
    };
};

export default parserFactory;
