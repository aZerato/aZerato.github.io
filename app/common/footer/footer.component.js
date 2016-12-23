(function (angular) {
	'use strict';

	var appModule = angular.module('app');

	/*
	 * Controller.
	 */
	var footerController = function(
		$rootScope
	) {
		var self = this;

		self.$onInit = function()
		{
			this.acceptCookies = $rootScope.acceptCookies;
		};
	};

	/*
	 * Injections.
	 */
	footerController.$inject = [
		'$rootScope'
	];

	/*
	 * Component.
	 */
	var footerComponent = {
		controller: footerController,
		templateUrl: '/app/common/footer/footer.html'
	};

	appModule.component('footerComponent', footerComponent);

}(window.angular));