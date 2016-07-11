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
(function (angular) {
	'use strict';

	/*
	 * Get the contacts module.
	 */
	var appModule = angular.module('app');
	
	/*
	 * Creation an instance an dataStore.
	 */
	var dataStoreProvider = function()
	{
		// default type.
		this.type = 'localStorage';

		this.$get = function() {
			var type = this.type;
			return {
				set: function(key, data)
				{
					window[type].setItem(key, JSON.stringify(data));
				},
				get: function(key)
				{
					return JSON.parse(window[type].getItem(key));
				}
			};
		};

		this.setType = function(type)
		{
			this.type = type;
		};
	};

	/*
     * Inject your new provider to module.
     * Provider and service are really nearly : Provider <= factory <= service.
	 */
	appModule.provider('dataStore', dataStoreProvider);

})(window.angular);
(function (angular) {
	'use strict';

	/*
	 * Get the app module.
	 */
	var appModule = angular.module('app');
	
	/*
	 * 
	 */
	var headerController = function(
		$rootScope,
		$scope,
		$translate,
		$cookies)
	{
		$scope.changeLang = function(key) {
			$translate.use(key);
			$rootScope.currentLang = key;
			$cookies.put('favLang', key);
		};
	};

	/*
	 * 
	 */
	headerController.$inject = [
		'$rootScope',
		'$scope',
		'$translate',
		'$cookies'
	];

	/*
	 * 
	 */
	var headerComponent = {
		controller: headerController,
		templateUrl: '/app/common/header/header.html'
	};

	
	appModule.component('headerComponent', headerComponent);

}(window.angular));
(function (angular) {
	'use strict';

	var appModule = angular.module('app');

	/*
	 * 
	 */
	var footerController = function() {
		
	};

	/*
	 * 
	 */
	var footerComponent = {
		controller: footerController,
		templateUrl: '/app/common/footer/footer.html'
	};

	appModule.component('footerComponent', footerComponent);

}(window.angular));
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

		//$rootScope.currentLang;

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
(function (angular) {
	'use strict';

	/*
	 * Get the app module.
	 */
	var appModule = angular.module('app');
	
	/*
	 * Create an Articles Provider.
	 */
	var articlesServiceProvider = function()
	{
		var self = this;

		// Default type.
		this.githubUsername = 'default';

		// The folder where i can find yours posts.
		this.postsEmplacement = '/blog/content/posts/';

		// if local Posts files, i get only their URLs with github api & i get them directly from website root.
		this.localPosts = false;

		this.$get = function() {
			var githubUsername = this.githubUsername;
			return {
				get: function($http, $q)
				{
					// get files url throught github api.
					var finalPostsEmplacement = 'https://api.github.com/repos/' + self.githubUsername +'/' + self.githubUsername + '.github.io/contents' + self.postsEmplacement;
					if(self.localPosts === true)
					{
						// it's local files.
						finalPostsEmplacement = self.postsEmplacement;
					}

					// Promise.
					var defer = $q.defer();

					$http.get(finalPostsEmplacement)
					.success(function(response) {
						var articles = [];
						if(self.localPosts === true)
						{
							// from local folder.
							for (var i = response.length - 1; i >= 0; i--) {
								articles.push(self.postsEmplacement + '' + response[i]);
							}
						}
						else
						{
							// from github api.
							for (var j = response.length - 1; j >= 0; j--) {
								articles.push(response[j].download_url);
							}
						}

						defer.resolve(articles);
					})
					.error(function(error) {
						console.log('articlesServiceProvider::$get::get error');

						defer.reject(error);
					});

					return defer.promise;
				}
			};
		};

		this.setGithubUsername = function(username)
		{
			this.githubUsername = username;
		};

		this.setPostsEmplacement = function(postsEmplacement)
		{
			this.postsEmplacement = postsEmplacement;
		};

		this.setLocalPostsEmplacement = function(localPosts)
		{
			this.localPosts = localPosts;
		};
	};

	/*
     * Inject your new provider to app module.
	 */
	appModule.provider('articlesService', articlesServiceProvider);

})(window.angular);