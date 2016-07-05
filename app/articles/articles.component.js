(function (angular) {
	'use strict';

	/*
	 * Get the app module.
	 */
	var appModule = angular.module('app');
	
/*
	 * Creation of an instance your Contacts form Controller.
	 */
	var articlesController = function(
		$scope,
		$state	
	) {
		$scope.articles = {};
	};

	/*
	 * Inject depencencies to your controller.
	 * Caution : inject the service 'dataStore'.
	 * Caution : inject the service '$cookies' for use the module 'ngCookies'.
	 */
	articlesController.$inject = [
		'$scope', 
		'$state'
	];

	/*
	 * 
	 */
	 var articleComponent = {
	 	controller: articlesController,
	 	template: '<div>articles</div>' 
	 };

	/*
     * Inject your new controller to module.
	 */
	appModule.component('articles', articleComponent);

	/*
	 *
	 */
	var config = function(stateProvider)
	{
		// routing state configuration
		stateProvider.state('root.contacts', {
			url:'/home',
			views: {
				'main@': {
					template: '<articles></articles>',
				}
			}
		});
	};
	
	config.$inject = ['$stateProvider'];

	appModule.config(config);

})(window.angular);