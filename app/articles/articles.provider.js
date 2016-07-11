(function (angular) {
	'use strict';

	/*
	 * Get the app module.
	 */
	var appModule = angular.module('app');
	
	/*
	 * Create an Articles Provider.
	 */
	var articlesServiceProvider = function()
	{
		var self = this;

		// Default type.
		this.githubUsername = 'default';

		// The folder where i can find yours posts.
		this.postsEmplacement = '/blog/content/posts/';

		// if local Posts files, i get only their URLs with github api & i get them directly from website root.
		this.localPosts = false;

		this.$get = function() {
			var githubUsername = this.githubUsername;
			return {
				get: function($http, $q)
				{
					// get files url throught github api.
					var finalPostsEmplacement = 'https://api.github.com/repos/' + self.githubUsername +'/' + self.githubUsername + '.github.io/contents' + self.postsEmplacement;
					
					// Promise.
					var defer = $q.defer();

					$http.get(finalPostsEmplacement)
					.success(function(response) {
						var articles = [];
								// from github api.
						for (var j = response.length - 1; j >= 0; j--) {
							var fileUrl = response[j].download_url;
							if(self.localPosts)
							{
								fileUrl = '/' + response[j].path;
							}
							articles.push(fileUrl);
						}

						defer.resolve(articles);
					})
					.error(function(error) {
						console.log('articlesServiceProvider::$get::get error');

						defer.reject(error);
					});

					return defer.promise;
				}
			};
		};

		this.setGithubUsername = function(username)
		{
			this.githubUsername = username;
		};

		this.setPostsEmplacement = function(postsEmplacement)
		{
			this.postsEmplacement = postsEmplacement;
		};

		this.setLocalPostsEmplacement = function(localPosts)
		{
			this.localPosts = localPosts;
		};
	};

	/*
     * Inject your new provider to app module.
	 */
	appModule.provider('articlesService', articlesServiceProvider);

})(window.angular);