'use strict';
angular.module('userModule')
    .controller('NavbarCtrl', ['$rootScope', '$scope', 'AUTH_EVENTS', 'AuthService', function ($rootScope, $scope, AUTH_EVENTS, AuthService) {
        $scope.user = {};
        $scope.isAuth = AuthService.isAuthenticated();

        $rootScope.$on(AUTH_EVENTS.loginSuccess, function(ev, response){
            $scope.isAuth = AuthService.isAuthenticated();
            $scope.getUser();
        });
        $rootScope.$on(AUTH_EVENTS.logoutSuccess, function(ev, response){
            $scope.isAuth = AuthService.isAuthenticated();
            $scope.getUser();
        });

        $scope.getUser = function() {
            AuthService.getUser().then(function(user){
                $scope.user = user;
            }).catch(function(){
                $scope.user = {};
            });
        };

        $scope.getUser();
    }]);
