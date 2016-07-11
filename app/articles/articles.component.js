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
		$http,
		$q,
		dataStore,
		articlesService,
		$translate
	) {
		$scope.articles = dataStore.get('articles');

		if($scope.articles === null || 
			$scope.articles.length === 0)
		{
			$scope.articles = [];
			
			articlesService.get($http, $q)
			.then(function(response) {
				$scope.articles = response;

				dataStore.set('articles', $scope.articles);
			});
		}
	};

	/*
	 * Inject depencencies to your controller.
	 */
	articlesController.$inject = [
		'$rootScope',
		'$scope', 
		'$state',
		'$http',
		'$q',
		'dataStore',
		'articlesService',
		'$translate'
	];

	/*
	 * Creation of an article ng component object.
	 */
	 var articleComponent = {
	 	controller: articlesController,
	 	templateUrl: '/app/articles/articles.list.html'
	 };

	/*
     * Inject your new component to app.
	 */
	appModule.component('articlesComponent', articleComponent);

	/*
	 * Add personalized config for this component.
	 */
	var config = function(stateProvider)
	{
		// routing state configuration
		stateProvider.state('root.articles', {
			url:'/home',
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