'use strict';
angular.module('playerModule')
    .config(['$translateProvider', 'appConfigProvider', function ($translateProvider, appConfigProvider) {
        $translateProvider
            .translations('en', {
                playerTitle: 'Player',
                crudAddPlayer: 'Add Player',
                crudEditPlayer: 'Edit Player',
                crudViewPlayer: 'View Player'
            });
        $translateProvider.preferredLanguage(appConfigProvider.getLocale());
    }]);
