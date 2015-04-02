/**
 * Application Providers
 * must be loaded before configuration
 */
'use strict';
angular.module('application')
    .provider('OnDemandStateService', ['appConfigProvider', '_', function (appConfigProvider, _) {
        // init configuration with the default context:
        var appConfig = appConfigProvider.setContextConfiguration();
        var basePath = appConfig['basePath'];
        // define placeholder for resolvable States:
        var modulesDefinition = {
                application: {
                    name: 'application',
                    files: [basePath+'application/application.js'],
                    loaded: true
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
                    resolve: {
                        // Team Module is preloaded Here:
                        loadModule: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('teamModule');
                        }]
                    }
                    // no lazyModule/lazyFile/lazyTemplateUrl as it's already loaded
                },
                futureStateDef: {
                    // already loaded
                }
            },
            'app.team': {
                stateDef: {
                    url: '^/team',
                    abstract: true,
                    controller: 'TeamCtrl',
                    templateProvider: ['$templateCache', function($templateCache){
                        return $templateCache.get('teamModule/tpl/main.html');
                    }],
                    lazyModule: modulesDefinition.team.name,
                    lazyFiles: modulesDefinition.team.files,
                    lazyTemplateUrl: 'teamModule/tpl/main.html',
                    ncyBreadcrumb: {
                        label: 'Team'
                    }
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
