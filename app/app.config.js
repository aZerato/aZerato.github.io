(function (angular) {
	'use strict';

	/*
	 * Dependencies to imports.
	 * Caution : include ui.router in first !.
	 */
	var imports = [
		'ui.router',
		'ngSanitize',
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
					templateUrl: '/blog/content/pages/about.html'
				}
			}
		});

		// default url
		urlRouterProvider.otherwise('/');

		dataStoreProvider.setType('sessionStorage');

		// i18n
		translateProvider.useStaticFilesLoader({
			prefix: '/app/common/i18n/',
			suffix: '.json'
		});

		// Default language
		translateProvider.preferredLanguage('fr');
		translateProvider.useSanitizeValueStrategy('escapeParameters');

		// Param the url for getting posts.
		articlesServiceProvider.setPostsEmplacement('/blog/content/posts/posts.json');

	};

	config.$inject = [
		'dataStoreProvider', 
		'$urlRouterProvider', 
		'$stateProvider',
		'$translateProvider',
		'articlesServiceProvider'
	];

	app.config(config);

	var run = function(
		$rootScope,
		$cookies,
		$translate)
	{
		var favLang = $cookies.get('favLang');
		if(favLang === '' || favLang == null)
		{
			favLang = 'en';
			$cookies.put('favLang', favLang);
		}
		$rootScope.currentLang = favLang;

		$translate.use(favLang);
	};

	run.$inject = [
		'$rootScope',
		'$cookies',
		'$translate'
	];

	app.run(run);

})(window.angular);