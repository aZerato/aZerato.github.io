#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');

var FileHelper = require('./helpers/fileHelper');

var fileHelper = new FileHelper(true);
var currentPath = fileHelper.currentPath();
var postsPath = path.join(currentPath, '../blog/content/posts/');

// get all files from a directory.
var allPostsPath = fileHelper.getFilesPathFromDir(postsPath, ['.html']);

var jsonPosts = [];

for(var i = 0; i < allPostsPath.length - 1; i++)
{
	if (fileHelper.checkIsFile(allPostsPath[i]))
	{
		var html = fs.readFileSync(allPostsPath[i], 'utf-8');
		var $ = cheerio.load(html);

		var jsonPost = {
			id: i,
			publication_date: new Date().getTime(),
			img: $('img[data-img]').attr('data-img'),
			fr: {
				title: $('[data-lang="fr"] [data-model="title"]').html(),
				summary: $('[data-lang="fr"] [data-model="summary"]').html(),
				content: $('[data-lang="fr"] [data-model="content"]').html()
			},
			en: {
				title: $('[data-lang="en"] [data-model="title"]').html(),
				summary: $('[data-lang="en"] [data-model="summary"]').html(),
				content: $('[data-lang="en"] [data-model="content"]').html()
			}
		};

		jsonPosts.push(jsonPost);
	}
}

var postsJsonPath = path.join(postsPath, 'posts.json');
var jsonPostsString = JSON.stringify(jsonPosts);
fs.writeFileSync(postsJsonPath, jsonPostsString, 'utf8');
