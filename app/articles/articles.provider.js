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

		// Default file where i can find the posts.json file.
		self.postsEmplacement = '/blog/content/posts/posts.json';

		self.setPostsEmplacement = function(postsEmplacement)
		{
			self.postsEmplacement = postsEmplacement;
		};

		// Default file where i can find the pagination.json file.
		self.paginationConfigEmplacement = '/blog/content/posts/pagination.json';

		self.setPaginationConfigEmplacement = function(paginationConfigEmplacement)
		{
			self.paginationConfigEmplacement = paginationConfigEmplacement;
		};

		// Default file where i can find the indexer.fr.json file.
		self.indexerFREmplacement = '/blog/content/posts/indexer.fr.json';

		self.setIndexerFREmplacement = function(indexerEmplacement)
		{
			self.indexerFREmplacement = indexerEmplacement;
		};

		// Default file where i can find the indexer.en.json file.
		self.indexerENEmplacement = '/blog/content/posts/indexer.en.json';

		self.setIndexerENEmplacement = function(indexerEmplacement)
		{
			self.indexerENEmplacement = indexerEmplacement;
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
				},
				search: function(stringSearch, lang, $http, $q, $sce)
				{
					// Promise.
					var defer = $q.defer();

					var emplacement = '';
					if(lang == 'fr')
					{
						emplacement = self.indexerFREmplacement;
					}
					if(lang == 'en')
					{
						emplacement = self.indexerENEmplacement;
					}

					stringSearch = stringSearch.split(' ');

					$http.get(emplacement)
					.then(
						function(response) {
							var articleIds = [];

							for (var j = response.data.length - 1; j >= 0; j--) {
								for (var k = stringSearch.length - 1; k >= 0; k--) {
									if(response.data[j].word != undefined && response.data[j].word.indexOf(stringSearch[k]) != -1)
									{
										var state = false;
										articleIds = articleIds.map(function(post) {
											response.data[j].posts.map(function(cpost) {
												if(cpost.id == post.id)
												{
													post.force += cpost.force;
													state = true;
												}
											});

											return post;
										});

										if(state == false)
										{
											articleIds = articleIds.concat(response.data[j].posts);
										}
									}
								}
							}
	
							defer.resolve(articleIds);
						},
						function(error) {
							console.log('articlesServiceProvider::$get::search error(' + error + ')');

							defer.reject(error);
						}
					);

					return defer.promise;
				},
				getAllBySearchObject: function(searchObject, $http, $q, $sce)
				{
					var defer = $q.defer();

					$http.get(self.postsEmplacement)
					.then(
						function(response) {
							var articles = [];

							for(var k = searchObject.length - 1; k >= 0; k--)
							{
								for (var j = response.data.length - 1; j >= 0; j--)
								{							
									if(response.data[j].id == searchObject[k].id)
									{
										$sce.trustAsHtml(response.data[j].fr.summary);
										$sce.trustAsHtml(response.data[j].en.summary);
										
										// add force.
										response.data[j].force = searchObject[k].force;

										articles.push(response.data[j]);
									}
								}
							}

							// sort by force.
							articles = articles.sort(function(search1, search2) { return search2.force - search1.force; });
							
							defer.resolve(articles);
						},
						function(error) {
							console.log('articlesServiceProvider::$get::search error(' + error + ')');

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