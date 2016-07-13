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

		// Default folder where i can find the posts.json file.
		this.postsEmplacement = '/blog/content/posts/posts.json';

		this.setPostsEmplacement = function(postsEmplacement)
		{
			this.postsEmplacement = postsEmplacement;
		};

		this.$get = function() {
			return {
				get: function($http, $q, $sce)
				{
					// Promise.
					var defer = $q.defer();

					$http.get(self.postsEmplacement)
					.success(function(response) {
						var articles = [];

						for (var j = response.length - 1; j >= 0; j--) {
							$sce.trustAsHtml(response[j].fr.summary);
							$sce.trustAsHtml(response[j].fr.content);
							$sce.trustAsHtml(response[j].en.summary);
							$sce.trustAsHtml(response[j].en.content);
							
							articles.push(response[j]);
						}

						defer.resolve(articles);
					})
					.error(function(error) {
						console.log('articlesServiceProvider::$get::get error(' + error + ')');

						defer.reject(error);
					});

					return defer.promise;
				}
			};
		};
	};

	/*
     * Inject your new provider to app module.
	 */
	appModule.provider('articlesService', articlesServiceProvider);

})(window.angular);