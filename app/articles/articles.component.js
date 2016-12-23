(function (angular) {
	'use strict';

	/*
	 * Get the app module.
	 */
	var appModule = angular.module('app');
	
	/*
	 * Creation of an instance your Articles Controller.
	 */
	var articlesController = function(
		$rootScope,
		$state,
		$stateParams,
		$http,
		$q,
		$sce,
		dataStore,
		articlesService,
		$translate
	) {
		var self = this;

		self.$onInit = function() {
			self.pageConfig = undefined;
		
			self.articles = [];
			self.articlesLoaded = false;
			self.pages = [];

			articlesService.readPaginationConfig($http, $q, $sce)
			.then(function(response) {
				self.pageConfig = response;

				if($stateParams.pageNumber !== undefined)
				{
					self.changePage($stateParams.pageNumber);
				}
				else
				{
					self.changePage(1);
				}			

				self.pages = self.pageConfig.pages;
			});
		};
		
		self.changePage = function(numpage) {
			self.articlesLoaded = false;
			var from = 0;
			if(numpage > 1)
			{
				from = (numpage * self.pageConfig.number_per_page) - self.pageConfig.number_per_page;
			}
			var to = from + self.pageConfig.number_per_page;
			articlesService.getFromTo(from, to, $http, $q, $sce)
			.then(function(response) {
				self.articles = response;
				self.articlesLoaded = true;
			});
		};
	};

	/*
	 * Inject depencencies to your controller.
	 */
	articlesController.$inject = [
		'$rootScope',
		'$state',
		'$stateParams',
		'$http',
		'$q',
		'$sce',
		'dataStore',
		'articlesService',
		'$translate'
	];

	/*
	 * Creation of an articles ng component object.
	 */
	 var articlesComponent = {
	 	controller: articlesController,
	 	templateUrl: '/app/articles/articles.list.html'
	 };

	/*
     * Inject your new component to app.
	 */
	appModule.component('articlesComponent', articlesComponent);

	/*
	 * Creation of an instance your Articles Controller.
	 */
	var articleDetailsController = function(
		$rootScope,
		$state,
		$stateParams,
		$http,
		$q,
		$sce,
		articlesService,
		$translate,
		$compile
	) {
		var self = this;

		self.$onInit = function()
		{
			self.article = {};
			self.articleLoaded = false;

			articlesService.getById($stateParams.articleId, $http, $q, $sce)
			.then(function(response) {
				self.article = response;
				self.articleLoaded = true;
			});
		};
	};

	/*
	 * Inject depencencies to your controller.
	 */
	articleDetailsController.$inject = [
		'$rootScope',
		'$state',
		'$stateParams',
		'$http',
		'$q',
		'$sce',
		'articlesService',
		'$translate',
		'$compile'
	];

	/*
	 * Creation of an articles ng component object.
	 */
	 var articleDetailsComponent = {
		controller: articleDetailsController,
	 	templateUrl: '/app/articles/article.details.html'
	 };

	/*
     * Inject your new component to app.
	 */
	appModule.component('articleDetailsComponent', articleDetailsComponent);


	/*
	 * Add personalized config for this component.
	 */
	var config = function(stateProvider)
	{
		// routing state configuration
		stateProvider
		.state('root.articles', {
			url:'/',
			views: {
				'intro@': {
					templateUrl: '/blog/content/pages/intro.html',
				},
				'main@': {
					template: '<articles-component></articles-component>',
				}
			}
		});
		
		stateProvider
		.state('root.details', {
			url: '/article/:articleId',
			views: {
				'main@': {
					template: '<article-details-component></article-details-component>'
				}
			}
		});

		stateProvider
		.state('root.articles.pages', {
			url: 'pages/:pageNumber',
			views: {
				'intro@': {
					template: '',
				},
				'main@': {
					template: '<articles-component></articles-component>',
				}
			}
		});
	};
	
	config.$inject = ['$stateProvider'];

	appModule.config(config);

})(window.angular);