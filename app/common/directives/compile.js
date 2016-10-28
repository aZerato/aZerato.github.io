(function (angular) {
	'use strict';

	var appModule = angular.module('app');

	appModule.directive('compile', ['$compile', function ($compile) {
        return function(scope, element, attrs) {
            scope.$watch(
                function(scope) {
                    return scope.$eval(attrs.compile);
                },
                function(value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                }
            )
        }
    }]);

}(window.angular));