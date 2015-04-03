/**
 * Application Providers
 * must be loaded before configuration
 */
'use strict';
angular.module('application')

    .provider('OnDemandStateService', ['appConfigProvider', '_', 'USER_ROLES', function (appConfigProvider, _, USER_ROLES) {

        // init configuration with the default context:
        var appConfig = appConfigProvider.setContextConfiguration();
        var basePath = appConfig['basePath'];
        var ALL_USER_ROLES = _.map(USER_ROLES, function(v,k){return v;});
        // define placeholder for resolvable States:
        var modulesDefinition = {
                application: {
                    name: 'application',
                    files: [basePath+'application/application.js'],
                    loaded: true
                },
                user: {
                    name: 'userModule',
                    files: [basePath+'userModule/userModule.js']
                },
                team: {
                    name: 'teamModule',
                    files: [basePath+'teamModule/teamModule.js']
                },
                player: {
                    name: 'playerModule',
                    files: [basePath+'playerModule/playerModule.js']
                }
            };
        var routeStates = {
            'app': {
                stateDef: {
                    url: '/',
                    controller: 'ApplicationCtrl as application',
                    templateProvider: ['$templateCache', function($templateCache){
                        return $templateCache.get('application/tpl/layout.html');
                    }],
                    ncyBreadcrumb: {
                        label: 'Home page'
                    },
                    data: {
                        authorizedRoles: ALL_USER_ROLES
                    },
                    resolve: {
                        /*isAuthorized: function($q, AuthService) {
                            return AuthService.isAuthorizedRole(ALL_USER_ROLES).catch(function(){
                                console.log('not authorized!!!')
                            });
                        },*/
                        // Team Module is preloaded Here:
                        loadModule: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load(['teamModule', 'userModule']);
                        }]
                    }
                    // no lazyModule/lazyFile/lazyTemplateUrl as it's already loaded
                },
                // already loaded
                futureStateDef: {}
            },
            'app.user': {
                stateDef: {
                    url: '^/user',
                    abstract: true,
                    lazyModule: modulesDefinition.user.name,
                    lazyFiles: modulesDefinition.user.files,
                    lazyTemplateUrl: 'userModule/tpl/main.html',
                    templateProvider: ['$templateCache', function ($templateCache) {
                        return $templateCache.get('userModule/tpl/main.html');
                    }],
                    ncyBreadcrumb: {
                        label: 'User'
                    }
                },
                futureStateDef: {
                    'stateName': 'app.user',
                    'urlPrefix': '/user',
                    'type': 'ocLazyLoad',
                    'module': modulesDefinition.user.name
                }
            },
            'app.team': {
                stateDef: {
                    url: '^/team',
                    abstract: true,
                    templateProvider: ['$templateCache', function($templateCache){
                        return $templateCache.get('teamModule/tpl/main.html');
                    }],
                    lazyModule: modulesDefinition.team.name,
                    lazyFiles: modulesDefinition.team.files,
                    lazyTemplateUrl: 'teamModule/tpl/main.html',
                    ncyBreadcrumb: {
                        label: 'Team'
                    },
                    resolve: {}
                },
                futureStateDef: {
                    'stateName': 'app.team',
                    'urlPrefix': '/team',
                    'type': 'ocLazyLoad',
                    'module': modulesDefinition.team.name
                }
            },
            'app.player': {
                stateDef: {
                    url: '^/player',
                    abstract: true,
                    lazyModule: modulesDefinition.player.name,
                    lazyFiles: modulesDefinition.player.files,
                    lazyTemplateUrl: 'playerModule/tpl/main.html',
                    controller: 'PlayerCtrl',
                    ncyBreadcrumb: {
                        label: 'Player'
                    }
                },
                futureStateDef: {
                    'stateName': 'app.player',
                    'urlPrefix': '/player',
                    'type': 'ocLazyLoad',
                    'module': modulesDefinition.player.name
                }
            }
        };

        var getAppStates = function() {
            var appStates = [];
            // retrieve all futureStateDef
            angular.forEach(routeStates, function(route){
                var appState = route['futureStateDef'];
                if( _.isEmpty(appState) === false) {
                    appStates.push(appState);
                }
            });
            return appStates;
        };

        return {
            $get: function() {
                return this;
            },
            provideNavigation: function() {

            },
            getModuleStateConfiguration: function(){
                // generate object:
                var moduleStateConfiguration = {
                    debug: true,
                    loadedModules: [], // push name string
                    modules: [] //push object {name: '', files: []}
                };
                // search for preloaded modules:
                angular.forEach(modulesDefinition, function(module){
                    if( module.loaded === undefined ) {
                        module.loaded = false;
                    }

                    if( module.loaded === true) {
                        moduleStateConfiguration.loadedModules.push(
                            module.name
                        );
                    } else {
                        moduleStateConfiguration.modules.push({
                            'name': module.name,
                            'files': module.files
                        });
                    }
                });

                return moduleStateConfiguration;
            },
            /**
             * Inject route states on module configuration
             */
            routeStates: ['$stateProvider', function($stateProvider) {
                var appStates = [];
                // retrieve all StateDef
                angular.forEach(routeStates, function(route, routeIdentifier){
                    var appState = route['stateDef'];
                    if( _.isEmpty(appState) === false) {
                        appStates.push([routeIdentifier, appState]);
                    }
                });
                // declare available states:
                angular.forEach(appStates, function(args){
                    $stateProvider.state.apply(null, args);
                });

                return $stateProvider;
            }],
            predefinedStates: ['$q', function ($q) {
                var deferred = $q.defer();
                deferred.resolve(getAppStates());
                return deferred.promise;
            }]
        };
    } ]);
