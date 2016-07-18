(function (angular) {
	'use strict';

	/*
	 * Get the app module.
	 */
	var appModule = angular.module('app');
	
	/*
	 * 
	 */
	var paginationController = function(
		$scope)
	{
		$scope.changePage = function(key) {
			$translate.use(key);
			$rootScope.currentLang = key;
			$cookies.put('favLang', key);
		};
	};

	/*
	 * 
	 */
	paginationController.$inject = [
		'$scope'
	];

	/*
	 * 
	 */
	var paginationComponent = {
		controller: paginationController,
		templateUrl: '/app/common/pagination/pagination.html'
	};

	
	appModule.component('paginationComponent', paginationComponent);

}(window.angular));