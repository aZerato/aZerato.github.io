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