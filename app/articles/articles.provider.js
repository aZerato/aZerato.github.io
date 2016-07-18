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

		// Default folder where i can find the pagination.json file.
		this.paginationConfigEmplacement = '/blog/content/posts/pagination.json';

		this.setPaginationConfigEmplacement = function(paginationConfigEmplacement)
		{
			this.paginationConfigEmplacement = paginationConfigEmplacement;
		};

		this.PaginationConfig = {};

		this.$get = function() {
			return {
				getById: function(id, $http, $q, $sce)
				{
					// Promise.
					var defer = $q.defer();

					$http.get(self.postsEmplacement)
					.success(function(response) {
						var article = {};

						for (var j = response.length - 1; j >= 0; j--) {
							if(response[j].id == id)
							{
								$sce.trustAsHtml(response[j].fr.summary);
								$sce.trustAsHtml(response[j].fr.content);
								$sce.trustAsHtml(response[j].en.summary);
								$sce.trustAsHtml(response[j].en.content);
								
								article = response[j];
							}
						}

						defer.resolve(article);
					})
					.error(function(error) {
						console.log('articlesServiceProvider::$get::getById error(' + error + ')');

						defer.reject(error);
					});

					return defer.promise;
				},
				getAll: function($http, $q, $sce)
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
				},
				readPaginationConfig: function($http, $q, $sce)
				{
					// Promise.
					var defer = $q.defer();

					$http.get(self.paginationConfigEmplacement)
					.success(function(response) {
						defer.resolve(response);
					})
					.error(function(error) {
						console.log('articlesServiceProvider::$get::readPaginationConfig error(' + error + ')');

						defer.reject(error);
					});

					return defer.promise;
				},
				getFromTo: function(from, to, $http, $q, $sce)
				{
					// Promise.
					var defer = $q.defer();

					$http.get(self.postsEmplacement)
					.success(function(response) {
						var articles = [];

						if (to > response.length)
						{
							to = response.length;
						}

						for (var j = to - 1; j >= from; j--) {
							$sce.trustAsHtml(response[j].fr.summary);
							$sce.trustAsHtml(response[j].fr.content);
							$sce.trustAsHtml(response[j].en.summary);
							$sce.trustAsHtml(response[j].en.content);
							
							articles.push(response[j]);
						}

						defer.resolve(articles);
					})
					.error(function(error) {
						console.log('articlesServiceProvider::$get::getFromTo error(' + error + ')');

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