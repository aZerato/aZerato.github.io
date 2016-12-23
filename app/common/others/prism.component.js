(function (angular) {
	'use strict';

	var appModule = angular.module('app');

	/*
	 * Controller.
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

	/*
	 * Injection.
	 */
	prismController.$inject = [
		'$scope',
		'$element'
	];

	/*
	 * Component. 
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