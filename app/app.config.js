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
		sceDelegateProvider,
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
					templateUrl: '/blog/content/pages/about.html'
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
		translateProvider.useSanitizeValueStrategy('escapeParameters');

		// for loading posts with urls getted with github API.
		sceDelegateProvider.resourceUrlWhitelist([
			// Allow same origin resource loads.
			'self',
			// Allow loading from our assets domain.  Notice the difference between * and **.
			'https://raw.githubusercontent.com/**'
		]);

		// Param your github posts recuperation.
		articlesServiceProvider.setGithubUsername('aZerato');
		articlesServiceProvider.setLocalPostsEmplacement(true);
		articlesServiceProvider.setPostsEmplacement('/blog/content/posts/');

	};

	config.$inject = [
		'dataStoreProvider', 
		'$urlRouterProvider', 
		'$stateProvider',
		'$translateProvider',
		'$sceDelegateProvider',
		'articlesServiceProvider'
	];

	app.config(config);

	var run = function(
		$rootScope,
		$cookies)
	{
		var favLang = $cookies.get('favLang');
		if(favLang === '' || favLang == null)
		{
			favLang = 'en';
			$cookies.put('favLang', favLang);
		}
		$rootScope.currentLang = favLang;

		$rootScope.getCurrentLang = function() {
			return $rootScope.currentLang;
		};
	};

	run.$inject = [
		'$rootScope',
		'$cookies'
	];

	app.run(run);

})(window.angular);