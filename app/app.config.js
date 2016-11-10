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
		'pascalprecht.translate',
		'ngDisqus'
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
		articlesServiceProvider,
		flickrServiceProvider,
		disqusProvider,
		locationProvider)
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

		// Flickr component service settings. 
		flickrServiceProvider.setFlickrApiKey('ae778d76cb4455923168dcab2bfd7135');
		flickrServiceProvider.setFlickrUserId('78474683@N07');
		flickrServiceProvider.setFlickrUsername('azerato');
		flickrServiceProvider.setMaxPhotos(12);

		disqusProvider.setShortname('azerato-github-io');
		locationProvider.hashPrefix('!');
	};

	config.$inject = [
		'dataStoreProvider', 
		'$urlRouterProvider', 
		'$stateProvider',
		'$translateProvider',
		'articlesServiceProvider',
		'flickrServiceProvider',
		'$disqusProvider',
		'$locationProvider'
	];

	app.config(config);

	var run = function(
		$rootScope,
		$cookies,
		$translate)
	{
		var favLang = $cookies.get('favLang');
		if(favLang === '' || favLang === undefined)
		{
			favLang = 'fr';
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