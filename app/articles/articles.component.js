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
		dataStore,
		articlesService
	) {
		$scope.articles = dataStore.get($scope.articles);

		if($scope.articles === null || 
			$scope.articles.length === 0)
		{
			$scope.articles = [];
			articlesService.get($http)
				.then(function(response) {
					for (var i = response.data.length - 1; i >= 0; i--) {
						$scope.articles.push(
								// only same origin url are thrusted by angular.
								$sce.trustAsResourceUrl(response.data[i].download_url)
							);
					}

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