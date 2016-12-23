(function (angular) {
	'use strict';

	var appModule = angular.module('app');

	/*
	 * Cookies Controller.
	 */
	var cookiesController = function(
		$scope,
		$rootScope,
		$translate,
		$cookies
	) {
		$scope.state = $rootScope.acceptCookies;
		
		$scope.validCookiesSub = function()
		{
			$scope.state = true;
			$rootScope.acceptCookies = true;
			$cookies.put('acceptCookies', true);
		};
	};

	/*
	 * Injections.
	 */
	cookiesController.$inject = [
		'$scope',
		'$rootScope',
		'$translate',
		'$cookies'
	];

	/*
	 * Cookies Component.
	 */
	var cookiesComponent = {
		controller: cookiesController,
		templateUrl: '/app/common/cookies/cookies.html'
	};

	appModule.component('cookiesComponent', cookiesComponent);

}(window.angular));