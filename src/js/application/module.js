/**
 * Application Component
 */
'use strict';

angular.module('application', [
    'ui.router',
    'ct.ui.router.extras',
    'oc.lazyLoad',
    'oc.lazyLoad.uiRouterDecorator',
    'pascalprecht.translate',
    'ui.bootstrap',
    'angular-growl',
    'smart-table',
    'restangular',
    'ngCookies',
    'components',
    'cgBusy',
    'ncy-angular-breadcrumb',
    'schemaForm',
    'ngMessages',
    'ngStorage'
    ])
    .run([
        '$rootScope',
        '$state',
        '$stateParams',
        '$timeout',
        '$window',
        '$location',

        function ($rootScope, $state, $stateParams, $timeout, $window, $location) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ])
    .controller('ApplicationCtrl', ['$translate', '$scope', 'TeamRepository',   function ($translate, $scope, TeamRepository ) {
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
    }]);
