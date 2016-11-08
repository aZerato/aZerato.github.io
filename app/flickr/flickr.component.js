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
		flickrService
    ) {
		$scope.imgs = [];
		$scope.imgsLoaded = false;

		flickrService.get($http, $q, $sce)
        .then(function(flickrObj) {
			$scope.username = flickrObj.username;
            $scope.imgs = flickrObj.photos;
            $scope.imgsLoaded = true;
        });
	};

	/*
	 * Inject depencencies to your controller.
	 */
	flickrController.$inject = [
		'$scope',
		'$http',
		'$q',
		'$sce',
		'flickrService'
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