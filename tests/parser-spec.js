/* global describe,it */
'use strict';
var fs = require('fs');
var should = require('should');
var path = require('path');
var leasot = require('../index');

function getFixturePath(file) {
    return path.join('./tests/fixtures/', file);
}

function getComments(file, options) {
    options = options || {};
    var customTags = options.customTags;
    var withInlineFiles = options.withInlineFiles;
    var content = fs.readFileSync(file, 'utf8');
    var ext = path.extname(file);
    var associateParser = options.associateParser;
    return leasot.parse({
        ext: ext,
        content: content,
        fileName: file,
        customTags: customTags,
        withInlineFiles: withInlineFiles,
        associateParser: associateParser
    });
}

function verifyComment(actual, kind, line, text, ref) {
    ref = arguments.length === 5 ? ref : null;
    actual.kind.should.equal(kind);
    actual.line.should.equal(line);
    actual.text.should.equal(text);
    if (ref !== null) {
        actual.ref.should.equal(ref);
    }
}

describe('parsing', function () {
    describe('edge cases', function () {
        it('javascript', function () {
            var file = getFixturePath('edge-cases.js');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(5);
            verifyComment(comments[0], 'TODO', 1, '');
            verifyComment(comments[1], 'TODO', 2, '');
            verifyComment(comments[2], 'TODO', 3, 'text');
            verifyComment(comments[3], 'TODO', 4, 'something / after slash');
            verifyComment(comments[4], 'TODO', 5, 'something with a URL http://example.com/path');
        });
    });

    describe('stylus', function () {
        it('parse simple line comments', function () {
            var file = getFixturePath('line.styl');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            verifyComment(comments[0], 'FIXME', 4, 'use fixmes as well');
        });

        it('parse block line comments', function () {
            var file = getFixturePath('block.styl');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 5, 'single line comment with a todo');
            verifyComment(comments[1], 'FIXME', 6, 'single line comment with a todo');
        });
    });

    describe('handlebars', function () {
        it('parse {{! }} and {{!-- --}} comments', function () {
            var file = getFixturePath('handlebars.hbs');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(4);
            verifyComment(comments[0], 'TODO', 2, 'only output this author names if an author exists');
            verifyComment(comments[1], 'FIXME', 8, 'This comment will not be in the output');
            verifyComment(comments[2], 'TODO', 13, 'Multiple line comment');
            verifyComment(comments[3], 'TODO', 13, 'and again');
        });
    });

    describe('mustache', function () {
        it('parse {{! }} and {{!-- --}} comments', function () {
            var file = getFixturePath('mustache.mustache');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(4);
            verifyComment(comments[0], 'TODO', 2, 'only output this author names if an author exists');
            verifyComment(comments[1], 'FIXME', 8, 'This comment will not be in the output');
            verifyComment(comments[2], 'TODO', 13, 'Multiple line comment');
            verifyComment(comments[3], 'TODO', 13, 'and again');
        });
    });

    describe('hogan', function () {
        it('parse {{! }} and {{!-- --}} comments', function () {
            var file = getFixturePath('hogan.hgn');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(4);
            verifyComment(comments[0], 'TODO', 2, 'only output this author names if an author exists');
            verifyComment(comments[1], 'FIXME', 8, 'This comment will not be in the output');
            verifyComment(comments[2], 'TODO', 13, 'Multiple line comment');
            verifyComment(comments[3], 'TODO', 13, 'and again');
        });
    });

    describe('c++', function () {
        it('parse // and /* style comments', function () {
            var file = getFixturePath('cplusplus.cpp');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 1, 'document file operations');
            verifyComment(comments[1], 'FIXME', 10, 'make sure file can be closed');
        });
    });

    describe('c#', function () {
        it('parse // and /* style comments', function () {
            var file = getFixturePath('csharp.cs');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 1, 'document file operations');
            verifyComment(comments[1], 'FIXME', 11, 'do something with the file contents');
        });
    });

    describe('c', function () {
        it('parse // and /* style comments', function () {
            var file = getFixturePath('c.c');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 6, 'decide whether to use a pointer');
            verifyComment(comments[1], 'FIXME', 18, 'make sure file can be closed');
        });
    });

    describe('go', function () {
        it('parse // and /* style comments', function () {
            var file = getFixturePath('go.go');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            verifyComment(comments[0], 'TODO', 3, 'be more explicit here');
        });
    });

    describe('c header', function () {
        it('parse // and /* style comments', function () {
            var file = getFixturePath('c.h');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            verifyComment(comments[0], 'FIXME', 4, 'should use a double');
        });
    });

    describe('erlang', function () {
        it('parse % comments', function () {
            var file = getFixturePath('erlang.erl');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 1, 're-write this');
            verifyComment(comments[1], 'FIXME', 3, 'something useful');
        });
    });

    describe('ruby', function () {
        it('parse # comments', function () {
            var file = getFixturePath('ruby.rb');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 4, 'initialize things lol');
            verifyComment(comments[1], 'FIXME', 10, 'just kidding, pizza is everything in life, nothing to fix here');
        });
    });

    describe('crystal', function () {
        it('parse # comments', function () {
            var file = getFixturePath('crystal.cr');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            verifyComment(comments[0], 'TODO', 4, 'Write tests');
        });
    });

    describe('haml', function () {
        it('parse -# comments and / comments', function () {
            var file = getFixturePath('haml.haml');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(4);
            verifyComment(comments[0], 'TODO', 2, 'All your base are belong to us.');
            verifyComment(comments[1], 'FIXME', 5, 'Someone set up us the bomb.');
            verifyComment(comments[2], 'TODO', 9, 'All your base are belong to us. You are on the way to destruction.');
            verifyComment(comments[3], 'FIXME', 11, 'You have no chance to survive make your time. Ha ha ha...');
        });
    });

    describe('haskell', function () {
        it('parse -- comments', function () {
            var file = getFixturePath('haskell.hs');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'FIXME', 4, 'force evaluation of the given value');
            verifyComment(comments[1], 'TODO', 10, 'this will be deprecated soon');
        });
    });

    describe('sql', function () {
        it('parse -- and /* comments', function () {
            var file = getFixturePath('sql.sql');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 4, 'Sql multi comment');
            verifyComment(comments[1], 'TODO', 10, 'Sql single comment');
        });
    });

    describe('html', function () {
        it('parse <!-- --> comments', function () {
            var file = getFixturePath('HTML.html');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'FIXME', 1, 'change this tag from Id to class');
            verifyComment(comments[1], 'TODO', 9, 'Please add something more interesting here');
        });
    });

    describe('htm', function () {
        it('parse <!-- comments', function () {
            var file = getFixturePath('HTML.htm');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'FIXME', 1, 'change this tag from Id to class');
            verifyComment(comments[1], 'TODO', 9, 'Please add something more interesting here');
        });
    });

    describe('ejs', function () {
        it('parse <!-- --> and <%# %> comments', function () {
            var file = getFixturePath('ejs.ejs');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(4);
            verifyComment(comments[0], 'FIXME', 1, 'change this tag from Id to class');
            verifyComment(comments[1], 'FIXME', 2, 'change this tag from Id to class');
            verifyComment(comments[2], 'TODO', 10, 'Please add something more interesting here');
            verifyComment(comments[3], 'TODO', 11, 'Please add something more interesting here');
        });
    });

    describe('pascal', function () {
        it('parse // and { } comments', function () {
            var file = getFixturePath('pascal.pas');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(4);
            verifyComment(comments[0], 'TODO', 1, 'Add more stuff');
            verifyComment(comments[1], 'FIXME', 4, 'Say something cool');
            verifyComment(comments[2], 'FIXME', 6, 'Add a space');
            verifyComment(comments[3], 'TODO', 10, 'Display the user\'s name');
        });
    });

    describe('python', function () {
        it('parse # and """ comments', function () {
            var file = getFixturePath('python.py');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 6, 'refactor this');
            verifyComment(comments[1], 'FIXME', 12, 'Move this out');
        });
    });

    describe('perl module', function () {
        it('parse # comments', function () {
            var file = getFixturePath('perl_module.pm');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'FIXME', 3, 'Use python');
            verifyComment(comments[1], 'TODO', 18, 'still waiting for perl6?');
        });
    });

    describe('perl script', function () {
        it('parse # comments', function () {
            var file = getFixturePath('perl.pl');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 3, 'Refactor this');
            verifyComment(comments[1], 'FIXME', 6, 'fix the code below');
        });
    });

    describe('sass', function () {
        it('parse // and /* comments', function () {
            var file = getFixturePath('block.sass');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(4);
            verifyComment(comments[0], 'TODO', 2, 'it will appear in the CSS output.');
            verifyComment(comments[1], 'FIXME', 3, 'this is a block comment too');
            verifyComment(comments[2], 'FIXME', 10, "They won't appear in the CSS output,");
            verifyComment(comments[3], 'TODO', 14, 'improve this syntax');
        });
    });

    describe('scss', function () {
        it('parse // and /* comments', function () {
            var file = getFixturePath('block.scss');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            verifyComment(comments[0], 'TODO', 4, 'add another class');
        });
    });

    describe('typescript', function () {
        it('parse // and /* comments with ts extension', function () {
            var file = getFixturePath('typescript.ts');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 1, 'change to public');
            verifyComment(comments[1], 'FIXME', 11, 'use jquery');
        });
        it('parse // and /* comments with tsx extension', function () {
            var file = getFixturePath('typescript.tsx');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 1, 'change to public');
            verifyComment(comments[1], 'FIXME', 11, 'use jquery');
        });
    });

    describe('jsdoc', function () {
        it('handle jsdoc comments', function () {
            var file = getFixturePath('jsdoc.js');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            verifyComment(comments[0], 'TODO', 14, 'Show my TODO please');
        });

        it('handle jsdoc @todo comments', function () {
            var file = getFixturePath('jsdoc2.js');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            verifyComment(comments[0], 'TODO', 9, 'make this supported');
        });
    });

    describe('coffeescript', function () {
        it('handle # comments', function () {
            var file = getFixturePath('coffee.coffee');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 1, 'Do something');
            verifyComment(comments[1], 'FIXME', 3, 'Fix something');
        });
    });

    describe('coffee-react', function () {
        it('handle # comments', function () {
            var file = getFixturePath('coffee-react.cjsx');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            verifyComment(comments[0], 'TODO', 1, 'better document');
        });
    });

    describe('zsh', function () {
        it('handle # comments', function () {
            var file = getFixturePath('zsh.zsh');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            verifyComment(comments[0], 'TODO', 17, 'complete file');
        });
    });

    describe('yaml', function () {
        it('handle # comments', function () {
            var file = getFixturePath('yaml.yaml');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(3);
            verifyComment(comments[0], 'TODO', 7, 'Support POST');
        });
    });

    describe('bash', function () {
        it('handle # comments', function () {
            var file = getFixturePath('bash.bash');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            verifyComment(comments[0], 'TODO', 5, 'wrap variables in quotes');
        });
    });

    describe('sh', function () {
        it('handle # comments', function () {
            var file = getFixturePath('sh.sh');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            verifyComment(comments[0], 'FIXME', 31, 'we now exit the program');
        });
    });

    describe('ss', function () {
        it('handle <%-- --%> and <!-- --> comments', function () {
            var file = getFixturePath('silverstripe.ss');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(3);
            verifyComment(comments[0], 'FIXME', 4, 'title is incorrect');
            verifyComment(comments[1], 'TODO', 6, 'add stylesheets and scripts');
            verifyComment(comments[2], 'FIXME', 11, '$Condition is not defined');
        });
    });

    describe('less', function () {
        it('handles block and inline comment forms', function () {
            var file = getFixturePath('block.less');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(4);
            verifyComment(comments[0], 'TODO', 2, 'it will appear in the CSS output.');
            verifyComment(comments[1], 'FIXME', 3, 'this is a block comment too');
            verifyComment(comments[2], 'FIXME', 10, "They won't appear in the CSS output,");
            verifyComment(comments[3], 'TODO', 14, 'improve this syntax');
        });
    });

    describe('twig', function () {
        it('matches bang and html comment style', function () {
            var file = getFixturePath('twig.twig');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'FIXME', 1, "Hey, I'm a fixme!");
            verifyComment(comments[1], 'TODO', 13, "Hey, I'm a todo!");
        });
    });

    describe('Objective-C', function () {
        it('handles standard js comments', function () {
            var file = getFixturePath('objective.m');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            verifyComment(comments[0], 'TODO', 4, 'better rename this variable');
        });
    });

    describe('Objective-C++', function () {
        it('handles standard js comments', function () {
            var file = getFixturePath('objective.mm');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            verifyComment(comments[0], 'FIXME', 4, 'better rename this variable');
        });
    });

    describe('jsx', function () {
        it('handles standard js comments in jsx', function () {
            var file = getFixturePath('react.jsx');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 14, 'Show my TODO please');
            verifyComment(comments[1], 'FIXME', 21, 'illogical');
        });
    });

    describe('jade', function () {
        it('handle // style comments', function () {
            var file = getFixturePath('comments.jade');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 9, 'this is a todo');
            verifyComment(comments[1], 'FIXME', 11, 'also should be caught');
        });
    });

    describe('php', function () {
        it('handles standard js comments in php', function () {
            var file = getFixturePath('sample.php');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(3);
            verifyComment(comments[0], 'TODO', 2, 'This is a single-line comment');
            verifyComment(comments[1], 'FIXME', 7, 'implement single line comment');
            verifyComment(comments[2], 'TODO', 14, 'supported?');
        });
    });

    describe('swift', function () {
        it('handles standard comments in swift', function () {
            var file = getFixturePath('swift.swift');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 2, 'perimeter of the Shape.');
            verifyComment(comments[1], 'FIXME', 5, 'perimeter');
        });
    });

    describe('custom tags', function () {
        it('custom tags must be an array', function () {
            var file = getFixturePath('custom-tags.rb');

            (function () {
                getComments(file, {
                    customTags: true
                });
            }).should.throw(/customTags/);
        });

        it('custom tags', function () {
            var file = getFixturePath('custom-tags.rb');
            var comments = getComments(file, {
                customTags: ['review']
            });
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'REVIEW', 4, 'make sure this works');
            verifyComment(comments[1], 'FIXME', 10, 'just kidding');
        });

        it('custom tag is temporary', function () {
            var file = getFixturePath('custom-tags.rb');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            verifyComment(comments[0], 'FIXME', 10, 'just kidding');
        });
    });

    describe('with inline files', function () {
        it('parses a php file without included files', function () {
            var file = getFixturePath('with-inline.php');
            var comments = getComments(file, {
                withInlineFiles: false
            });
            comments.should.have.length(1);
            verifyComment(comments[0], 'TODO', 2, 'This is a single-line comment');
        });

        it('parses a php file with just php', function () {
            var file = getFixturePath('with-inline.php');
            var comments = getComments(file, {
                withInlineFiles: true
            });
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 2, 'This is a single-line comment');
            verifyComment(comments[1], 'FIXME', 9, 'change this tag from Id to class');
        });
    });

    describe('vue', function () {
        it('parses a vue file without included files', function () {
            var file = getFixturePath('vue.vue');
            var comments = getComments(file, {
                withInlineFiles: false
            });
            comments.should.have.length(1);
            verifyComment(comments[0], 'TODO', 2, 'Vue template comment');
        });

        it('parses a vue file with just php', function () {
            var file = getFixturePath('vue.vue');
            var comments = getComments(file, {
                withInlineFiles: true
            });
            comments.should.have.length(3);
            verifyComment(comments[0], 'TODO', 2, 'Vue template comment');
            verifyComment(comments[1], 'TODO', 7, 'Vue script comment');
            verifyComment(comments[2], 'FIXME', 20, 'Vue style comment');
        });
    });

    describe('associate parser', function () {
        it('supports new extension', function () {
            var association = { '.cls': { parserName: 'defaultParser'} };
            leasot.associateExtWithParser(association);

            leasot.isExtSupported('.cls').should.equal(true);

        });

        it('parses newly associated file using specified parser', function () {
            var file = getFixturePath('salesforce-apex.cls');
            var comments = getComments(file, {
                associateParser: { '.cls': { parserName: 'defaultParser'} }
            });
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 4, 'Add detail');
            verifyComment(comments[1], 'FIXME', 7, 'do something with the file contents');
        });
    });

    describe('references', function() {
        it('leading', function() {
            var file = getFixturePath('reference-leading.js');
            var comments = getComments(file);
            comments.should.have.length(1);
            verifyComment(comments[0], 'TODO', 3, 'Use Symbol instead', 'tregusti');
        });
        it('trailing', function() {
            var file = getFixturePath('reference-trailing.rb');
            var comments = getComments(file);
            comments.should.have.length(1);
            verifyComment(comments[0], 'FIXME', 2, 'Make it better', 'tregusti');
        });
    });

    describe('java', function () {
        it('handle java lines comments', function () {
            var file = getFixturePath('java.java');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 6, 'Change language');
        });

        it('handle java block comments', function () {
            var file = getFixturePath('java.java');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[1], 'FIXME', 9, 'Log response');
        });
    });

    describe('kotlin', function () {
        it('handle kotlin lines comments', function () {
            var file = getFixturePath('kotlin.kt');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 4, 'Change language');
        });

        it('handle kotlin block comments', function () {
            var file = getFixturePath('kotlin.kt');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[1], 'FIXME', 7, 'Log response');
        });
    });

    describe('scala', function () {
        it('handle scala line comments', function () {
            var file = getFixturePath('Scala.scala');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[0], 'TODO', 4, 'Do something');
        });

        it('handle scala block comments', function () {
            var file = getFixturePath('Scala.scala');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            verifyComment(comments[1], 'FIXME', 8, 'Fix something');
        });
    });
});
