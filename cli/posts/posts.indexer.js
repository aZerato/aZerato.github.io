module.exports = PostsIndexer = (function(){
	/*
	* Modules dependencies.
	*/
	var fs = require('fs');
	var path = require('path');
	var cheerio = require('cheerio');
	var _ = require('lodash');

	/*
	* Internals dependencies.
	*/
	var FileHelper = require('../helpers/fileHelper');
	var StringHelper = require('../helpers/stringHelper');

	/*
	* Constructor.
	*/
	var PostsIndexer = function() {
	};

	PostsConverter.prototype.indexing = function(args, program)
	{
		this.fileHelper = new FileHelper(program.debug);
		this.stringHelper = new StringHelper();

		if(!program.path)
		{
			console.log('invalid path');
			return;
		}
		
		console.log('path : ' + program.path);

		// get all files from a directory.
		this.allPostsPath = this.fileHelper.getFilesPathFromDir(program.path, ['.html']);

		if(this.allPostsPath.length > 0)
		{
			console.log('number of posts : ' + this.allPostsPath.length);
		}
		else
		{
			console.log('no posts files detected');
			return;
		}

		this.indexingPosts('fr', program);
		this.indexingPosts('en', program);

		console.log('completed');
	};

    /*
    * Indexing Posts : check if already added and add force (ponderation) by posts.
    * @param String : lang - language that you want to indexing.
	* @param Object : program -  current "program" instance.
    */
	PostsConverter.prototype.indexingPosts = function(lang, program)
	{
		// Starting conversion.
		var jsonWordsIndexers = [];
		for(var i = 0; i < this.allPostsPath.length; i++)
		{
			if (this.fileHelper.checkIsFile(this.allPostsPath[i]))
			{
				var html = fs.readFileSync(this.allPostsPath[i], 'utf-8');
				var $ = cheerio.load(html);

				var curPostTitleWords = this.cleanAndRemoveString($('[data-lang="' + lang + '"] [data-model="title"]').text(), lang);
					
				var curPostContentWords = this.cleanAndRemoveString($('[data-lang="' + lang + '"] [data-model="content"]').text(), lang);

				for(var j = 0; j < curPostTitleWords.length; j++)
				{
					if(curPostContentWords[j] != '')
					{
						jsonWordsIndexers = indexingWords(jsonWordsIndexers, i, curPostContentWords[j]);
					}
				}

				for(var j = 0; j < curPostContentWords.length; j++)
				{
					if(curPostContentWords[j] != '')
					{
						jsonWordsIndexers = indexingWords(jsonWordsIndexers, i, curPostContentWords[j]);
					}
				}
			}
		}

		// Create posts.js file.
		var jsonWordsIndexersPath = path.join(program.path, 'indexer.' + lang + '.json');
		var jsonWordsIndexersString = JSON.stringify(jsonWordsIndexers);
		fs.writeFileSync(jsonWordsIndexersPath, jsonWordsIndexersString, 'utf8');

		if(program.debug)
		{
			console.log('indexer.' + lang + '.json path : ' + jsonWordsIndexersPath);
		}
	};

	/*
	* Clean a string : remove tag and useless word.
	* @param String : htmlString - current string to clean.
	* @param String : lang - current string language.
	*/
	PostsConverter.prototype.cleanAndRemoveString = function(htmlString, lang)
	{
		htmlString = htmlString.toLowerCase();
		htmlString = this.stringHelper.removeDiacritics(htmlString);
		htmlString = this.stringHelper.removeShortsWords(htmlString);
		htmlString = this.stringHelper.removeTagsPonctuations(htmlString);

		if(lang == 'fr')
		{
			htmlString = this.stringHelper.removeUselessWordsFR(htmlString);
		}
		if(lang == 'en')
		{
			htmlString = this.stringHelper.removeUselessWordsEN(htmlString);
		}

		htmlString = this.stringHelper.removeShortsWords(htmlString);
		
		return htmlString.split(' ');
	};

    /*
    * Indexing Words : check if already added and add force (ponderation) by posts.
    * @param Object : wordsIndexer - custom object that list each words with the linked posts id.
    * @param int : postId - the current post id.
	* @param String : current word.
    */
	var indexingWords = function(wordsIndexer, postId, currentWord)
	{
		var wordIndex = _.findIndex(wordsIndexer, function(w) { return w.word == currentWord; });
		if(wordIndex != -1)
		{
			var posts = wordsIndexer[wordIndex].posts;
			var postIndex = _.findIndex(posts, function(p) { return p.id == postId; });
			
			if(postIndex != -1)
			{
				wordsIndexer[wordIndex].posts[postIndex].force++;
			}
			else
			{
				var post = {
					id: postId,
					force: 1
				};
				
				wordsIndexer[wordIndex].posts.push(post);
			}

			return wordsIndexer;
		}
		
		var jsonIndexer = {
			word: currentWord,
			posts: [{
				id: postId,
				force: 1
			}]
		};

		wordsIndexer.push(jsonIndexer);

		return wordsIndexer;
	};

    return PostsConverter;
}());