'use strict';
angular.module('userModule')
    .controller('LogoutCtrl', ['AuthService', 'growl', function (AuthService, growl) {
        if (!AuthService.isAuthenticated()) {
            return;
        }
        AuthService.logout()
            .then(function () {
                growl.success('You have been logged out', {ttl: 3000});
            });
    }]);
