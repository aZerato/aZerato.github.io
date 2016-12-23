(function (angular) {
	'use strict';

	/*
	 * Get the app module.
	 */
	var appModule = angular.module('app');
	
	/*
	 * Controller.
	 */
	var headerController = function(
		$rootScope,
		$translate,
		$cookies,
		$state)
	{
		var self = this;

		self.$onInit = function() {
			self.$state = $state;
		};		

		self.changeLang = function(key) {
			$translate.use(key);
			$rootScope.currentLang = key;
			
			if($rootScope.acceptCookies == true)
			{
				$cookies.put('favLang', key);
			}			
		};
	};

	/*
	 * Injection.
	 */
	headerController.$inject = [
		'$rootScope',
		'$translate',
		'$cookies',
		'$state'
	];

	/*
	 * Component.
	 */
	var headerComponent = {
		controller: headerController,
		templateUrl: '/app/common/header/header.html'
	};

	
	appModule.component('headerComponent', headerComponent);

}(window.angular));