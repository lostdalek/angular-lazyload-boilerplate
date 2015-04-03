'use strict';
angular.module('playerModule')
    .config(['$stateProvider', '$urlRouterProvider', 'USER_ROLES', function($stateProvider, $urlRouterProvider, USER_ROLES) {

        $stateProvider
            .state('app.player.list', {
                url: '/list',
                ncyBreadcrumb: {
                    label: 'Player list'
                },
                controller: 'PlayerListCtrl',
                authorizedRoles: USER_ROLES.logguedIn,
                templateProvider: ['$templateCache', function($templateCache){
                    return $templateCache.get('playerModule/tpl/list.html');
                }],
                data: {
                    authorizedRoles: USER_ROLES.superAdmin,
                    onAuthorizationFailure: function($state) {
                        $state.go('app');
                    }
                },
                resolve: {
                    /*isAuthorized: ['$q', '$state', 'AuthService', function($q, $state, AuthService) {
                        return AuthService.isAuthorizedRole(USER_ROLES.superAdmin).catch(function(){
                            $state.go('app');
                            return false;
                        });
                    }]*/
                }
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
    }]);
