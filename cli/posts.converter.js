#!/usr/bin/env node
/*
 * Modules dependencies.
 */
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');

/*
 * Internals dependencies.
 */
var FileHelper = require('./helpers/fileHelper');

var fileHelper = new FileHelper(true);
var currentPath = fileHelper.currentPath();
var postsPath = path.join(currentPath, '../blog/content/posts/');

// get all files from a directory.
var allPostsPath = fileHelper.getFilesPathFromDir(postsPath, ['.html']);

var jsonPosts = [];

for(var i = 0; i < allPostsPath.length; i++)
{
	if (fileHelper.checkIsFile(allPostsPath[i]))
	{
		var html = fs.readFileSync(allPostsPath[i], 'utf-8');
		var $ = cheerio.load(html);

		var jsonPost = {
			id: i,
			publication_date: new Date($('[data-model="publication_date"]').html()).getTime(),
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

// Sort desc.
jsonPosts = jsonPosts.sort(function(p1, p2) {
	return  p2.publication_date - p1.publication_date;
});

var postsJsonPath = path.join(postsPath, 'posts.json');
var jsonPostsString = JSON.stringify(jsonPosts);
fs.writeFileSync(postsJsonPath, jsonPostsString, 'utf8');

// Create pagination object.
var jsonPagination = {
	number_per_page: 3,
	total_posts: jsonPosts.length,
	pages: []
};

var numPage = Math.ceil(jsonPagination.total_posts / jsonPagination.number_per_page);
for (var j = 1; j < numPage + 1; j++) {
	jsonPagination.pages.push({
		page: j
	});
}

var paginationJsonPath = path.join(postsPath, 'pagination.json');
var jsonPaginationString = JSON.stringify(jsonPagination);
fs.writeFileSync(paginationJsonPath, jsonPaginationString, 'utf8');



