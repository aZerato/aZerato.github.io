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
		$http,
		$q,
		$sce,
		flickrService,
		$cookies
    ) {
		var self = this;
		
		self.$onInit= function()
		{
			self.imgs = [];
			self.imgsLoaded = false;

			try
			{
				var flickrPhotos = $cookies.get('flickr-photos');
				if(flickrPhotos === '' || flickrPhotos === undefined)
				{
					flickrService.get($http, $q, $sce)
					.then(function(flickrObj) {
						self.username = flickrObj.username;
						self.imgs = flickrObj.photos;
						self.imgsLoaded = true;

						flickrPhotos = {
							photos: flickrObj.photos,
							username: flickrObj.username
						};

						if(self.useCookies)
						{
							var expireDate = new Date();
							expireDate.setMinutes(expireDate.getMinutes() + 5);
							$cookies.put('flickr-photos', JSON.stringify(flickrPhotos), {'expires': expireDate});
						}
					});
				}
				else
				{
					self.username = flickrPhotos.username;
					self.imgs = flickrPhotos.photos;
					self.imgsLoaded = true;
				}
			}
			catch(error)
			{
				console.log('flickrComponent::flickrController::Error (' + error + ')');
				self.imgsLoaded = false;
			}
		};

	};

	/*
	 * Inject depencencies to your controller.
	 */
	flickrController.$inject = [
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
		bindings: {
			useCookies: '='
		},
	 	controller: flickrController,
	 	templateUrl: '/app/flickr/flickr.list.html'
	 };

	/*
     * Inject your new component to app.
	 */
	appModule.component('flickrComponent', flickrComponent);

})(window.angular);