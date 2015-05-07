'use strict';
angular.module('application')
    .config(['$translateProvider', 'appConfigProvider', function ($translateProvider, appConfigProvider) {
        $translateProvider
            .translations('en', {
                appName: 'Angular Lazy Load Module Sample',
                crudCreateSuccess: 'Successfully Created!',
                crudCreateFailure: 'failed to create resource',
                crudUpdateSuccess: 'Successfully edited!',
                crudUpdateFailure: 'failed to edit'

            });
        $translateProvider.preferredLanguage(appConfigProvider.getLocale());
    }]);
