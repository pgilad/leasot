# leasot
> Parse and output TODOs and FIXMEs from comments in your files

[![NPM Version](http://img.shields.io/npm/v/leasot.svg?style=flat)](https://npmjs.org/package/leasot)
[![NPM Downloads](http://img.shields.io/npm/dm/leasot.svg?style=flat)](https://npmjs.org/package/leasot)
[![Build Status](http://img.shields.io/travis/pgilad/leasot.svg?style=flat)](https://travis-ci.org/pgilad/leasot)

Easily extract, collect and report TODOs and FIXMEs in your code. This project uses regex in order
to extract your todos from comments.

## Comment format

`TODO: add some info`

- Spaces are optional
- Colon is optional
- Must be in a comment (line or block) in its' own line (`some code(); //TOOD: do something` is not supported)
- Spaces are trimmed from comment text
- Supported types are `TODO` and `FIXME` - case insensitive

## Supported languages:

| Filetype     | Extension       | Notes                                           |
| ------------ | --------------- | ------------------------------------------------|
| Coffeescript | `.coffee`       | using regex. Supports `#` comments.             |
| Handlebars   | `.hbs`          | using regex. Supports `{{! }}` and `{{!-- --}}` |
| Jade         | `.jade`         | using regex.                                    |
| Javascript   | `.js`           | using regex. Supports `// and /* */` comments   |
| Sass         | `.sass` `.scss` | using regex. Supports `// and /* */` comments.  |
| Stylus       | `.styl`         | using regex. Supports `// and /* */` comments.  |
| Typescript   | `.ts`           | using regex. Supports `// and /* */` comments.  |

Javascript is the default parser.

**PRs for additional filetypes is most welcomed!!**

## Usage

### Command Line

#### Installation

```bash
$ npm install --global leasot
```

#### Examples

```bash
❯ leasot --help

  Usage: leasot [options] [file]

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -t, --filetype [filetype]  Force filetype to parse. Useful for handling files in streams [.js]
    -r, --reporter [reporter]  Which reporter to use (table|json|xml|markdown|raw) [table]

  Examples:

    $ leasot index.js
    $ leasot --reporter json index.js
    $ cat index.js | leasot
    $ cat index.coffee | leasot --filetype .coffee
```

### Programmatic

#### Installation

```bash
$ npm install --save-dev leasot
```

#### Examples

```js
var fs = require('fs');
var leasot = require('leasot');

var contents = fs.readFileSync('./contents.js', 'utf8');
// get the filetype of the file, or force a special parser
var filetype = path.extname('./contents.js');
// add file for better reporting
var file = 'contents.js';
var todos = leasot.parse(filetype, contents, file);

// -> todos now contains the array of todos/fixme parsed

var output = leasot.reporter(todos, {
    reporter: 'json',
    spacing: 2
});

console.log(output);
// -> json output of the todos
```

### Build Time

* [gulp-todo](https://github.com/pgilad/gulp-todo)

## Built-in Reporters

- json
- xml
- raw
- table
- markdown

Each reporter might contain config params that are useful only for that reporter:

### JSON

Return a JSON valid representation of the todos.

#### Options

##### spacing

Type: `Number`

Default: `2`

## API

## License

MIT ©[Gilad Peleg](http://giladpeleg.com)
