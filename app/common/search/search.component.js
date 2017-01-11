(function (angular) {
	'use strict';

	var appModule = angular.module('app');

	/*
	 * Search Controller.
	 */
	var searchController = function(
		$rootScope,
		$translate,
		$http,
		$q,
		$sce,
		articlesService
	) {
		var self = this;
		self.searchForm = false;
		self.noResult = false;

		self.$onInit = function()
		{
			self.$input = $('.cst-search-form-input');
		};

		self.research = function()
		{
			self.searchForm = true;
			window.scrollTo(0, 0);

			setInterval(function() { self.$input.focus(); }, 500);
		};

		self.search = function() {
			self.articles = [];
			self.noResult = false;
			self.searchRequirements = false;

			if(self.stringSearch != undefined && self.stringSearch.trim() != '' && self.stringSearch.length > 2)
			{
				articlesService.search(self.stringSearch.toLowerCase(), $rootScope.currentLang, $http, $q, $sce)
				.then(function(response) {
					if(response.length > 0)
					{
						articlesService.getAllBySearchObject(response, $http, $q, $sce)
						.then(function(finalResponse)
						{
							self.articles = finalResponse;
						});					
					}
					else
					{
						self.noResult = true;
					}
				});
			}
			else
			{
				self.searchRequirements = true;
			}
		};

		self.hideResearch = function()
		{
			self.searchForm = false;
		};
	};

	/*
	 * Injections.
	 */
	searchController.$inject = [
		'$rootScope',
		'$translate',
		'$http',
		'$q',
		'$sce',
		'articlesService'
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