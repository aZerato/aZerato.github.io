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
		self.postsEmplacement = '/blog/content/posts/posts.json';

		self.setPostsEmplacement = function(postsEmplacement)
		{
			self.postsEmplacement = postsEmplacement;
		};

		// Default folder where i can find the pagination.json file.
		self.paginationConfigEmplacement = '/blog/content/posts/pagination.json';

		self.setPaginationConfigEmplacement = function(paginationConfigEmplacement)
		{
			self.paginationConfigEmplacement = paginationConfigEmplacement;
		};

		self.PaginationConfig = {};

		self.$get = function() {
			return {
				getById: function(id, $http, $q, $sce)
				{
					// Promise.
					var defer = $q.defer();

					$http.get(self.postsEmplacement)
					.then(
						function(response) {
							var article = {};

							for (var j = response.data.length - 1; j >= 0; j--) {
								if(response.data[j].id == id)
								{
									$sce.trustAsHtml(response.data[j].fr.summary);
									$sce.trustAsHtml(response.data[j].fr.content);
									$sce.trustAsHtml(response.data[j].en.summary);
									$sce.trustAsHtml(response.data[j].en.content);
									
									article = response.data[j];
								}
							}

							defer.resolve(article);
						},
						function(error) {
							console.log('articlesServiceProvider::$get::getById error(' + error + ')');

							defer.reject(error);
						}
					);

					return defer.promise;
				},
				getAll: function($http, $q, $sce)
				{
					// Promise.
					var defer = $q.defer();

					$http.get(self.postsEmplacement)
					.then(
						function(response) {
							var articles = [];

							for (var j = from; j < to; j++) {
								$sce.trustAsHtml(response.data[j].fr.summary);
								$sce.trustAsHtml(response.data[j].fr.content);
								$sce.trustAsHtml(response.data[j].en.summary);
								$sce.trustAsHtml(response.data[j].en.content);
								
								articles.push(response.data[j]);
							}

							defer.resolve(articles);
						},
						function(error) {
							console.log('articlesServiceProvider::$get::getAll error(' + error + ')');

							defer.reject(error);
						}
					);

					return defer.promise;
				},
				readPaginationConfig: function($http, $q, $sce)
				{
					// Promise.
					var defer = $q.defer();

					$http.get(self.paginationConfigEmplacement)
					.then(
						function(response) {
							defer.resolve(response.data);
						},
						function(error) {
							console.log('articlesServiceProvider::$get::readPaginationConfig error(' + error + ')');

							defer.reject(error);
						}
					);

					return defer.promise;
				},
				getFromTo: function(from, to, $http, $q, $sce)
				{
					// Promise.
					var defer = $q.defer();

					$http.get(self.postsEmplacement)
					.then(
						function(response) {
							var articles = [];

							if (to > response.data.length)
							{
								to = response.data.length;
							}

							for (var j = from; j < to; j++) {
								$sce.trustAsHtml(response.data[j].fr.summary);
								$sce.trustAsHtml(response.data[j].fr.content);
								$sce.trustAsHtml(response.data[j].en.summary);
								$sce.trustAsHtml(response.data[j].en.content);
								
								articles.push(response.data[j]);
							}

							defer.resolve(articles);
						},
						function(error) {
							console.log('articlesServiceProvider::$get::getFromTo error(' + error + ')');

							defer.reject(error);
						}
					);

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