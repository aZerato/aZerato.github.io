(function (angular) {
	'use strict';

	var appModule = angular.module('app');

	/*
	 * 
	 */
	var footerController = function() {
		return null:
	};

	/*
	 * 
	 */
	var footerComponent = {
		controller: footerController,
		templateUrl: './app/common/footer/footer.html'
	};

	appModule.component('footer', footerComponent);

}(window.angular));