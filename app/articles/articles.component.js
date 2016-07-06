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
		$scope,
		$state,
		$http,
		$sce,
		$q,
		dataStore,
		articlesService
	) {
		$scope.articles = dataStore.get($scope.articles);

		if($scope.articles === null || 
			$scope.articles.length === 0)
		{
			$scope.articles = [];
			articlesService.get($http, $sce, $q)
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
		'$scope', 
		'$state',
		'$http',
		'$sce',
		'$q',
		'dataStore',
		'articlesService'
	];

	/*
	 * Creation of an article ng component object.
	 */
	 var articleComponent = {
	 	controller: articlesController,
	 	templateUrl: 'app/articles/articles.list.html'
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
		stateProvider.state('root.contacts', {
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