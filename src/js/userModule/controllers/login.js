'use strict';
angular.module('userModule')
    .controller('LoginCtrl', ['$scope', 'growl', 'AuthService', '$translate', function ($scope, growl, AuthService, $translate) {
        $scope.login = function () {
            AuthService.login({email: $scope.email, password: $scope.password})
                .then(function () {
                    growl.success('You have successfully logged in', {ttl: 3000});
                })
                .catch(function (response) {
                    growl.error($translate( response.data.message), {ttl: 3000});
                });
        };
        $scope.authenticate = function (provider) {
            AuthService.authenticate(provider)
                .then(function () {
                    growl.success('You have successfully logged in', {ttl: 3000});
                })
                .catch(function (response) {
                    growl.error(response.data ? response.data.message : response, {ttl: 3000});
                });
        };
    }]);
