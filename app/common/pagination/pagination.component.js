(function (angular) {
	'use strict';

	/*
	 * Get the main app module.
	 */
	var appModule = angular.module('app');
	
	/*
	 * Pagination controller creation.
	 */
	var paginationController = function(
		$state
	)
	{
		this.$state = $state;
		
		this.changePage = function(pageNumber)
		{
			$state.go(this.ref, {"pageNumber": pageNumber});
		};
	};

	/*
	 * Dependency injection.
	 */
	paginationController.$inject = [
		'$state'
	];

	/*
	 * Pagination component creation.
	 * @ : get directly text value
	 * = : able to get object value
	 */
	var paginationComponent = {
		bindings: {
			ref: '@',
			pagesArray: '='
		},
		controller: paginationController,
		templateUrl: '/app/common/pagination/pagination.html'
	};

	/*
	 * Add to main app module the new pagination component.
	 */
	appModule.component('paginationComponent', paginationComponent);

}(window.angular));