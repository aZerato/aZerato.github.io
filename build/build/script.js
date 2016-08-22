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
	 * Get the main app module.
	 */
	var appModule = angular.module('app');
	
	/*
	 * Pagination controller creation.
	 */
	var paginationController = function(
		$state
	)
	{
		this.changePage = function(pageNumber)
		{
			$state.go(this.ref, {"pageNumber": pageNumber});
		};
	};

	/*
	 * Dependency injection.
	 */
	paginationController.$inject = [
		'$state'
	];

	/*
	 * Pagination component creation.
	 * @ : get directly text value
	 * = : able to get object value
	 */
	var paginationComponent = {
		bindings: {
			ref: '@',
			pagesArray: '='
		},
		controller: paginationController,
		templateUrl: '/app/common/pagination/pagination.html'
	};

	/*
	 * Add to main app module the new pagination component.
	 */
	appModule.component('paginationComponent', paginationComponent);

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
		$stateParams,
		$http,
		$q,
		$sce,
		dataStore,
		articlesService,
		$translate
	) {
		//$rootScope.currentLang;

		var pageConfig = undefined;
		
		$scope.articles = [];
		$scope.articlesLoaded = false;
		$scope.pages = [];

		articlesService.readPaginationConfig($http, $q, $sce)
		.then(function(response) {
			pageConfig = response;

			if($stateParams.pageNumber != undefined)
			{
				changePage($stateParams.pageNumber);
			}
			else
			{
				changePage(1);
			}			

			$scope.pages = pageConfig.pages;
		});

		var changePage = function(numpage) {
			$scope.articlesLoaded = false;
			var from = 0;
			if(numpage > 1)
			{
				from = (numpage * pageConfig.number_per_page) - pageConfig.number_per_page;
			}
			var to = from + pageConfig.number_per_page;
			articlesService.getFromTo(from, to, $http, $q, $sce)
			.then(function(response) {
				$scope.articles = response;
				$scope.articlesLoaded = true;
			});
		};
	};

	/*
	 * Inject depencencies to your controller.
	 */
	articlesController.$inject = [
		'$rootScope',
		'$scope', 
		'$state',
		'$stateParams',
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
			url:'/',
			views: {
				'intro@': {
					templateUrl: '/blog/content/pages/intro.html',
				},
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

		stateProvider
		.state('root.articles.pages', {
			url: 'pages/:pageNumber',
			views: {
				'intro@': {
					template: '',
				},
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

		// Default folder where i can find the posts.json file.
		this.postsEmplacement = '/blog/content/posts/posts.json';

		this.setPostsEmplacement = function(postsEmplacement)
		{
			this.postsEmplacement = postsEmplacement;
		};

		// Default folder where i can find the pagination.json file.
		this.paginationConfigEmplacement = '/blog/content/posts/pagination.json';

		this.setPaginationConfigEmplacement = function(paginationConfigEmplacement)
		{
			this.paginationConfigEmplacement = paginationConfigEmplacement;
		};

		this.PaginationConfig = {};

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
				getAll: function($http, $q, $sce)
				{
					// Promise.
					var defer = $q.defer();

					$http.get(self.postsEmplacement)
					.success(function(response) {
						var articles = [];

						for (var j = from; j < to; j++) {
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
				},
				readPaginationConfig: function($http, $q, $sce)
				{
					// Promise.
					var defer = $q.defer();

					$http.get(self.paginationConfigEmplacement)
					.success(function(response) {
						defer.resolve(response);
					})
					.error(function(error) {
						console.log('articlesServiceProvider::$get::readPaginationConfig error(' + error + ')');

						defer.reject(error);
					});

					return defer.promise;
				},
				getFromTo: function(from, to, $http, $q, $sce)
				{
					// Promise.
					var defer = $q.defer();

					$http.get(self.postsEmplacement)
					.success(function(response) {
						var articles = [];

						if (to > response.length)
						{
							to = response.length;
						}

						for (var j = from; j < to; j++) {
							$sce.trustAsHtml(response[j].fr.summary);
							$sce.trustAsHtml(response[j].fr.content);
							$sce.trustAsHtml(response[j].en.summary);
							$sce.trustAsHtml(response[j].en.content);
							
							articles.push(response[j]);
						}

						defer.resolve(articles);
					})
					.error(function(error) {
						console.log('articlesServiceProvider::$get::getFromTo error(' + error + ')');

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