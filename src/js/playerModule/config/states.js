'use strict';
angular.module('playerModule')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('app.player.list', {
                url: '/list',
                ncyBreadcrumb: {
                    label: 'Player list'
                },
                controller: 'PlayerListCtrl',
                templateProvider: ['$templateCache', function($templateCache){
                    return $templateCache.get('playerModule/tpl/list.html');
                }]
            })
            // nested list with just some random string data
            .state('app.player.add', {
                url: '/add',
                ncyBreadcrumb: {
                    label: 'Player Add'
                },
                controller: 'PlayerAddCtrl',
                templateProvider: ['$templateCache', function($templateCache){
                    return $templateCache.get('playerModule/tpl/edit.html');
                }]
            })
            .state('app.player.edit', {
                url: '/edit/{id}',
                ncyBreadcrumb: {
                    label: 'Player Edit'
                },
                controller: 'PlayerEditCtrl',
                templateProvider: ['$templateCache', function($templateCache){
                    return $templateCache.get('playerModule/tpl/edit.html');
                }],
                resolve: {
                    playerObj: ['$stateParams', 'PlayerRepository', function($stateParams, PlayerRepository){
                        // return object with additionnal config/header/etc...
                        return PlayerRepository.get($stateParams.id).then(function (data) {
                            return data;
                        });
                    }]
                }
            })
            .state('app.player.view', {
                url: '/{id}',
                ncyBreadcrumb: {
                    label: 'Player View'
                },
                templateUrl: 'playerModule/tpl/view.html',
                controller: 'PlayerViewCtrl',
                templateProvider: ['$templateCache', function($templateCache){
                    return $templateCache.get('playerModule/tpl/view.html');
                }],
                resolve: {
                    playerObj: ['$stateParams', 'PlayerRepository', function($stateParams, PlayerRepository){
                        // return object with additionnal config/header/etc...
                        return PlayerRepository.get($stateParams.id).then(function (data) {
                            return data;
                        });
                    }]
                }
            });
        //$urlRouterProvider.when('/player', '/player/list');
    }]);
