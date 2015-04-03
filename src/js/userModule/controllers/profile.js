'use strict';
angular.module('userModule')
    .controller('ProfileCtrl', ['$scope', '$auth', 'growl', 'UserRepository', 'authenticatedUser', '_',  function ($scope, $auth, growl, UserRepository, authenticatedUser, _) {

        var userProfile = {};
        var originalModel = angular.copy(authenticatedUser);
        $scope.user = originalModel;

        /**
         * Get user's profile information.
         */
        $scope.getProfile = function () {
            UserRepository.get().then(function (response) {
                userProfile = response;
                $scope.user = originalModel = angular.copy(userProfile.data);
                return originalModel;
            }, function(error){
                growl.error(error.message, {ttl: 3000});
            });
        };


        /**
         * Update user's profile information.
         */
        $scope.updateProfile = function () {

            _.extend(userProfile.data, {
                displayName: $scope.user.displayName,
                email: $scope.user.email
            });
            userProfile.data.put().then(function (response) {
                growl.success('Profile has been updated', {ttl: 3000});
            });
        };

        /**
         * Link third-party provider.
         */
        $scope.link = function (provider) {
            $auth.link(provider)
                .then(function () {
                    growl.success('You have successfully linked ' + provider + ' account', {ttl: 3000});
                })
                .then(function () {
                    $scope.getProfile();
                })
                .catch(function (response) {
                    growl.error(response.data.message, {ttl: 3000});
                });
        };

        /**
         * Unlink third-party provider.
         */
        $scope.unlink = function (provider) {
            $auth.unlink(provider)
                .then(function () {
                    growl.success('You have successfully unlinked ' + provider + ' account', {ttl: 3000});
                })
                .then(function () {
                    $scope.getProfile();
                })
                .catch(function (response) {
                    growl.error(response.data.message, {ttl: 3000});
                });
        };

        $scope.getProfile();

    }]);
