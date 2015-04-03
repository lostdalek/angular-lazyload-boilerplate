'use strict';
angular.module('components')
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        logoutFailed: 'auth-logout-failed',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })
    .constant('USER_ROLES', {
        //all: '*',
        superAdmin: 4,
        admin: 3,
        editor: 2,
        logguedIn: 1,
        guest: 0
    })
    .factory('AuthRepository', ['RestFullResponse', 'AbstractRepository',
        function (RestFullResponse, AbstractRepository) {

            function AuthRepository() {
                AbstractRepository.call(this, RestFullResponse, 'me');
            }

            AbstractRepository.extend(AuthRepository);
            return new AuthRepository();
        }
    ])

    .factory('AuthService', [ '$rootScope', '$q', '$auth', 'AUTH_EVENTS', 'USER_ROLES', 'Restangular', 'AuthRepository', function(
        $rootScope, $q, $auth, AUTH_EVENTS, USER_ROLES, Restangular, AuthRepository){
        var user = null;
        var userRole = USER_ROLES.guest;


        Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
                // intercept restangular response
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                    403: AUTH_EVENTS.notAuthorized,
                    419: AUTH_EVENTS.sessionTimeout,
                    440: AUTH_EVENTS.sessionTimeout
                }[response.status], response);
                return data;
            });
        });


        var _setUserRole = function(response) {
            if( user.role === undefined ) {
                user.role = USER_ROLES.logguedIn;
            }
            userRole = user.role;
        };

        var _login = function(credentials, fetchUser) {
            return $auth.login(credentials).then(function (response) {

                return _getUser().then(function(user){

                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, response);
                });
            }).catch(function (response) {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed, response);
            });
        };

        var _logout = function() {
            user = null;
            userRole = USER_ROLES.guest;
            return $auth.logout().then(function (response) {
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess, response);
            }).catch(function (response) {
                $rootScope.$broadcast(AUTH_EVENTS.logoutFailed, response);
            });
        };

        var _authenticate = function(provider) {
            return $auth.authenticate(provider).then(function (response) {
                return _getUser().then(function(user){
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, response);
                });
            }).catch(function (response) {
            });
        };



        var _isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

        var _getUser = function() {
            var d = $q.defer();
            if( _isAuthenticated() && user !== null) {
                d.resolve(user);
            }
            else if(_isAuthenticated() && user === null){
                AuthRepository.get().then(function (response) {
                    user = angular.copy(response.data);
                    _setUserRole();
                    d.resolve(user);
                }, function(){
                    user = null;
                    d.reject({});
                });
            } else {
                // not auth
                d.reject({});
            }

            return d.promise;
        };

        // assume user state is ok
        var _isAuthorized = function (authorizedRoles) {
            return _isInRole(authorizedRoles);
        };

        // init user state - return authorization as promise
        var _getAuthorization = function (authorizedRoles) {
            // ensure user information is up to date (ex: hard refresh):
            var d = $q.defer();
            var authorized = false;
            _getUser().then(function(){
                if( _isInRole(authorizedRoles) ) {
                    d.resolve();
                } else {
                    d.reject();
                }
            }, function(){
                if( _isInRole(authorizedRoles) ) {
                    d.resolve();
                } else {
                    d.reject();
                }
            });
            return d.promise;
        };

        var _isInRole = function(authorizedRoles) {
            if( angular.isArray(authorizedRoles) ) {
                // if multiples roles are specified, search for the good one:
                return authorizedRoles.indexOf(userRole) !== -1;
            } else {
                // if only one role is specified, search for the matching one:
                var minimumRole = parseInt(authorizedRoles, 10) || USER_ROLES.superAdmin;
                if( userRole === minimumRole) {
                    return true;
                }
            }
            return false;

        };

        return {
            login: function(credentials, fetchUser) {
                return _login(credentials, fetchUser);
            },
            logout: function() {
                return _logout();
            },
            authenticate: function(provider) {
                return _authenticate(provider);
            },
            isAuthenticated: function() {
                return _isAuthenticated();
            },
            isAuthorized: function(authorizedRoles) {
                return _isAuthorized(authorizedRoles);
            },
            getUser: function() {
                return _getUser();
            },
            // return a promise
            isAuthorizedRole: function(authorizedRoles) {
                return _getAuthorization(authorizedRoles);
            }
        };

    }]);
