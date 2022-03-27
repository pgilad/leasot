import { getRegex } from '../utils/index.js';
import { ParserFactory } from '../../definitions.js';
import { extractSingleLineComments, extractSingleLineFromBlocks } from '../utils/comments.js';

const multiLineCommentRegex = /\/\*(?:[\s\S]*?)\*\//gim;

const parserFactory: ParserFactory = ({ customTags }) => {
    const regex = getRegex(customTags);
    const lineCommentRegex = new RegExp(`^\\s*\\/\\/${regex}$`, 'ig');
    const innerBlockRegex = new RegExp(`^\\s*(?:\\/\\*)?\\**!?${regex}(?:\\**\\/)?$`, 'ig');

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
