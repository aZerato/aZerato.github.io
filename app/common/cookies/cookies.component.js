(function (angular) {
	'use strict';

	var appModule = angular.module('app');

	/*
	 * Cookies Controller.
	 */
	var cookiesController = function(
		$rootScope,
		$translate,
		$cookies
	) {
		var self = this;

		self.$onInit = function()
		{
			self.state = $rootScope.acceptCookies;
		};		
		
		self.validCookiesSub = function()
		{
			self.state = true;
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