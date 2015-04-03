'use strict';
angular.module('userModule')
.config(['$stateProvider', '$urlRouterProvider', '$authProvider', function($stateProvider, $urlRouterProvider, $authProvider) {

    $stateProvider
        .state('app.user.login', {
            url: '/login',
            ncyBreadcrumb: {
                label: 'Login'
            },
            controller: 'LoginCtrl',
            templateProvider: ['$templateCache', function($templateCache){
                return $templateCache.get('userModule/tpl/login.html');
            }]
        })
        .state('app.user.signup', {
            url: '/signup',
            ncyBreadcrumb: {
                label: 'signup'
            },
            controller: 'SignupCtrl',
            templateProvider: ['$templateCache', function($templateCache){
                return $templateCache.get('userModule/tpl/signup.html');
            }]
        })
        .state('app.user.logout', {
            url: '/logout',
            controller: 'LogoutCtrl',
            template: null
        })
        .state('app.user.profile', {
            url: '/profile',
            ncyBreadcrumb: {
                label: 'profile'
            },
            controller: 'ProfileCtrl',
            resolve: {
                authenticatedUser: function($q, $location, AuthService) {
                    return AuthService.getUser().then(function(user){
                        return user;
                    },function(){
                        $location.path('/user/login');
                    });
                }
            },
            templateProvider: ['$templateCache', function($templateCache){
                return $templateCache.get('userModule/tpl/profile.html');
            }]
        });

    $authProvider.loginUrl = '/auth/login';
    $authProvider.signupUrl = '/auth/signup';
    $authProvider.loginRoute = '/user/login';
    $authProvider.signupRoute = '/user/signup';

    $authProvider.google({
        clientId: '688212556392-9jttcd7gabqhbe0e1bm7op3qvjhedpcb@developer.gserviceaccount.com'
    });
}]);
