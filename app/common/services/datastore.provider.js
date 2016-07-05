(function (angular) {
	'use strict';

	/*
	 * Get the contacts module.
	 */
	var appModule = angular.module('app');
	
	/*
	 * Creation an instance an dataStore.
	 */
	var dataStoreProvider = function()
	{
		// default type.
		this.type = 'localStorage';

		this.$get = function() {
			var type = this.type;
			return {
				set: function(key, data)
				{
					window[type].setItem(key, JSON.stringify(data));
				},
				get: function(key)
				{
					return JSON.parse(window[type].getItem(key));
				}
			};
		};

		this.setType = function(type)
		{
			this.type = type;
		};
	};

	/*
     * Inject your new provider to module.
     * Provider and service are really nearly : Provider <= factory <= service.
	 */
	appModule.provider('dataStore', dataStoreProvider);

})(window.angular);