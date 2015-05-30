/* global describe,it */
'use strict';
var fs = require('fs');
var should = require('should');
var path = require('path');
var leasot = require('../index');

function getFixturePath(file) {
    return path.join('./tests/fixtures/', file);
}

function getComments(file) {
    var content = fs.readFileSync(file, 'utf8');
    var ext = path.extname(file);
    return leasot.parse(ext, content, file);
}

function verifyComment(actual, kind, line, text) {
    actual.kind.should.equal(kind);
    actual.line.should.equal(line);
    actual.text.should.equal(text);
}

describe('check parsing', function () {
    describe('test edge cases', function () {
        it('javascript', function () {
            var file = getFixturePath('edge-cases.js');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(3);
            verifyComment(comments[0], 'TODO', 1, '');
            verifyComment(comments[1], 'TODO', 2, '');
            verifyComment(comments[2], 'TODO', 3, 'text');
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
        it('parse // and /* comments', function () {
            var file = getFixturePath('typescript.ts');
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
});
