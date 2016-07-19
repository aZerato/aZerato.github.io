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
		$scope,
		$state,
		$stateParams,
		$http,
		$q,
		$sce,
		dataStore,
		articlesService,
		$translate
	) {
		//$rootScope.currentLang;

		var pageConfig = undefined;
		
		$scope.articles = [];
		$scope.articlesLoaded = false;
		$scope.pages = [];

		articlesService.readPaginationConfig($http, $q, $sce)
		.then(function(response) {
			pageConfig = response;

			if($stateParams.pageNumber != undefined)
			{
				changePage($stateParams.pageNumber);
			}
			else
			{
				changePage(1);
			}			

			$scope.pages = pageConfig.pages;
		});

		var changePage = function(numpage) {
			$scope.articlesLoaded = false;
			var from = 0;
			if(numpage > 1)
			{
				from = (numpage * pageConfig.number_per_page) - pageConfig.number_per_page;
			}
			var to = from + pageConfig.number_per_page;
			articlesService.getFromTo(from, to, $http, $q, $sce)
			.then(function(response) {
				$scope.articles = response;
				$scope.articlesLoaded = true;
			});
		};
	};

	/*
	 * Inject depencencies to your controller.
	 */
	articlesController.$inject = [
		'$rootScope',
		'$scope', 
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
		$scope,
		$state,
		$stateParams,
		$http,
		$q,
		$sce,
		articlesService,
		$translate
	) {
		$scope.article = {};
		$scope.articleLoaded = false;

		articlesService.getById($stateParams.articleId, $http, $q, $sce)
		.then(function(response) {
			$scope.article = response;
			$scope.articleLoaded = true;
		});		
	};

	/*
	 * Inject depencencies to your controller.
	 */
	articleDetailsController.$inject = [
		'$rootScope',
		'$scope',
		'$state',
		'$stateParams',
		'$http',
		'$q',
		'$sce',
		'articlesService',
		'$translate'
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
				'main@': {
					template: '<articles-component></articles-component>',
				}
			}
		});
	};
	
	config.$inject = ['$stateProvider'];

	appModule.config(config);

})(window.angular);