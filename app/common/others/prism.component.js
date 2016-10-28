(function (angular) {
	'use strict';

	var appModule = angular.module('app');

	/*
	 * 
	 */
	var prismController = function (
		$scope,
		$element
	) 
	{
		$scope.$evalAsync(function() { 
			var prismEl = $element[0].getElementsByTagName('pre')[0].getElementsByTagName('code')[0];

			Prism.highlightElement(prismEl);
		});
	};

	prismController.$inject = [
		'$scope',
		'$element'
	];

	/*
	 * 
	 */
	var prismComponent = {
		bindings: {
			class: '@'
		},
		transclude: true,
		controller: prismController,
		template: '<pre class="{{$ctrl.class}}"><code ng-transclude></code></pre>'
	};

	appModule.component('prismComponent', prismComponent);

}(window.angular));