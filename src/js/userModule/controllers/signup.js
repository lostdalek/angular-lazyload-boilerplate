'use strict';
angular.module('userModule')
    .controller('SignupCtrl', ['$scope', 'growl', '$auth', 'AuthService', '$translate', function ($scope, growl, $auth, AuthService, $translate) {
        $scope.signup = function () {
            $auth.signup({
                displayName: $scope.displayName,
                email: $scope.email,
                password: $scope.password
            }).then(function(){
                AuthService.login({
                    email: $scope.email,
                    password: $scope.password
                }).then(function () {
                    growl.success('You have successfully logged in', {ttl: 3000});
                })
                .catch(function (response) {
                    growl.error($translate( response.data.message), {ttl: 3000});
                });
            })
            .catch(function (response) {
                if (typeof response.data.message === 'object') {
                    angular.forEach(response.data.message, function (message) {
                        growl.error(message[0], {ttl: 3000});
                    });
                } else {
                    growl.error(response.data.message, {ttl: 3000});
                }
            });
        };
    }]);
