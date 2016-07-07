(function (angular) {
	'use strict';

	/*
	 * Dependencies to imports.
	 * Caution : include ui.router in first !.
	 */
	var imports = [
		'ui.router',
		'ngCookies',
		'pascalprecht.translate'
	];

	/*
	 * Main module = App.
	 */
	var app = angular.module('app', imports);

	/*
	 * Share the dataStore for all the app.
	 * Caution : inject the provider 'dataStoreProvider'
	 */
	var config = function(
		dataStoreProvider, 
		urlRouterProvider, 
		stateProvider,
		translateProvider,
		articlesServiceProvider)
	{
		stateProvider.state('root', {
			views: {
				'header': {
					template: '<header-component></header-component>',
				},
				'footer': {
					template: '<footer-component></footer-component>'	
				}
			}
		});

		stateProvider.state('root.about', {
			url: '/about',
			views: {
				'main@': {
					templateUrl: '/app/common/about/about.html'
				}
			}
		});

		// default url
		urlRouterProvider.otherwise('/home');

		dataStoreProvider.setType('sessionStorage');

		// i18n
		translateProvider.useStaticFilesLoader({
			prefix: '/app/common/i18n/',
			suffix: '.json'
		});

		// Default language
		translateProvider.preferredLanguage('en');

		articlesServiceProvider.setGithubUsername('aZerato');
		articlesServiceProvider.setPostsEmplacement('/blog/content/posts/');
		articlesServiceProvider.setLocalPostsEmplacement(false);
	};

	config.$inject = [
		'dataStoreProvider', 
		'$urlRouterProvider', 
		'$stateProvider',
		'$translateProvider',
		'articlesServiceProvider'
	];

	app.config(config);

})(window.angular);