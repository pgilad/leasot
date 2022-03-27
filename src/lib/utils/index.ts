import eol from 'eol';

export { prepareComment, getRegex } from './comments.js';

// Bases on get-line-from-pos to support Windows as well
// See https://github.com/pgilad/get-line-from-pos/blob/master/index.js
export const getLineFromPos = (str: string, pos: number) => {
    if (pos === 0) {
        return 1;
    }
    //adjust for negative pos
    if (pos < 0) {
        pos = str.length + pos;
    }
    const lines = eol.split(str.substr(0, pos));
    return lines.length;
};
