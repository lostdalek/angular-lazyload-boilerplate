'use strict';
angular.module('teamModule')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app.team.list', {
                url: '/list',
                //templateUrl: 'teamModule/tpl/list.html',
                controller: 'TeamListCtrl',
                ncyBreadcrumb: {
                    label: 'Team List'
                },
                templateProvider: ['$templateCache', function($templateCache){
                    return $templateCache.get('teamModule/tpl/list.html');
                }]
            })
            // nested list with just some random string data
            .state('app.team.add', {
                url: '/add',
                controller: 'TeamAddCtrl',
                ncyBreadcrumb: {
                    label: 'Team Add'
                },
                templateProvider: ['$templateCache', function($templateCache){
                    return $templateCache.get('teamModule/tpl/edit.html');
                }]
            })
            .state('app.team.edit', {
                url: '/edit/{id}',
                controller: 'TeamEditCtrl',
                ncyBreadcrumb: {
                    label: 'Team Edit'
                },
                templateProvider: ['$templateCache', function($templateCache){
                    return $templateCache.get('teamModule/tpl/edit.html');
                }],
                resolve: {
                    teamObj: ['$stateParams', 'TeamRepository', function($stateParams, TeamRepository){
                        // return object with additionnal config/header/etc...
                        return TeamRepository.get($stateParams.id).then(function (data) {
                            return data;
                        });
                    }]
                }
            })
            .state('app.team.view', {
                url: '/{id}',
                controller: 'TeamViewCtrl',
                ncyBreadcrumb: {
                    label: 'Team View'
                },
                templateProvider: ['$templateCache', function($templateCache){
                    return $templateCache.get('teamModule/tpl/view.html');
                }],
                resolve: {
                    teamObj: ['$stateParams', 'TeamRepository', function($stateParams, TeamRepository){
                        // return object with additionnal config/header/etc...
                        return TeamRepository.get($stateParams.id).then(function (data) {
                            return data;
                        });
                    }]
                }
            });
        //$urlRouterProvider.when('/team', '/team/list');
    }]);
