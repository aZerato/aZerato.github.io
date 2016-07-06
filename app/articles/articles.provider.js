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
		this.postsEmplacement = 'blog/content/posts/';

		// if local Posts files, i get only their URLs with github api & i get them directly from website root.
		this.localPosts = false;

		this.$get = function() {
			var githubUsername = this.githubUsername;
			return {
				get: function($http, $sce, $q)
				{
					var finalPostsEmplacement = 'https://api.github.com/repos/' + self.githubUsername +'/' + self.githubUsername + '.github.io/contents/' + self.postsEmplacement;
					if(self.localPosts === true)
					{
						finalPostsEmplacement = self.postsEmplacement;
					}

					// Promise.
					var defer = $q.defer();

					$http.get(finalPostsEmplacement)
					.success(function(response) {
						var articles = [];
						if(self.localPosts === true)
						{
							// from local folder.
							for (var i = response.length - 1; i >= 0; i--) {
								articles.push(self.postsEmplacement + '' + response[i]);
							}
						}
						else
						{
							// from github api.
							for (var i = response.length - 1; i >= 0; i--) {
								// only same origin url are thrusted by angular, thus, uses $sce.trustAsResources.
								articles.push($sce.trustAsResourceUrl(response[i].download_url));
							}
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