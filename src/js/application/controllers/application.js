'use strict';
angular.module('application')
    .controller('ApplicationCtrl', ['$translate', '$rootScope', '$scope', 'TeamRepository', 'AUTH_EVENTS', 'AuthService', 'growl',  function ($translate, $rootScope, $scope, TeamRepository, AUTH_EVENTS, AuthService, growl ) {
    var app = this;

    app.teamCount = 0;

    // count teams for demo:
    app.teamCollection = TeamRepository.getList().then(function(response){
        app.teamCount = response.data.length;
        app.teamCollection = response.data;
        return app.teamCollection;
    });

    // refresh teamCount on time:
    $scope.$watch(angular.bind(app, function (teamCount) {
        return app.teamCount;
    }), function(newCount){
        app.teamCount = newCount;
    });


    /**
     * Handle user state
     */
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

    $rootScope.$on(AUTH_EVENTS.notAuthorized, function(event, action){
        growl.error('Not authorized access', {ttl: 3000});
    });
    $rootScope.$on(AUTH_EVENTS.notAuthenticated, function(event, action){
        growl.error('Require authentification', {ttl: 3000});
    });




}]);
