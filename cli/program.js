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
	.version('0.0.2')
	.option('-i, --index', 'Posts indexing')
	.option('-c, --convert', 'Posts conversion')
	.option('-d, --debug', 'Show trace')
	.option('-p --path <string>', 'Specify the posts path', path, 'blog/content/posts/')
	.parse(process.argv);

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
if (program.convert)
{
	postsConverter.convert(program);
}

/*
 * Convert posts.
 */
if (program.index)
{
	postsIndexer.indexing(program);
}