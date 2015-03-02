'use strict';
angular.module('teamModule')
    .config(['$translateProvider', 'appConfigProvider', function ($translateProvider, appConfigProvider) {
        $translateProvider
            .translations('en', {
                teamTitle: 'Team',
                crudAddTeam: 'Add Team',
                crudEditTeam: 'Edit Team',
                crudViewTeam: 'View Team'
            });
        $translateProvider.preferredLanguage(appConfigProvider.getLocale());
    }]);
