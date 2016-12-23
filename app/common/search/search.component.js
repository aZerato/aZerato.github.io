(function (angular) {
	'use strict';

	var appModule = angular.module('app');

	/*
	 * Search Controller.
	 */
	var searchController = function(
		$rootScope
	) {
		var self = this;
		self.searchForm = false;
		
		self.$onInit = function()
		{
			self.$body = $('body');
		};

		self.research = function()
		{
			self.searchForm = true;
			window.scrollTo(0, 0);
			self.$body.css({'overflow': 'hidden'});
		};

		self.hideResearch = function()
		{
			self.searchForm = false;
			self.$body.css({'overflow': 'inherit'});
		};
	};

	/*
	 * Injections.
	 */
	searchController.$inject = [
		'$rootScope'
	];

	/*
	 * Search Component.
	 */
	var searchComponent = {
		controller: searchController,
		templateUrl: '/app/common/search/search.html'
	};

	appModule.component('searchComponent', searchComponent);

}(window.angular));