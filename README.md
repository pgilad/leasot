![leasot](media/leasot.png)

> Parse and output TODOs and FIXMEs from comments in your files

[![NPM Version](http://img.shields.io/npm/v/leasot.svg?style=flat)](https://npmjs.org/package/leasot)
[![NPM Downloads](http://img.shields.io/npm/dm/leasot.svg?style=flat)](https://npmjs.org/package/leasot)
[![Build Status](http://img.shields.io/travis/pgilad/leasot.svg?style=flat)](https://travis-ci.org/pgilad/leasot)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Easily extract, collect and report TODOs and FIXMEs in your code. This project uses regex in order
to extract your todos from comments.

![Basic output example of leasot](media/table.png)

## Comment format

`TODO: add some info`

- Spaces are optional.
- Colon is optional.
- Must be in a comment (line or block) in its' own line (`some code(); //TODO: do something` is not supported).
- Can be prefixed with a @ (i.e @TODO).
- Spaces are trimmed around comment text.
- Supported default types are `TODO` and `FIXME` - case insensitive.
- Additional types can be added (using `tags` in cli and `customTags` in `leasot.parse`)
- New extensions can be associated with bundled parsers as many languages have overlapping syntax
- Supports both leading and trailing references. E.g. `// TODO(tregusti): Make this better` or `// TODO: Text /tregusti`

## Supported languages:

| Filetype      | Extension            | Notes                                      | Parser Name         |
| ------------  | -------------------- | -------------------------------------------| ------------------- |
| C#            | `.cs`                | Supports `// and /* */` comments.          | defaultParser       |
| C++/C         | `.cpp` `.c` `.h`     | Supports `// and /* */` comments.          | defaultParser       |
| Coffee-React  | `.cjsx`              | Supports `#` comments.                     | coffeeParser        |
| Coffeescript  | `.coffee`            | Supports `#` comments.                     | coffeeParser        |
| Crystal       | `.cr`                | Supports `#` comments.                     | coffeeParser        |
| CSon          | `.cson`              | Supports `#` comments.                     | coffeeParser        |
| CSS           | `.css`               | Supports `/* */` comments.                 | defaultParser       |
| EJS           | `.ejs`               | Supports `<!-- -->` and `<%# %>`           | ejsParser           |
| Erb           | `.erb`               | Supports `<!-- -->` and `<%# %>`           | ejsParser           |
| Erlang        | `.erl` `.hrl`        | Supports `%` comments.                     | erlangParser        |
| Go            | `.go`                | Supports `// and /* */` comments.          | defaultParser       |
| Haml          | `.haml`              | Supports `/ -# <!-- --> and <%# %>`        | twigParser          |
| Handlebars    | `.hbs` `.handlebars` | Supports `{{! }}` and `{{!-- --}}`         | hbsParser           |
| Haskell       | `.hs`                | Supports `--`                              | haskellParser       |
| Hogan         | `.hgn` `.hogan`      | Supports `{{! }}` and `{{!-- --}}`         | hbsParser           |
| HTML          | `.html` `.htm`       | Supports `<!-- -->`                        | twigParser          |
| Jade          | `.jade` `.pug`       | Supports `//` and `//-` comments.          | jadeParser          |
| Java          | `.java`              | Supports `// and /* */` comments           | defaultParser        |
| Javascript    | `.js` `.es` `.es6`   | Supports `// and /* */` comments           | defaultParser       |
| Jsx           | `.jsx`               | Supports `// and /* */` comments.          | defaultParser       |
| Kotlin        | `.kt`                | Supports `// and /* */` comments.          | defaultParser       |
| Latex         | `.tex`               | Supports `\begin{comment}` and `%` comments| latexParser         |
| Less          | `.less`              | Supports `// and /* */` comments.          | defaultParser       |
| Mustache      | `.mustache`          | Supports `{{! }}` and `{{!-- --}}`         | hbsParser           |
| Nunjucks      | `.njk`               | Supports `{#  #}` and `<!-- -->`           | twigParser          |
| Objective-C   | `.m`                 | Supports `// and /* */` comments           | defaultParser       |
| Objective-C++ | `.mm`                | Supports `// and /* */` comments           | defaultParser       |
| Pascal        | `.pas`               | Supports `// and { }` comments.            | pascalParser        |
| Perl          | `.pl`, `.pm`         | Supports `#` comments.                     | coffeeParser        |
| PHP           | `.php`               | Supports `// and /* */` comments.          | defaultParser       |
| Python        | `.py`                | Supports `"""` and `#` comments.           | pythonParser        |
| Ruby          | `.rb`                | Supports `#` comments.                     | coffeeParser        |
| Sass          | `.sass` `.scss`      | Supports `// and /* */` comments.          | defaultParser       |
| Scala         | `.scala`             | Supports `// and /* */` comments.          | defaultParser       |
| Shell         | `.sh` `.zsh` `.bash` | Supports `#` comments.                     | coffeeParser        |
| SilverStripe  | `.ss`                | Supports `<%-- --%>` comments.             | ssParser            |
| SQL           | `.sql`               | Supports `--` and `/* */` comments         | defaultParser & haskellParser |
| Stylus        | `.styl`              | Supports `// and /* */` comments.          | defaultParser       |
| Swift         | `.swift`             | Supports `// and /* */` comments.          | defaultParser       |
| Twig          | `.twig`              | Supports `{#  #}` and `<!-- -->`           | twigParser          |
| Typescript    | `.ts`, `.tsx`        | Supports `// and /* */` comments.          | defaultParser       |
| Vue           | `.vue`               | Supports `//` `/* */` `<!-- -->` comments. | twigParser          |
| Yaml          | `.yaml` `.yml`       | Supports `#` comments.                     | coffeeParser        |

Javascript is the default parser.

**PRs for additional filetypes is most welcomed!!**

## Usage

### Command Line

#### Installation

```sh
$ npm install --global leasot
```

#### Examples

```sh
$ leasot --help

  Usage: leasot [options] <file ...>

  Parse and output TODOs and FIXMEs from comments in your files

  Options:

    -h, --help                           output usage information
    -V, --version                        output the version number
    -A, --associate-parser [ext,parser]  associate unknown extensions with bundled parsers (parser optional / default: defaultParser)
    -i, --ignore <patterns>              add ignore patterns
    -I, --inline-files                   parse possible inline files
    -r, --reporter [reporter]            use reporter (table|json|xml|markdown|vscode|raw) (default: table)
    -S, --skip-unsupported               skip unsupported filetypes
    -t, --filetype [filetype]            force the filetype to parse. Useful for streams (default: .js)
    -T, --tags <tags>                    add additional comment types to find (alongside todo & fixme)
    -x, --exit-nicely                    exit with exit code 0 even if todos/fixmes are found

  Examples:

    # Check a specific file
    $ leasot index.js

    # Check php files with glob
    $ leasot **/*.php

    # Check multiple different filetypes
    $ leasot app/**/*.js test.rb

    # Use the json reporter
    $ leasot --reporter json index.js

    # Search for REVIEW comments as well
    $ leasot --tags review index.js

    # Add ignore pattern to filter matches
    $ leasot app/**/*.js --ignore "**/custom.js"

    # Search for REVIEW comments as well
    $ leasot --tags review index.js

    # Check a stream specifying the filetype as coffee
    $ cat index.coffee | leasot --filetype .coffee

    # Report from leasot parsing and filter todos using `jq`
    $ leasot tests/**/*.styl --reporter json | jq 'map(select(.kind == "TODO"))' | leasot-reporter
```

#### Usage in NPM scripts

Use `leasot -x` in order to prevent exiting with a non-zero exit code. This is a good solution if you plan to
run `leasot` in a CI tool to generate todos.

```json
{
    "scripts": {
        "todo": "leasot 'src/**/*.js'",
        "todo-ci": "leasot -x --reporter markdown 'src/**/*.js' > TODO.md"
    },
    "devDependencies": {
        "leasot": "*"
    }
}
```

### Programmatic

#### Installation

```sh
$ npm install --save-dev leasot
```

#### Examples

```js
const fs = require('fs');
const leasot = require('leasot');

const contents = fs.readFileSync('./contents.js', 'utf8');
// get the filetype of the file, or force a special parser
const filetype = path.extname('./contents.js');
// add file for better reporting
const file = 'contents.js';
const todos = leasot.parse({ ext: filetype, content: contents, fileName: file });

// -> todos now contains the array of todos/fixme parsed

const output = leasot.reporter(todos, {
    reporter: 'json',
    spacing: 2
});

console.log(output);
// -> json output of the todos
```

### Build Time

- [gulp-todo](https://github.com/pgilad/gulp-todo)
- [broccoli-leasot](https://github.com/sivakumar-kailasam/broccoli-leasot)
- [todo-webpack-plugin](https://github.com/mikeerickson/todo-webpack-plugin)

## API

```js
const leasot = require('leasot');
```

`leasot` exposes the following API:

### .associateExtWithParser(parsers)

Associates a parser with a new extension.

The `parsers` parameter must be completed in the following format:

```js
{
    '.cls': {
        parserName: 'defaultParser'
    }
}
```

The `parserName` property can also be an array of parser names.

```js
{
    '.sql': {
        parserName: ['defaultParser', 'haskellParser']
    }
}
```

### .isExtSupported(extension)

Check whether extension is supported by a built-in parser.

Specify an extension including the prefixing dot, for example:

`leasot.isExtSupported('.js'); //-> true`

**Returns**: `Boolean`

### .parse(options)

| Name                | Type       | Required | Default | Description                                           |
| ----                | ----       | -------- | ------- | -----------                                           |
| `ext`               | `string`   | Yes      |         | The extension the parse as including a prefixing dot. |
| `content`           | `string`   | Yes      |         | Content to parse                                      |
| `associateParser`   | `object`   | No       |         | See `.associateExtWithParser` for syntax              |
| `customParsers`     | `object`   | No       |         | See `Custom Parsers` for syntax              |
| `customTags`        | `array`    | No       | `[]`    | Additional tags (comment types) to search for (alongside todo & fixme) |
| `fileName`          | `string`   | No       |         | fileName to attach to todos output                    |
| `withIncludedFiles` | `boolean`  | No       | `false` | Parse also possible included file types (for example: `css` inside a `php` file |

**Returns**: `array` of comments.

```js
[{
    file: 'parsedFile.js',
    text: 'comment text',
    kind: 'TODO',
    line: 8,
    ref: 'reference'
}]
```

**Note** that tags are case-insensitive and are strict matching, i.e PROD tag will match PROD but not PRODUCTS

#### Custom Parsers

Custom parsers can be supplied via the `customParsers` option to the `parse` programmatic api. These are in the format:

```js
{
    '<parserName>': () => parserFactory
}
```

Example:

```js
const leasot = require('leasot');

const todos = leasot.parse({
        ext: filetype,
        content: contents,
        fileName: file,
        associateParser: {
            '.myExt1': { parserName: 'myCustomParser1' },
            '.myExt2': { parserName: 'myCustomParser2' },
        },
        customParsers: {
            myCustomParser1: function (parseOptions) {
                return function parse(contents, file) {
                    const comments = [];
                     comments.push({
                        file: '',   // The file path, eg |file || 'unknown file'""
                        kind: '',   // One of the keywords such as `TODO` and `FIXME`.
                        line: 0,    // The line number
                        text: '',   // The comment text
                        ref: ''     // The optional (eg. leading and trailing) references in the comment
                    });
                    return comments;
                }
            },
            myCustomParser2: function (parseOptions) {
                // etc
            },
        }
    });
```

Note as above you will need to associate any **new** extensions using `associateExtWithParser`.
You can overwrite the built in parsers by naming them the same, eg, overwrite the default parser:

```js
 customParsers: {
        defaultParser: function (parseOptions) {
            // etc
        }
    }
```

See the [built-in parsers](lib/parsers) for examples

#### Utils

There are some built in utils for todo parsing that may be useful for custom parsers:

```js
const leasot = require('leasot');
const prepareComment = require('leasot/lib/utils/comments').prepareComment;

const todos = leasot.parse({
        ext: '.myExt',
        content: contents,
        fileName: file,
        associateParser: {
            '.myExt': { parserName: 'myCustomParser' },
        },
        customParsers: {
            myCustomParser: function (parseOptions) {
                return function parse(contents, file) {
                    const comment = prepareComment(match, index + 1, file);
                    comments.push(comment);
                    return comments;
                }
            }
        }
    });
```

### `.reporter(comments, config)`

Use the specified reporter to report the comments.

`comments` is the array of comments received from `leasot.parse()`.

`config` is an object that will also be passed to the reporter itself (allowing custom options for each reporter).

It may also contain the specified reporter:

#### `config.reporter`

Can be a string indicating the [built-in reporter](#built-in-reporters) to use,
 or an external library used as a reporter.

Could also be a custom function `(comments, config)`

**Type**: `String|Function`

**Required**: `false`

**Default**: `raw`

## Built-in Reporters

- json
- xml
- raw
- table
- markdown
- vscode

See the [docs](docs/REPORTERS.md)

## License

MIT ©[Gilad Peleg](http://giladpeleg.com)
