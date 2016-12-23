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
			var expireDate = new Date();
			expireDate.setMonth(expireDate.getMonth() + 5);
			$cookies.put('acceptCookies', true, {'expires': expireDate });
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