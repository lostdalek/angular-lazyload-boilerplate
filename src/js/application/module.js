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
    ]);

