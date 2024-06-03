/**
 * The default registered tags
 */
export const enum DefaultTags {
    todo = 'todo',
    fixme = 'fixme',
}

/**
 * Sometimes referred to as kind, this is usually a TODO or FIXME but can be any custom string
 */
export type Tag = string;

export interface ExtensionConfig {
    /**
     * The associated parser name(s) used to parse this extension
     */
    parserName: string | string[];
    /**
     * A list of other filetypes (extensions) that might be included in this filetype (extension)
     */
    includedFiles?: string[];
}

/**
 * The supported extensions (filetypes) database
 */
export interface ExtensionsDb {
    [extension: string]: ExtensionConfig;
}

export interface ParseConfig {
    /**
     * Associate the filetypes with parsers. This allows adding support for new filetypes, or overriding the config for existing ones.
     *
     * ```js
     * {
     *      '.myExt1': { parserName: 'myCustomParser1' },
     *      '.myExt2': { parserName: 'myCustomParser2' },
     *      '.myExt3': { parserName: 'defaultParser' },
     * }
     * ```
     */
    associateParser?: ExtensionsDb;
    /**
     * Extend or override the parsers by parserName, for example override the defaultParser or add a new parser
     *
     * ```js
     * {
     *      myCustomParser1: function (parseOptions) {
     *          return function parse(contents, file) {
     *              const comments = [];
     *              // do something with contents
     *              comments.push({
     *                  file: file,
     *                  tag: 'TODO',
     *                  line: 42,
     *                  text: 'The comment text/body',
     *                  ref: ''
     *              });
     *              return comments;
     *          }
     *      },
     *      myCustomParser2: function (parseOptions) {
     *           // etc
     *      },
     * }
     * ```
     */
    customParsers?: CustomParsers;
    /**
     * Other tags to look for (besides todos and fixmes).
     * Tags are case-insensitive and are strict matching, i.e PROD tag will match PROD but not PRODUCTS
     */
    customTags?: Tag[];
    /**
     * The extension which identifies the filetype. Includes the dot if relevant (i.e: `.js`)
     */
    extension: string;
    /**
     * The filename from which the content was derived from. Useful for reporting purposes
     */
    filename?: string;
    /**
     * Whether to also parse known inline file associations (for example html in php files)
     */
    withInlineFiles?: boolean;
}

export interface ParserFactoryConfig {
    /**
     * A list of custom tags to support
     */
    customTags?: Tag[];
}

/**
 * A parsed TODO (or other tag) comment
 *
 * ```js
 * [{
 *   file: 'parsedFile.js',
 *   line: 8,
 *   ref: 'reference'
 *   tag: 'TODO',
 *   text: 'comment text',
 * }]
 * ```
 */
export interface TodoComment {
    /**
     * The filetype the comment originated from
     */
    file: string;
    /**
     * The comment tag (usually TODO)
     */
    tag: Tag;
    /**
     * Line number the comment was found in file
     */
    line: number;
    /**
     * A possible reference used (either as prefix or postfix)
     */
    ref: string;
    /**
     * The TODO (or other tag) text
     */
    text: string;
}

/**
 * receive the contents and file and return a list of parsed items
 */
export type Parser = (contents: string, file: string) => TodoComment[];

/**
 * A factory to return a parser
 */
export type ParserFactory = (config: ParserFactoryConfig) => Parser;

export interface CustomParsers {
    [parserName: string]: ParserFactory;
}

/**
 * Report the provided items
 */
export type ReportItems = (comments: TodoComment[], config: any) => any;
export type ReporterName = string;

export type TransformComment = (file: string, line: number, ref: string, tag: Tag, text: string) => string | string[];

export type TransformHeader = (tag: Tag) => string | string[];

export interface ReporterConfig {
    newLine?: string;
    padding?: number;
    transformComment?: TransformComment;
    transformHeader?: TransformHeader;
}

export interface TransformedComments {
    [tag: string]: string[];
}

export enum BuiltinReporters {
    /**
     * @hidden
     */
    custom = 'custom',
    /**
     * Return a Gitlab code quality formatted json string of the todos
     */
    gitlab = 'gitlab',
    /**
     * Return a json string of the todos
     */
    json = 'json',
    /**
     *  Return a Markdown string of the todos
     */
    markdown = 'markdown',
    /**
     * A raw reporter is the identity function for the todos
     */
    raw = 'raw',
    /**
     * Return a table representation of the todos. Useful for CLI
     */
    table = 'table',
    /**
     * Returns a markdown version of the todos customized for Visual Studio Code. The file names are
     * transformed as URLs and the line numbers as anchors which makes them clickable when the markdown
     * content produced with this reporter is opened on Visual Studio Code.
     */
    vscode = 'vscode',
    /**
     * Return an XML string of the todos
     */
    xml = 'xml',
}
