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
			$scope,
			$state, 
			$translate,
			$cookies)
		{
			$scope.changeLang = function(key) {
				$translate.use(key);
				$scope.currentLang = key;
				$cookies.put('favLang', key);
			};

			// define default lang
			var keyLang = $cookies.get('favLang');
			if(keyLang)
			{
				$scope.currentLang = keyLang;
				$translate.use(keyLang);
			}
			else
			{
				$scope.currentLang = $translate.use(); // return 'en', default value setted in app.config.js.
			}

			$cookies.put('favLang', $scope.currentLang);
	};

	/*
	 * 
	 */
	headerController.$inject = [
		'$scope', 
		'$state',
		'$translate',
		'$cookies'
	];

	/*
	 * 
	 */
	var headerComponent = {
		controller: headerController,
		templateUrl: './app/common/header/header.html'
	};

	
	appModule.component('headerComponent', headerComponent);

}(window.angular));