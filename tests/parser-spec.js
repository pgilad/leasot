/* global describe,it */
'use strict';
var fs = require('fs');
var should = require('should');
var path = require('path');
var leasot = require('../index');

var getFixturePath = function (file) {
    return path.join('./tests/fixtures/', file);
};

var getComments = function (file) {
    var content = fs.readFileSync(file, 'utf8');
    var ext = path.extname(file);
    return leasot.parse(ext, content, file);
};

describe('check parsing', function () {
    describe('stylus', function () {
        it('parse simple line comments', function () {
            var file = getFixturePath('line.styl');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            comments[0].kind.should.equal('FIXME');
            comments[0].line.should.equal(4);
            comments[0].text.should.equal('use fixmes as well');
        });

        it('parse block line comments', function () {
            var file = getFixturePath('block.styl');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(5);
            comments[0].text.should.equal('single line comment with a todo');
            comments[1].kind.should.equal('FIXME');
            comments[1].line.should.equal(6);
            comments[1].text.should.equal('single line comment with a todo');
        });
    });

    describe('handlebars', function () {
        it('parse {{! }} and {{!-- --}} comments', function () {
            var file = getFixturePath('handlebars.hbs');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(4);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(2);
            comments[0].text.should.equal('only output this author names if an author exists');
            comments[1].kind.should.equal('FIXME');
            comments[1].line.should.equal(8);
            comments[1].text.should.equal('This comment will not be in the output');
            comments[2].kind.should.equal('TODO');
            comments[2].text.should.equal('Multiple line comment');
            comments[2].line.should.equal(13);
            comments[3].kind.should.equal('TODO');
            comments[3].line.should.equal(13);
            comments[3].text.should.equal('and again');
        });
    });

    describe('c++', function () {
        it('parse // and /* style comments', function () {
            var file = getFixturePath('cplusplus.cpp');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(1);
            comments[0].text.should.equal('document file operations');
            comments[1].kind.should.equal('FIXME');
            comments[1].line.should.equal(10);
            comments[1].text.should.equal('make sure file can be closed');
        });
    });

    describe('c', function () {
        it('parse // and /* style comments', function () {
            var file = getFixturePath('c.c');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(6);
            comments[0].text.should.equal('decide whether to use a pointer');
            comments[1].kind.should.equal('FIXME');
            comments[1].line.should.equal(18);
            comments[1].text.should.equal('make sure file can be closed');
        });
    });

    describe('go', function () {
        it('parse // and /* style comments', function () {
            var file = getFixturePath('go.go');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(3);
            comments[0].text.should.equal('be more explicit here');
        });
    });

    describe('c header', function () {
        it('parse // and /* style comments', function () {
            var file = getFixturePath('c.h');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            comments[0].kind.should.equal('FIXME');
            comments[0].line.should.equal(4);
            comments[0].text.should.equal('should use a double');
        });
    });

    describe('ruby', function () {
        it('parse # comments', function () {
            var file = getFixturePath('ruby.rb');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            comments[0].kind.should.equal('TODO');
            comments[0].text.should.equal('initialize things lol');
            comments[0].line.should.equal(4);
            comments[1].kind.should.equal('FIXME');
            comments[1].text.should.equal('just kidding, pizza is everything in life, nothing to fix here');
            comments[1].line.should.equal(10);
        });
    });

    describe('sass', function () {
        it('parse // and /* comments', function () {
            var file = getFixturePath('block.sass');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(4);
            comments[0].kind.should.equal('TODO');
            comments[0].text.should.equal('it will appear in the CSS output.');
            comments[0].line.should.equal(2);
            comments[1].kind.should.equal('FIXME');
            comments[1].text.should.equal('this is a block comment too');
            comments[1].line.should.equal(3);
            comments[2].kind.should.equal('FIXME');
            comments[2].text.should.equal('They won\'t appear in the CSS output,');
            comments[2].line.should.equal(10);
            comments[3].kind.should.equal('TODO');
            comments[3].text.should.equal('improve this syntax');
            comments[3].line.should.equal(14);
        });
    });

    describe('scss', function () {
        it('parse // and /* comments', function () {
            var file = getFixturePath('block.scss');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            comments[0].kind.should.equal('TODO');
            comments[0].text.should.equal('add another class');
            comments[0].line.should.equal(4);
        });
    });

    describe('typescript', function () {
        it('parse // and /* comments', function () {
            var file = getFixturePath('typescript.ts');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(1);
            comments[0].text.should.equal('change to public');
            comments[1].kind.should.equal('FIXME');
            comments[1].line.should.equal(11);
            comments[1].text.should.equal('use jquery');
        });
    });

    describe('jsdoc', function () {
        it('handle jsdoc comments', function () {
            var file = getFixturePath('jsdoc.js');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(14);
            comments[0].text.should.equal('Show my TODO please');
        });

        it('handle jsdoc @todo comments', function () {
            var file = getFixturePath('jsdoc2.js');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(9);
            comments[0].text.should.equal('make this supported');
        });
    });

    describe('coffeescript', function () {
        it('handle # comments', function () {
            var file = getFixturePath('coffee.coffee');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(1);
            comments[0].text.should.equal('Do something');
            comments[1].kind.should.equal('FIXME');
            comments[1].line.should.equal(3);
            comments[1].text.should.equal('Fix something');
        });
    });

    describe('coffee-react', function () {
        it('handle # comments', function () {
            var file = getFixturePath('coffee-react.cjsx');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(1);
            comments[0].text.should.equal('better document');
        });
    });

    describe('zsh', function () {
        it('handle # comments', function () {
            var file = getFixturePath('zsh.zsh');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(17);
            comments[0].text.should.equal('complete file');
        });
    });

    describe('bash', function () {
        it('handle # comments', function () {
            var file = getFixturePath('bash.bash');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(5);
            comments[0].text.should.equal('wrap variables in quotes');
        });
    });

    describe('sh', function () {
        it('handle # comments', function () {
            var file = getFixturePath('sh.sh');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(1);
            comments[0].kind.should.equal('FIXME');
            comments[0].line.should.equal(31);
            comments[0].text.should.equal('we now exit the program');
        });
    });

    describe('less', function () {
        it('handles block and inline comment forms', function () {
            var file = getFixturePath('block.less');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(4);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(2);
            comments[0].text.should.equal('it will appear in the CSS output.');
            comments[1].kind.should.equal('FIXME');
            comments[1].line.should.equal(3);
            comments[1].text.should.equal('this is a block comment too');
            comments[2].kind.should.equal('FIXME');
            comments[2].line.should.equal(10);
            comments[2].text.should.equal('They won\'t appear in the CSS output,');
            comments[3].kind.should.equal('TODO');
            comments[3].line.should.equal(14);
            comments[3].text.should.equal('improve this syntax');
        });
    });

    describe('twig', function () {
        it('matches bang and html comment style', function () {
            var file = getFixturePath('twig.twig');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            comments[0].kind.should.equal('FIXME');
            comments[0].line.should.equal(1);
            comments[0].text.should.equal("Hey, I'm a fixme!");
            comments[1].kind.should.equal('TODO');
            comments[1].line.should.equal(13);
            comments[1].text.should.equal("Hey, I'm a todo!");
        });
    });

    describe('jsx', function () {
        it('handles standard js comments in jsx', function () {
            var file = getFixturePath('react.jsx');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(14);
            comments[0].text.should.equal('Show my TODO please');
            comments[1].kind.should.equal('FIXME');
            comments[1].line.should.equal(21);
            comments[1].text.should.equal('illogical');
        });
    });

    describe('jade', function () {
        it('handle // style comments', function () {
            var file = getFixturePath('comments.jade');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(2);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(9);
            comments[0].text.should.equal('this is a todo');
            comments[1].kind.should.equal('FIXME');
            comments[1].line.should.equal(11);
            comments[1].text.should.equal('also should be caught');
        });
    });

    describe('php', function () {
        it('handles standard js comments in php', function () {
            var file = getFixturePath('sample.php');
            var comments = getComments(file);
            should.exist(comments);
            comments.should.have.length(3);
            comments[0].kind.should.equal('TODO');
            comments[0].line.should.equal(2);
            comments[0].text.should.equal('This is a single-line comment');
            comments[1].kind.should.equal('FIXME');
            comments[1].line.should.equal(7);
            comments[1].text.should.equal('implement single line comment');
            comments[2].kind.should.equal('TODO');
            comments[2].line.should.equal(14);
            comments[2].text.should.equal('supported?');
        });
    });
});
