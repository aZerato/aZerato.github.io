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
		$cookies,
		$state)
	{
		$scope.$state = $state;

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
		'$cookies',
		'$state'
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
		this.$state = $state;
		
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

	var appModule = angular.module('app');

	/*
	 * 
	 */
	var prismController = function (
		$scope,
		$element
	) 
	{
		$scope.$evalAsync(function() { 
			var prismEl = $element[0].getElementsByTagName('pre')[0].getElementsByTagName('code')[0];

			Prism.highlightElement(prismEl);
		});
	};

	prismController.$inject = [
		'$scope',
		'$element'
	];

	/*
	 * 
	 */
	var prismComponent = {
		bindings: {
			class: '@'
		},
		transclude: true,
		controller: prismController,
		template: '<pre class="{{$ctrl.class}}"><code ng-transclude></code></pre>'
	};

	appModule.component('prismComponent', prismComponent);

}(window.angular));
(function (angular) {
	'use strict';

	var appModule = angular.module('app');

	appModule.directive('compile', ['$compile', function ($compile) {
        return function(scope, element, attrs) {
            scope.$watch(
                function(scope) {
                    return scope.$eval(attrs.compile);
                },
                function(value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                }
            );
        };
    }]);

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

		var pageConfig;
		
		$scope.articles = [];
		$scope.articlesLoaded = false;
		$scope.pages = [];

		articlesService.readPaginationConfig($http, $q, $sce)
		.then(function(response) {
			pageConfig = response;

			if($stateParams.pageNumber !== undefined)
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
		$translate,
		$compile
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
		'$translate',
		'$compile'
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
		self.postsEmplacement = '/blog/content/posts/posts.json';

		self.setPostsEmplacement = function(postsEmplacement)
		{
			self.postsEmplacement = postsEmplacement;
		};

		// Default folder where i can find the pagination.json file.
		self.paginationConfigEmplacement = '/blog/content/posts/pagination.json';

		self.setPaginationConfigEmplacement = function(paginationConfigEmplacement)
		{
			self.paginationConfigEmplacement = paginationConfigEmplacement;
		};

		self.PaginationConfig = {};

		self.$get = function() {
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
						console.log('articlesServiceProvider::$get::getAll error(' + error + ')');

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
(function (angular) {
	'use strict';

	/*
	 * Get the app module.
	 */
	var appModule = angular.module('app');
	
	/*
	 * Flickr Controller.
	 */
	var flickrController = function(
		$scope,
		$http,
		$q,
		$sce,
		flickrService,
		$cookies
    ) {
		$scope.imgs = [];
		$scope.imgsLoaded = false;

		try
		{
			var flickrPhotos = $cookies.get('flickr-photos');
			if(flickrPhotos === '' || flickrPhotos === undefined)
			{
				flickrService.get($http, $q, $sce)
				.then(function(flickrObj) {
					$scope.username = flickrObj.username;
					$scope.imgs = flickrObj.photos;
					$scope.imgsLoaded = true;

					flickrPhotos = {
						lastUpdated: Date.now(),
						photos: flickrObj.photos,
						username: flickrObj.username
					};
					$cookies.put('flickr-photos', JSON.stringify(flickrPhotos));
				});
			}
			else
			{
				flickrPhotos = JSON.parse(flickrPhotos);
				var now = Date.now();
				if(flickrPhotos.lastUpdated + 30 * 1000 > now)
				{
					flickrService.get($http, $q, $sce)
					.then(function(flickrObj) {
						$scope.username = flickrObj.username;
						$scope.imgs = flickrObj.photos;
						$scope.imgsLoaded = true;

						flickrPhotos.lastUpdated = now;
						flickrPhotos.photos = flickrObj.photos;
						flickrPhotos.username = flickrObj.username;
						$cookies.put('flickr-photos', JSON.stringify(flickrPhotos));
					});
				}
				else
				{
					$scope.username = flickrPhotos.username;
					$scope.imgs = flickrPhotos.photos;
					$scope.imgsLoaded = true;
				}
			}
		}
		catch(error)
		{
			console.log('flickrComponent::flickrController::Error (' + error + ')');
			$scope.imgsLoaded = false;
		}		
	};

	/*
	 * Inject depencencies to your controller.
	 */
	flickrController.$inject = [
		'$scope',
		'$http',
		'$q',
		'$sce',
		'flickrService',
		'$cookies'
	];

	/*
	 * Creation of an articles ng component object.
	 */
	 var flickrComponent = {
	 	controller: flickrController,
	 	templateUrl: '/app/flickr/flickr.list.html'
	 };

	/*
     * Inject your new component to app.
	 */
	appModule.component('flickrComponent', flickrComponent);

})(window.angular);
(function (angular) {
	'use strict';

	/*
	 * Get the app module.
	 */
	var appModule = angular.module('app');
	
	/*
	 * Create an Flickr Provider.
	 */
	var flickrServiceProvider = function()
	{
		var self = this;

		self.apiKey = null;
		self.userId = null;
		self.username = null;
		self.maxPhotos = 5;

		self.setFlickrApiKey = function(apiKey)
		{
			self.apiKey = apiKey;
		};
		self.setFlickrUserId = function(userId)
		{
			self.userId = userId;
		};
		self.setFlickrUsername = function(username)
		{
			self.username = username;
		};
		self.setMaxPhotos = function(maxPhotos)
		{
			self.maxPhotos = maxPhotos;
		};

		self.$get = function() {
			return {
				get: function($http, $q, $sce)
				{
					var error = false;

					if(self.apiKey === null)
					{
						console.log('flickrServiceProvider::$get::get no api key specified');
						error = true;
					}

					if(self.userId === null)
					{
						console.log('flickrServiceProvider::$get::get no user id specified (use : http://idgettr.com/)');
						error = true;
					}

					if(self.username === null)
					{
						console.log('flickrServiceProvider::$get::get no username specified');
						error = true;
					}

					if(error)
					{
						return;
					}

					// Promise.
					var defer = $q.defer();

					$http.get('https://api.flickr.com/services/rest/?api_key=' + self.apiKey + '&nojsoncallback=1&format=json&user_id=' + self.userId + '&method=flickr.people.getPublicPhotos&per_page=' + self.maxPhotos)
					.success(function(response) {
						var flickrObj = {
							username: self.username,
							photos: []
						};

						for (var j = response.photos.photo.length - 1; j >= 0; j--)
						{
							var curPhoto = response.photos.photo[j];
							// https://farm6.staticflickr.com/5566/30797468755_95e65ae1b6.jpg
							
							var url = 
								'https://farm' + curPhoto.farm + 
								'.staticflickr.com/' + curPhoto.server + 
								'/' + curPhoto.id + 
								'_' + curPhoto.secret + '_q.jpg';
							
							var publicUrl = 
								'https://www.flickr.com/photos/' + self.username + 
								'/' + curPhoto.id + '/in/dateposted-public/';

							flickrObj.photos.push({ 
								title: curPhoto.title,
								url: url,
								publicUrl: publicUrl
							});
						}

						defer.resolve(flickrObj);
					})
					.error(function(error) {
						console.log('flickrServiceProvider::$get::get error(' + error + ')');

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
	appModule.provider('flickrService', flickrServiceProvider);

})(window.angular);