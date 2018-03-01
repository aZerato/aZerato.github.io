module.exports = PostsConverter = (function(){
	/*
	* Modules dependencies.
	*/
	var fs = require('fs');
	var path = require('path');
	var cheerio = require('cheerio');

	/*
	* Internals dependencies.
	*/
	var FileHelper = require('../helpers/fileHelper');
	var CheerioHelper = require('../helpers/cheerioHelper');

	/*
	* Convert posts.
	*/
	var PostsConverter = function() {
	};

	PostsConverter.prototype.convert = function(program)
	{
		// init FileHelper.
		var fileHelper = new FileHelper(program.debug);
		var currentPath = fileHelper.currentPath();

		var cheerioHelper = new CheerioHelper();
		cheerioHelper.addInvalidCorrectChar('<', '&lt;');
		cheerioHelper.addInvalidCorrectChar('>', '&gt;');

		if(!program.path)
		{
			console.log('invalid path');
			return;
		}
		
		console.log('path : ' + program.path);

		// get all files from a directory.
		var postsPath = path.join(currentPath, program.path);
		var allPostsPath = fileHelper.getFilesPathFromDir(program.path, ['.html']);

		if(allPostsPath.length > 0)
		{
			console.log('number of posts : ' + allPostsPath.length);
		}
		else
		{
			console.log('no posts files detected');
			return;
		}

		// Starting conversion.
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
					img_alt: $('img[data-img]').attr('data-img-alt'),
					fr: {
						title: cheerioHelper.replaceCharsInnerCodeTags($, $('[data-lang="fr"] [data-model="title"]')).html(),
						summary: cheerioHelper.replaceCharsInnerCodeTags($, $('[data-lang="fr"] [data-model="summary"]')).html(),
						content: cheerioHelper.replaceCharsInnerCodeTags($, $('[data-lang="fr"] [data-model="content"]')).html()
					},
					en: {
						title: cheerioHelper.replaceCharsInnerCodeTags($, $('[data-lang="en"] [data-model="title"]')).html(),
						summary: cheerioHelper.replaceCharsInnerCodeTags($, $('[data-lang="en"] [data-model="summary"]')).html(),
						content: cheerioHelper.replaceCharsInnerCodeTags($, $('[data-lang="en"] [data-model="content"]')).html()
					}
				};

				jsonPosts.push(jsonPost);
			}
		}

		// Sort desc.
		jsonPosts = jsonPosts.sort(function(p1, p2) {
			return  p2.publication_date - p1.publication_date;
		});

		// Create posts.js file.
		var postsJsonPath = path.join(program.path, 'posts.json');
		var jsonPostsString = JSON.stringify(jsonPosts);
		fs.writeFileSync(postsJsonPath, jsonPostsString, 'utf8');

		if(program.debug)
		{
			console.log('posts.json path : ' + postsJsonPath);
		}

		// Create pagination object.
		var jsonPagination = {
			number_per_page: 4,
			total_posts: jsonPosts.length,
			pages: []
		};

		var numPage = Math.ceil(jsonPagination.total_posts / jsonPagination.number_per_page);
		for (var j = 1; j < numPage + 1; j++) {
			jsonPagination.pages.push({
				page: j
			});
		}

		// Create pagination.js file.
		var paginationJsonPath = path.join(program.path, 'pagination.json');
		var jsonPaginationString = JSON.stringify(jsonPagination);
		fs.writeFileSync(paginationJsonPath, jsonPaginationString, 'utf8');

		if(program.debug)
		{
			console.log('pagination.json path : ' + paginationJsonPath);
		}

		console.log('completed');
	};

    return PostsConverter;
}());