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

		// default type.
		this.githubUsername = 'default';
		this.postsEmplacement = 'blog/content/posts/';

		this.$get = function() {
			var githubUsername = this.githubUsername;
			return {
				get: function($http)
				{
					var finalPostsEmplacement = 'https://api.github.com/repos/' + self.githubUsername +'/' + self.githubUsername + '.github.io/contents/' + self.postsEmplacement;

					return $http.get(finalPostsEmplacement);
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
	};

	/*
     * Inject your new provider to app module.
	 */
	appModule.provider('articlesService', articlesServiceProvider);

})(window.angular);