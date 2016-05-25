(function() {
	'use strict';

	$(document).ready(function() {
		try
		{
			readHeader();
			readContainer();
			readFooter();
		}
		catch(ex)
		{
			console.log(ex);
		}
	});

	var readHeader = function()
	{
		compositionsReader($('[data-composition=header]'));
	};

	var readFooter = function()
	{
		compositionsReader($('[data-composition=footer]'));
	};

	var compositionsReader = function($elToReplace)
	{
		var $expectedElementPlace = $elToReplace;
		
		if($expectedElementPlace.length > 0)
		{
			var fileName = $expectedElementPlace.attr('data-composition');
			if(fileName !== '')
			{
				var fileEmplacement = 'compositions/' + fileName + '.html';
				$.ajax({
					url: fileEmplacement,
					type: 'GET',
					success: function(data) {
						$expectedElementPlace.replaceWith(data);
					}
				});
			}
		}
	};

	var readContainer = function()
	{
		var $elContainer = $('[data-composition=container]');

		var type = $elContainer.attr('data-type');

		// edit IIS config value <directoryBrowse enabled="true" />
		if(type === 'blog')
		{
			var postsEmplacement = 'content/posts/';
			var allPosts = undefined;
			$.ajax({
				url: postsEmplacement,
				type: 'GET',
				success: function(data) {
					allPosts = data;

					// test with IIS server
					if(allPosts !== undefined)
					{
						allPosts = $(data).find('a');
						// first el is parent directory
						if(allPosts.length > 1)
						{
							for (var i = allPosts.length - 1; i >= 1; i--) {
								var postUrl = $(allPosts[i]).attr('href');
								if(postUrl.length > 0)
								{
									postsReader($elContainer, postUrl);
								}
							}
						}
					}
				}
			});		
		}
	};

	var postsReader = function($elContainer, postUrl)
	{
		$.ajax({
			url: postUrl,
			type: 'GET',
			success: function(data) {
				$elContainer.append(data);
			}
		});
	};
})();