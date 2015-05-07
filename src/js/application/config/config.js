/**
 * Application Configuration
 */
'use strict';
angular.module('application')
    .config([

        '$breadcrumbProvider',
        '$urlRouterProvider',
        '$locationProvider',
        'growlProvider',
        'Modernizr',
        '_',
        function(
            $breadcrumbProvider,
            $urlRouterProvider,
            $locationProvider,
            growlProvider,
            Modernizr,
            _) {

            growlProvider.globalDisableCountDown(true);
            $breadcrumbProvider.setOptions({
                includeAbstract: false,
                //prefixStateName: 'home',
                template: 'bootstrap3'
            });
            $urlRouterProvider.otherwise('/');
            if (Modernizr.history) {
                $locationProvider.html5Mode(true);
            }
        }]);
