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

		self.userId = null;
		self.apiKey = null;

		self.setFlickrApiKey = function(apiKey)
		{
			self.apiKey = apiKey;
		};
		self.setFlickrUserId = function(userId)
		{
			self.userId = userId;
		};

		self.$get = function() {
			return {
				get: function($http, $q, $sce)
				{
					var error = false;

					if(self.apiKey == null)
					{
						console.log('flickrServiceProvider::$get::get no api key specified');
					}

					if(self.userId == null)
					{
						console.log('flickrServiceProvider::$get::get no user id specified');
					}

					if(error)
					{
						return;
					}

					// Promise.
					var defer = $q.defer();

					$http.get('https://api.flickr.com/services/rest/?api_key=' + self.apiKey + '&nojsoncallback=1&format=json&user_id=' + self.userId + '&method=flickr.people.getPublicPhotos&per_page=9')
					.success(function(response) {
						var photos = [];

						defer.resolve(response);
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