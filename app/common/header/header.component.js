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
			
			// scroll bar change color.
			self.$el = $('.cst-header');
			self.scrollStart = 0;
			self.$elLimit = $('.cst-container-articles');
			self.limitOffset = self.$elLimit.offset();
			if (self.$elLimit.length)
			{
				var offset = self.$elLimit.offset();
				$(document).scroll(function() {
					if (self.$state.is('root.articles'))
					{
						self.scrollStart = $(this).scrollTop();
						if(self.scrollStart > self.limitOffset.top)
						{
							self.$el.addClass('header-color');
						} 
						else
						{
							self.$el.removeClass('header-color');
						}
					}
				});
			}
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