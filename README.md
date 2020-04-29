<h1 align="center">
	<br>
	<br>
	<img width="320" src="media/leasot.png" alt="Leasot">
	<br>
	<br>
	<br>
    Leasot
</h1>

> Intelligently parse and output TODOs and FIXMEs from comments in your files

[![npm](https://img.shields.io/npm/v/leasot.svg?style=for-the-badge)](https://www.npmjs.com/package/leasot)
[![npm downloads](https://img.shields.io/npm/dm/leasot.svg?style=for-the-badge)](https://www.npmjs.com/package/leasot)
[![Travis (.org)](https://img.shields.io/travis/pgilad/leasot.svg?style=for-the-badge)](https://travis-ci.org/pgilad/leasot)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge)](https://github.com/prettier/prettier)

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
- Supports both leading and trailing references. Examples:
    - `// TODO(tregusti): Make this better`
    - `// TODO: Text /tregusti`

## Supported languages

[49+ languages are supported](./media/supported-languages.md), pull requests for additional language support is most welcomed!

## Usage in command line

```bash
npm install --global leasot
```

## Command line help

```bash
$ leasot --help

Usage: leasot [options] <file ...>

Parse and output TODOs and FIXMEs from comments in your files

Options:
  -V, --version                        output the version number
  -A, --associate-parser [ext,parser]  associate unknown extensions with bundled parsers (parser optional / default: defaultParser) (default: {})
  -i, --ignore <patterns>              add ignore patterns (default: [])
  -I, --inline-files                   parse possible inline files (default: false)
  -r, --reporter [reporter]            use reporter (table|json|xml|markdown|vscode|raw) (default: table) (default: "table")
  -S, --skip-unsupported               skip unsupported filetypes (default: false)
  -t, --filetype [filetype]            force the filetype to parse. Useful for streams (default: .js)
  -T, --tags <tags>                    add additional comment types to find (alongside todo & fixme) (default: [])
  -x, --exit-nicely                    exit with exit code 0 even if todos/fixmes are found (default: false)
  -h, --help                           output usage information

Examples:
    # Check a specific file
    $ leasot index.js

    # Check php files with glob
    $ leasot '**/*.php'

    # Check multiple different filetypes
    $ leasot 'app/**/*.js' test.rb

    # Use the json reporter
    $ leasot --reporter json index.js

    # Search for REVIEW comments as well
    $ leasot --tags review index.js

    # Add ignore pattern to filter matches
    $ leasot 'app/**/*.js' --ignore '**/custom.js'

    # Search for REVIEW comments as well
    $ leasot --tags review index.js

    # Check a stream specifying the filetype as coffee
    $ cat index.coffee | leasot --filetype .coffee

    # Report from leasot parsing and filter todos using `jq`
    $ leasot 'tests/**/*.styl' --reporter json | jq 'map(select(.tag == "TODO"))' | leasot-reporter

    # Associate a parser for an unknown extension`
    $ leasot -A '.svelte,twigParser' -A '.svelte,defaultParser' 'frontend/*.svelte'
```

### Usage in NPM scripts

Use `leasot -x` in order to prevent exiting with a non-zero exit code. This is a good solution if you plan to
run `leasot` in a CI tool to generate todos.

```json
{
    "scripts": {
        "todo": "leasot 'src/**/*.js'",
        "todo-ci": "leasot -x --reporter markdown 'src/**/*.js' > TODO.md"
    },
    "devDependencies": {
        "leasot": "^7.0.0"
    }
}
```

### Programmatic Installation

```bash
npm install --save-dev leasot
```

### Programmatic Examples

```js
const fs = require('fs');
const leasot = require('leasot');

const contents = fs.readFileSync('./contents.js', 'utf8');
// get the filetype of the file, or force a special parser
const filetype = path.extname('./contents.js');
// add file for better reporting
const file = 'contents.js';
const todos = leasot.parse(contents, { extension: filetype, filename: file });

// -> todos now contains the array of todos/fixme parsed

const output = leasot.report(todos, 'json', { spacing: 2 });

console.log(output);
// -> json output of the todos
```

### Leasot with build tools

- [gulp-todo](https://github.com/pgilad/gulp-todo)
- [broccoli-leasot](https://github.com/sivakumar-kailasam/broccoli-leasot)
- [todo-webpack-plugin](https://github.com/mikeerickson/todo-webpack-plugin)

## API

```js
const leasot = require('leasot');
```

See [main exported functions](src/index.ts)

Mainly, you should be using 2 functions:

- [parse](https://pgilad.github.io/leasot/index.html#parse) for parsing file contents
- [report](https://pgilad.github.io/leasot/index.html#report) for reporting the todos

[Type documentation](https://pgilad.github.io/leasot)

## Built-in Reporters

See [built-in reporters](https://pgilad.github.io/leasot/enums/builtinreporters.html)

## License

MIT © [Gilad Peleg](https://www.giladpeleg.com)
