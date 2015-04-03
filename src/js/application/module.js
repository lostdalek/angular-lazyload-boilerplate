/**
 * Application Component
 */
'use strict';
angular.module('ui.sortable',[]);
angular.module('angularSpectrumColorpicker',[]);
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
    'ngStorage',
    'satellizer'
])
    .run([
        'AuthService',
        'AUTH_EVENTS',
        '$rootScope',
        '$state',
        '$stateParams',
        '$timeout',
        '$window',
        '$location',
        '$urlRouter',

        function (AuthService, AUTH_EVENTS, $rootScope, $state, $stateParams, $timeout, $window, $location, $urlRouter) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.$on('$stateChangeStart', function (event, next, toParams, fromState, fromParams) {

                //function to check to see if the currentUser has one of the required roles to authorize the next state.
                var checkAuthorization = function(authorizedRoles){
                    return AuthService.isAuthorizedRole(authorizedRoles).catch(function(){
                        event.preventDefault();

                        if( next.data.onAuthorizationFailure !== undefined ) {
                            next.data.onAuthorizationFailure.call(null, $state, fromState);
                        }

                        if (AuthService.isAuthenticated()) {
                            // user is not allowed
                            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                        } else {
                            // user is not logged in
                            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                        }
                    });
                };

                checkAuthorization(next.data.authorizedRoles);
                
                
                
            });
        }
    ]);
