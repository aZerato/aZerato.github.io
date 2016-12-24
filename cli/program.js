#!/usr/bin/env node
/*
 * Modules dependencies.
 */
var program = require('commander');
var path = require('path');

/*
 * Commander Program : Posts converter.
 */
program
	.version('0.0.1')
	.option('-d, --debug', 'Show trace')
	.option('-p --path <string>', 'Specify the posts path', path, 'blog/content/posts/');

/*
 * Internal dependencies.
 */
var PostsConverter = require('./posts/posts.converter.js');
var postsConverter = new PostsConverter();

var PostsIndexer = require('./posts/posts.indexer.js');
var postsIndexer = new PostsIndexer();

/*
 * Convert posts.
 */
program.on('convert', function(args) {
	postsConverter.convert(args, program);
});

/*
 * Convert posts.
 */
program.on('indexing', function(args) {
	postsIndexer.indexing(args, program);
});

program.parse(process.argv);