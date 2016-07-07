(function (angular) {
	'use strict';

	var appModule = angular.module('app');

	/*
	 * 
	 */
	var footerController = function() {
		
	};

	/*
	 * 
	 */
	var footerComponent = {
		controller: footerController,
		templateUrl: '/app/common/footer/footer.html'
	};

	appModule.component('footerComponent', footerComponent);

}(window.angular));