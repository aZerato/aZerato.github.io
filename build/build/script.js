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
		urlRouterProvider.otherwise('/home');

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
		$sce,
		dataStore,
		articlesService,
		$translate
	) {
		$scope.articles = [];
		$scope.articlesLoaded = false;

		//$rootScope.currentLang;

		if($scope.articles === null || 
			$scope.articles.length === 0)
		{
			$scope.articles = [];
			
			articlesService.get($http, $q, $sce)
			.then(function(response) {
				$scope.articles = response;
				$scope.articlesLoaded = true;
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

		console.log($stateParams.articleId);

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
			url:'/home',
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

		// Default folder where i can find the posts.json file.
		this.postsEmplacement = '/blog/content/posts/posts.json';

		this.setPostsEmplacement = function(postsEmplacement)
		{
			this.postsEmplacement = postsEmplacement;
		};

		this.$get = function() {
			return {
				getById: function(id, $http, $q, $sce)
				{
					// Promise.
					var defer = $q.defer();

					$http.get(self.postsEmplacement)
					.success(function(response) {
						var article = {};

						for (var j = response.length - 1; j >= 0; j--) {
							if(response[j].id == id)
							{
								$sce.trustAsHtml(response[j].fr.summary);
								$sce.trustAsHtml(response[j].fr.content);
								$sce.trustAsHtml(response[j].en.summary);
								$sce.trustAsHtml(response[j].en.content);
								
								article = response[j];
							}
						}

						defer.resolve(article);
					})
					.error(function(error) {
						console.log('articlesServiceProvider::$get::getById error(' + error + ')');

						defer.reject(error);
					});

					return defer.promise;
				},
				get: function($http, $q, $sce)
				{
					// Promise.
					var defer = $q.defer();

					$http.get(self.postsEmplacement)
					.success(function(response) {
						var articles = [];

						for (var j = response.length - 1; j >= 0; j--) {
							$sce.trustAsHtml(response[j].fr.summary);
							$sce.trustAsHtml(response[j].fr.content);
							$sce.trustAsHtml(response[j].en.summary);
							$sce.trustAsHtml(response[j].en.content);
							
							articles.push(response[j]);
						}

						defer.resolve(articles);
					})
					.error(function(error) {
						console.log('articlesServiceProvider::$get::get error(' + error + ')');

						defer.reject(error);
					});

					return defer.promise;
				}
			};
		};
	};

	/*
     * Inject your new provider to app module.
	 */
	appModule.provider('articlesService', articlesServiceProvider);

})(window.angular);