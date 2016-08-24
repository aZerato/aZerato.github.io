(function (angular) {
	'use strict';

	/*
	 * Get the app module.
	 */
	var appModule = angular.module('app');
	
	/*
	 * 
	 */
	var headerController = function(
		$rootScope,
		$scope,
		$translate,
		$cookies,
		$state)
	{
		$scope.$state = $state;

		$scope.changeLang = function(key) {
			$translate.use(key);
			$rootScope.currentLang = key;
			$cookies.put('favLang', key);
		};
	};

	/*
	 * 
	 */
	headerController.$inject = [
		'$rootScope',
		'$scope',
		'$translate',
		'$cookies',
		'$state'
	];

	/*
	 * 
	 */
	var headerComponent = {
		controller: headerController,
		templateUrl: '/app/common/header/header.html'
	};

	
	appModule.component('headerComponent', headerComponent);

}(window.angular));