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