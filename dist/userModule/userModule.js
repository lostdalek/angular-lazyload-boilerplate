'use strict';
angular.module('userModule', ['satellizer']);

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

'use strict';
angular.module('userModule')
    .controller('LoginCtrl', ['$scope', 'growl', 'AuthService', '$translate', function ($scope, growl, AuthService, $translate) {
        $scope.login = function () {
            AuthService.login({email: $scope.email, password: $scope.password})
                .then(function () {
                    growl.success('You have successfully logged in', {ttl: 3000});
                })
                .catch(function (response) {
                    growl.error($translate( response.data.message), {ttl: 3000});
                });
        };
        $scope.authenticate = function (provider) {
            AuthService.authenticate(provider)
                .then(function () {
                    growl.success('You have successfully logged in', {ttl: 3000});
                })
                .catch(function (response) {
                    growl.error(response.data ? response.data.message : response, {ttl: 3000});
                });
        };
    }]);

'use strict';
angular.module('userModule')
    .controller('LogoutCtrl', ['AuthService', 'growl', function (AuthService, growl) {
        if (!AuthService.isAuthenticated()) {
            return;
        }
        AuthService.logout()
            .then(function () {
                growl.success('You have been logged out', {ttl: 3000});
            });
    }]);

'use strict';
angular.module('userModule')
    .controller('UserCtrl', ['$scope', '$state', function ($scope, $state) {
        // abstract route
    }]);

'use strict';
angular.module('userModule')
    .controller('NavbarCtrl', ['$rootScope', '$scope', 'AUTH_EVENTS', 'AuthService', function ($rootScope, $scope, AUTH_EVENTS, AuthService) {
        $scope.user = {};
        $scope.isAuth = AuthService.isAuthenticated();

        $rootScope.$on(AUTH_EVENTS.loginSuccess, function(ev, response){
            $scope.isAuth = AuthService.isAuthenticated();
            $scope.getUser();
        });
        $rootScope.$on(AUTH_EVENTS.logoutSuccess, function(ev, response){
            $scope.isAuth = AuthService.isAuthenticated();
            $scope.getUser();
        });

        $scope.getUser = function() {
            AuthService.getUser().then(function(user){
                $scope.user = user;
            }).catch(function(){
                $scope.user = {};
            });
        };

        $scope.getUser();
    }]);

'use strict';
angular.module('userModule')
    .controller('ProfileCtrl', ['$scope', '$auth', 'growl', 'UserRepository', 'authenticatedUser', '_',  function ($scope, $auth, growl, UserRepository, authenticatedUser, _) {

        var userProfile = {};
        var originalModel = angular.copy(authenticatedUser);
        $scope.user = originalModel;

        /**
         * Get user's profile information.
         */
        $scope.getProfile = function () {
            UserRepository.get().then(function (response) {
                userProfile = response;
                $scope.user = originalModel = angular.copy(userProfile.data);
                return originalModel;
            }, function(error){
                growl.error(error.message, {ttl: 3000});
            });
        };


        /**
         * Update user's profile information.
         */
        $scope.updateProfile = function () {

            _.extend(userProfile.data, {
                displayName: $scope.user.displayName,
                email: $scope.user.email
            });
            userProfile.data.put().then(function (response) {
                growl.success('Profile has been updated', {ttl: 3000});
            });
        };

        /**
         * Link third-party provider.
         */
        $scope.link = function (provider) {
            $auth.link(provider)
                .then(function () {
                    growl.success('You have successfully linked ' + provider + ' account', {ttl: 3000});
                })
                .then(function () {
                    $scope.getProfile();
                })
                .catch(function (response) {
                    growl.error(response.data.message, {ttl: 3000});
                });
        };

        /**
         * Unlink third-party provider.
         */
        $scope.unlink = function (provider) {
            $auth.unlink(provider)
                .then(function () {
                    growl.success('You have successfully unlinked ' + provider + ' account', {ttl: 3000});
                })
                .then(function () {
                    $scope.getProfile();
                })
                .catch(function (response) {
                    growl.error(response.data.message, {ttl: 3000});
                });
        };

        $scope.getProfile();

    }]);

'use strict';
angular.module('userModule')
    .controller('SignupCtrl', ['$scope', 'growl', '$auth', 'AuthService', '$translate', function ($scope, growl, $auth, AuthService, $translate) {
        $scope.signup = function () {
            $auth.signup({
                displayName: $scope.displayName,
                email: $scope.email,
                password: $scope.password
            }).then(function(){
                AuthService.login({
                    email: $scope.email,
                    password: $scope.password
                }).then(function () {
                    growl.success('You have successfully logged in', {ttl: 3000});
                })
                .catch(function (response) {
                    growl.error($translate( response.data.message), {ttl: 3000});
                });
            })
            .catch(function (response) {
                if (typeof response.data.message === 'object') {
                    angular.forEach(response.data.message, function (message) {
                        growl.error(message[0], {ttl: 3000});
                    });
                } else {
                    growl.error(response.data.message, {ttl: 3000});
                }
            });
        };
    }]);

'use strict';
angular.module('userModule')
  .directive('passwordMatch', function() {
    return {
      require: 'ngModel',
      scope: {
        otherModelValue: '=passwordMatch'
      },
      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue === scope.otherModelValue;
        };
        scope.$watch('otherModelValue', function() {
          ngModel.$validate();
        });
      }
    };
  });


'use strict';
angular.module('userModule')
  .directive('passwordStrength', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        var indicator = element.children();
        var dots = Array.prototype.slice.call(indicator.children());
        var weakest = dots.slice(-1)[0];
        var weak = dots.slice(-2);
        var strong = dots.slice(-3);
        var strongest = dots.slice(-4);

        element.after(indicator);

        element.bind('keyup', function() {
          var matches = {
                positive: {},
                negative: {}
              },
              counts = {
                positive: {},
                negative: {}
              },
              tmp,
              strength = 0,
              letters = 'abcdefghijklmnopqrstuvwxyz',
              numbers = '01234567890',
              symbols = '\\!@#$%&/()=?¿',
              strValue;

          angular.forEach(dots, function(el) {
            el.style.backgroundColor = '#ebeef1';
          });
          
          if (ngModel.$viewValue) {
            // Increase strength level
            matches.positive.lower = ngModel.$viewValue.match(/[a-z]/g);
            matches.positive.upper = ngModel.$viewValue.match(/[A-Z]/g);
            matches.positive.numbers = ngModel.$viewValue.match(/\d/g);
            matches.positive.symbols = ngModel.$viewValue.match(/[$-/:-?{-~!^_`\[\]]/g);
            matches.positive.middleNumber = ngModel.$viewValue.slice(1, -1).match(/\d/g);
            matches.positive.middleSymbol = ngModel.$viewValue.slice(1, -1).match(/[$-/:-?{-~!^_`\[\]]/g);

            counts.positive.lower = matches.positive.lower ? matches.positive.lower.length : 0;
            counts.positive.upper = matches.positive.upper ? matches.positive.upper.length : 0;
            counts.positive.numbers = matches.positive.numbers ? matches.positive.numbers.length : 0;
            counts.positive.symbols = matches.positive.symbols ? matches.positive.symbols.length : 0;

            counts.positive.numChars = ngModel.$viewValue.length;
            tmp += (counts.positive.numChars >= 8) ? 1 : 0;

            counts.positive.requirements = (tmp >= 3) ? tmp : 0;
            counts.positive.middleNumber = matches.positive.middleNumber ? matches.positive.middleNumber.length : 0;
            counts.positive.middleSymbol = matches.positive.middleSymbol ? matches.positive.middleSymbol.length : 0;

            // Decrease strength level
            matches.negative.consecLower = ngModel.$viewValue.match(/(?=([a-z]{2}))/g);
            matches.negative.consecUpper = ngModel.$viewValue.match(/(?=([A-Z]{2}))/g);
            matches.negative.consecNumbers = ngModel.$viewValue.match(/(?=(\d{2}))/g);
            matches.negative.onlyNumbers = ngModel.$viewValue.match(/^[0-9]*$/g);
            matches.negative.onlyLetters = ngModel.$viewValue.match(/^([a-z]|[A-Z])*$/g);

            counts.negative.consecLower = matches.negative.consecLower ? matches.negative.consecLower.length : 0;
            counts.negative.consecUpper = matches.negative.consecUpper ? matches.negative.consecUpper.length : 0;
            counts.negative.consecNumbers = matches.negative.consecNumbers ? matches.negative.consecNumbers.length : 0;

            // Calculations
            strength += counts.positive.numChars * 4;
            if (counts.positive.upper) {
              strength += (counts.positive.numChars - counts.positive.upper) * 2;
            }
            if (counts.positive.lower) {
              strength += (counts.positive.numChars - counts.positive.lower) * 2;
            }
            if (counts.positive.upper || counts.positive.lower) {
              strength += counts.positive.numbers * 4;
            }
            strength += counts.positive.symbols * 6;
            strength += (counts.positive.middleSymbol + counts.positive.middleNumber) * 2;
            strength += counts.positive.requirements * 2;

            strength -= counts.negative.consecLower * 2;
            strength -= counts.negative.consecUpper * 2;
            strength -= counts.negative.consecNumbers * 2;

            if (matches.negative.onlyNumbers) {
              strength -= counts.positive.numChars;
            }
            if (matches.negative.onlyLetters) {
              strength -= counts.positive.numChars;
            }

            strength = Math.max(0, Math.min(100, Math.round(strength)));

            if (strength > 85) {
              angular.forEach(strongest, function(el) {
                el.style.backgroundColor = '#008cdd';
              });
            } else if (strength > 65) {
              angular.forEach(strong, function(el) {
                el.style.backgroundColor = '#6ead09';
              });
            } else if (strength > 30) {
              angular.forEach(weak, function(el) {
                el.style.backgroundColor = '#e09115';
              });
            } else {
              weakest.style.backgroundColor = '#e01414';
            }
          }
        });
      },
      template: '<span class="password-strength-indicator"><span></span><span></span><span></span><span></span></span>'
    };
  });

'use strict';
angular.module('userModule')
    .factory('UserRepository', ['RestFullResponse', 'AbstractRepository',
        function (RestFullResponse, AbstractRepository) {

            function UserRepository() {
                AbstractRepository.call(this, RestFullResponse, 'me');
            }

            AbstractRepository.extend(UserRepository);
            return new UserRepository();
        }
    ]);

'use strict';
angular.module('userModule')

    .factory('UserService', [ '$rootScope', '$q', 'UserRepository', function($rootScope, $q, UserRepository){

        // return a function to instanciate
        return function() {
            var activeModel = null;
            var _generateFormSchema = function () {
                return {
                    form: [
                        'name'
                    ],
                    // https://github.com/Textalk/angular-schema-form/blob/master/docs/index.md
                    schema: {
                        type: 'object',
                        title: 'Edit Team',
                        properties: {
                            name: {type: 'string', minLength: 2, title: 'Name', description: ''}
                        },
                        required: [
                            'name'
                        ]
                    }
                };
            };

            var _setActiveModel = function(newModel, callbackEventName){
                activeModel = newModel;
                if( callbackEventName !== undefined) {
                    $rootScope.$broadcast(callbackEventName, activeModel);
                }
                return activeModel;
            };

            return {
                getFormSchema: function() {
                    return _generateFormSchema();
                },
                setModel: function( model , callbackEventName) {
                    return _setActiveModel(model, callbackEventName);
                },
                getActiveModel: function() {
                    var d = $q.defer();
                    if( activeModel !== null) {
                        d.resolve(activeModel);
                    } else {
                        d.reject({});
                    }
                    return d.promise;
                },
                id: 0,
                restangularObj: {}
            };
        };
    }])
    .factory('SharedUserService', [ 'TeamService', function(UserService){
        return new UserService();
    }]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbmZpZy9zdGF0ZXMuanMiLCJjb250cm9sbGVycy9sb2dpbi5qcyIsImNvbnRyb2xsZXJzL2xvZ291dC5qcyIsImNvbnRyb2xsZXJzL21haW4uanMiLCJjb250cm9sbGVycy9uYXZiYXIuanMiLCJjb250cm9sbGVycy9wcm9maWxlLmpzIiwiY29udHJvbGxlcnMvc2lnbnVwLmpzIiwiZGlyZWN0aXZlcy9wYXNzd29yZE1hdGNoLmpzIiwiZGlyZWN0aXZlcy9wYXNzd29yZFN0cmVuZ3RoLmpzIiwic2VydmljZXMvdXNlclJlcG9zaXRvcnkuanMiLCJzZXJ2aWNlcy91c2VyU2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoidXNlck1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCd1c2VyTW9kdWxlJywgWydzYXRlbGxpemVyJ10pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ3VzZXJNb2R1bGUnKVxuLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsICckYXV0aFByb3ZpZGVyJywgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGF1dGhQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgLnN0YXRlKCdhcHAudXNlci5sb2dpbicsIHtcbiAgICAgICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICdMb2dpbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5DdHJsJyxcbiAgICAgICAgICAgIHRlbXBsYXRlUHJvdmlkZXI6IFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZUNhY2hlLmdldCgndXNlck1vZHVsZS90cGwvbG9naW4uaHRtbCcpO1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdhcHAudXNlci5zaWdudXAnLCB7XG4gICAgICAgICAgICB1cmw6ICcvc2lnbnVwJyxcbiAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ3NpZ251cCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnU2lnbnVwQ3RybCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVByb3ZpZGVyOiBbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpe1xuICAgICAgICAgICAgICAgIHJldHVybiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3VzZXJNb2R1bGUvdHBsL3NpZ251cC5odG1sJyk7XG4gICAgICAgICAgICB9XVxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ2FwcC51c2VyLmxvZ291dCcsIHtcbiAgICAgICAgICAgIHVybDogJy9sb2dvdXQnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ291dEN0cmwnLFxuICAgICAgICAgICAgdGVtcGxhdGU6IG51bGxcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdhcHAudXNlci5wcm9maWxlJywge1xuICAgICAgICAgICAgdXJsOiAnL3Byb2ZpbGUnLFxuICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAncHJvZmlsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZmlsZUN0cmwnLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgIGF1dGhlbnRpY2F0ZWRVc2VyOiBmdW5jdGlvbigkcSwgJGxvY2F0aW9uLCBBdXRoU2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQXV0aFNlcnZpY2UuZ2V0VXNlcigpLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXNlcjtcbiAgICAgICAgICAgICAgICAgICAgfSxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy91c2VyL2xvZ2luJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZVByb3ZpZGVyOiBbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpe1xuICAgICAgICAgICAgICAgIHJldHVybiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3VzZXJNb2R1bGUvdHBsL3Byb2ZpbGUuaHRtbCcpO1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAkYXV0aFByb3ZpZGVyLmxvZ2luVXJsID0gJy9hdXRoL2xvZ2luJztcbiAgICAkYXV0aFByb3ZpZGVyLnNpZ251cFVybCA9ICcvYXV0aC9zaWdudXAnO1xuICAgICRhdXRoUHJvdmlkZXIubG9naW5Sb3V0ZSA9ICcvdXNlci9sb2dpbic7XG4gICAgJGF1dGhQcm92aWRlci5zaWdudXBSb3V0ZSA9ICcvdXNlci9zaWdudXAnO1xuXG4gICAgJGF1dGhQcm92aWRlci5nb29nbGUoe1xuICAgICAgICBjbGllbnRJZDogJzY4ODIxMjU1NjM5Mi05anR0Y2Q3Z2FicWhiZTBlMWJtN29wM3F2amhlZHBjYkBkZXZlbG9wZXIuZ3NlcnZpY2VhY2NvdW50LmNvbSdcbiAgICB9KTtcbn1dKTtcbiIsIid1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCd1c2VyTW9kdWxlJylcbiAgICAuY29udHJvbGxlcignTG9naW5DdHJsJywgWyckc2NvcGUnLCAnZ3Jvd2wnLCAnQXV0aFNlcnZpY2UnLCAnJHRyYW5zbGF0ZScsIGZ1bmN0aW9uICgkc2NvcGUsIGdyb3dsLCBBdXRoU2VydmljZSwgJHRyYW5zbGF0ZSkge1xuICAgICAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBBdXRoU2VydmljZS5sb2dpbih7ZW1haWw6ICRzY29wZS5lbWFpbCwgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBncm93bC5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgbG9nZ2VkIGluJywge3R0bDogMzAwMH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBncm93bC5lcnJvcigkdHJhbnNsYXRlKCByZXNwb25zZS5kYXRhLm1lc3NhZ2UpLCB7dHRsOiAzMDAwfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgICRzY29wZS5hdXRoZW50aWNhdGUgPSBmdW5jdGlvbiAocHJvdmlkZXIpIHtcbiAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0ZShwcm92aWRlcilcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyb3dsLnN1Y2Nlc3MoJ1lvdSBoYXZlIHN1Y2Nlc3NmdWxseSBsb2dnZWQgaW4nLCB7dHRsOiAzMDAwfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyb3dsLmVycm9yKHJlc3BvbnNlLmRhdGEgPyByZXNwb25zZS5kYXRhLm1lc3NhZ2UgOiByZXNwb25zZSwge3R0bDogMzAwMH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1dKTtcbiIsIid1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCd1c2VyTW9kdWxlJylcbiAgICAuY29udHJvbGxlcignTG9nb3V0Q3RybCcsIFsnQXV0aFNlcnZpY2UnLCAnZ3Jvd2wnLCBmdW5jdGlvbiAoQXV0aFNlcnZpY2UsIGdyb3dsKSB7XG4gICAgICAgIGlmICghQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGdyb3dsLnN1Y2Nlc3MoJ1lvdSBoYXZlIGJlZW4gbG9nZ2VkIG91dCcsIHt0dGw6IDMwMDB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1dKTtcbiIsIid1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCd1c2VyTW9kdWxlJylcbiAgICAuY29udHJvbGxlcignVXNlckN0cmwnLCBbJyRzY29wZScsICckc3RhdGUnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUpIHtcbiAgICAgICAgLy8gYWJzdHJhY3Qgcm91dGVcbiAgICB9XSk7XG4iLCIndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgndXNlck1vZHVsZScpXG4gICAgLmNvbnRyb2xsZXIoJ05hdmJhckN0cmwnLCBbJyRyb290U2NvcGUnLCAnJHNjb3BlJywgJ0FVVEhfRVZFTlRTJywgJ0F1dGhTZXJ2aWNlJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgQVVUSF9FVkVOVFMsIEF1dGhTZXJ2aWNlKSB7XG4gICAgICAgICRzY29wZS51c2VyID0ge307XG4gICAgICAgICRzY29wZS5pc0F1dGggPSBBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5sb2dpblN1Y2Nlc3MsIGZ1bmN0aW9uKGV2LCByZXNwb25zZSl7XG4gICAgICAgICAgICAkc2NvcGUuaXNBdXRoID0gQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCk7XG4gICAgICAgICAgICAkc2NvcGUuZ2V0VXNlcigpO1xuICAgICAgICB9KTtcbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubG9nb3V0U3VjY2VzcywgZnVuY3Rpb24oZXYsIHJlc3BvbnNlKXtcbiAgICAgICAgICAgICRzY29wZS5pc0F1dGggPSBBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKTtcbiAgICAgICAgICAgICRzY29wZS5nZXRVc2VyKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5nZXRVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBBdXRoU2VydmljZS5nZXRVc2VyKCkudGhlbihmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUudXNlciA9IHVzZXI7XG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICRzY29wZS51c2VyID0ge307XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuZ2V0VXNlcigpO1xuICAgIH1dKTtcbiIsIid1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCd1c2VyTW9kdWxlJylcbiAgICAuY29udHJvbGxlcignUHJvZmlsZUN0cmwnLCBbJyRzY29wZScsICckYXV0aCcsICdncm93bCcsICdVc2VyUmVwb3NpdG9yeScsICdhdXRoZW50aWNhdGVkVXNlcicsICdfJywgIGZ1bmN0aW9uICgkc2NvcGUsICRhdXRoLCBncm93bCwgVXNlclJlcG9zaXRvcnksIGF1dGhlbnRpY2F0ZWRVc2VyLCBfKSB7XG5cbiAgICAgICAgdmFyIHVzZXJQcm9maWxlID0ge307XG4gICAgICAgIHZhciBvcmlnaW5hbE1vZGVsID0gYW5ndWxhci5jb3B5KGF1dGhlbnRpY2F0ZWRVc2VyKTtcbiAgICAgICAgJHNjb3BlLnVzZXIgPSBvcmlnaW5hbE1vZGVsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgdXNlcidzIHByb2ZpbGUgaW5mb3JtYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICAkc2NvcGUuZ2V0UHJvZmlsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFVzZXJSZXBvc2l0b3J5LmdldCgpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdXNlclByb2ZpbGUgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUudXNlciA9IG9yaWdpbmFsTW9kZWwgPSBhbmd1bGFyLmNvcHkodXNlclByb2ZpbGUuZGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsTW9kZWw7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgZ3Jvd2wuZXJyb3IoZXJyb3IubWVzc2FnZSwge3R0bDogMzAwMH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlIHVzZXIncyBwcm9maWxlIGluZm9ybWF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgJHNjb3BlLnVwZGF0ZVByb2ZpbGUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIF8uZXh0ZW5kKHVzZXJQcm9maWxlLmRhdGEsIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJHNjb3BlLnVzZXIuZGlzcGxheU5hbWUsXG4gICAgICAgICAgICAgICAgZW1haWw6ICRzY29wZS51c2VyLmVtYWlsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHVzZXJQcm9maWxlLmRhdGEucHV0KCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBncm93bC5zdWNjZXNzKCdQcm9maWxlIGhhcyBiZWVuIHVwZGF0ZWQnLCB7dHRsOiAzMDAwfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTGluayB0aGlyZC1wYXJ0eSBwcm92aWRlci5cbiAgICAgICAgICovXG4gICAgICAgICRzY29wZS5saW5rID0gZnVuY3Rpb24gKHByb3ZpZGVyKSB7XG4gICAgICAgICAgICAkYXV0aC5saW5rKHByb3ZpZGVyKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3Jvd2wuc3VjY2VzcygnWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IGxpbmtlZCAnICsgcHJvdmlkZXIgKyAnIGFjY291bnQnLCB7dHRsOiAzMDAwfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nZXRQcm9maWxlKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyb3dsLmVycm9yKHJlc3BvbnNlLmRhdGEubWVzc2FnZSwge3R0bDogMzAwMH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVbmxpbmsgdGhpcmQtcGFydHkgcHJvdmlkZXIuXG4gICAgICAgICAqL1xuICAgICAgICAkc2NvcGUudW5saW5rID0gZnVuY3Rpb24gKHByb3ZpZGVyKSB7XG4gICAgICAgICAgICAkYXV0aC51bmxpbmsocHJvdmlkZXIpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBncm93bC5zdWNjZXNzKCdZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgdW5saW5rZWQgJyArIHByb3ZpZGVyICsgJyBhY2NvdW50Jywge3R0bDogMzAwMH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ2V0UHJvZmlsZSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBncm93bC5lcnJvcihyZXNwb25zZS5kYXRhLm1lc3NhZ2UsIHt0dGw6IDMwMDB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuZ2V0UHJvZmlsZSgpO1xuXG4gICAgfV0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ3VzZXJNb2R1bGUnKVxuICAgIC5jb250cm9sbGVyKCdTaWdudXBDdHJsJywgWyckc2NvcGUnLCAnZ3Jvd2wnLCAnJGF1dGgnLCAnQXV0aFNlcnZpY2UnLCAnJHRyYW5zbGF0ZScsIGZ1bmN0aW9uICgkc2NvcGUsIGdyb3dsLCAkYXV0aCwgQXV0aFNlcnZpY2UsICR0cmFuc2xhdGUpIHtcbiAgICAgICAgJHNjb3BlLnNpZ251cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRhdXRoLnNpZ251cCh7XG4gICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6ICRzY29wZS5kaXNwbGF5TmFtZSxcbiAgICAgICAgICAgICAgICBlbWFpbDogJHNjb3BlLmVtYWlsLFxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmRcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBBdXRoU2VydmljZS5sb2dpbih7XG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiAkc2NvcGUuZW1haWwsXG4gICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmRcbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3Jvd2wuc3VjY2VzcygnWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IGxvZ2dlZCBpbicsIHt0dGw6IDMwMDB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3Jvd2wuZXJyb3IoJHRyYW5zbGF0ZSggcmVzcG9uc2UuZGF0YS5tZXNzYWdlKSwge3R0bDogMzAwMH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc3BvbnNlLmRhdGEubWVzc2FnZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJlc3BvbnNlLmRhdGEubWVzc2FnZSwgZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3dsLmVycm9yKG1lc3NhZ2VbMF0sIHt0dGw6IDMwMDB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZ3Jvd2wuZXJyb3IocmVzcG9uc2UuZGF0YS5tZXNzYWdlLCB7dHRsOiAzMDAwfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfV0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ3VzZXJNb2R1bGUnKVxuICAuZGlyZWN0aXZlKCdwYXNzd29yZE1hdGNoJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIG90aGVyTW9kZWxWYWx1ZTogJz1wYXNzd29yZE1hdGNoJ1xuICAgICAgfSxcbiAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzLCBuZ01vZGVsKSB7XG4gICAgICAgIG5nTW9kZWwuJHZhbGlkYXRvcnMuY29tcGFyZVRvID0gZnVuY3Rpb24obW9kZWxWYWx1ZSkge1xuICAgICAgICAgIHJldHVybiBtb2RlbFZhbHVlID09PSBzY29wZS5vdGhlck1vZGVsVmFsdWU7XG4gICAgICAgIH07XG4gICAgICAgIHNjb3BlLiR3YXRjaCgnb3RoZXJNb2RlbFZhbHVlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbmdNb2RlbC4kdmFsaWRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCd1c2VyTW9kdWxlJylcbiAgLmRpcmVjdGl2ZSgncGFzc3dvcmRTdHJlbmd0aCcsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsKSB7XG4gICAgICAgIHZhciBpbmRpY2F0b3IgPSBlbGVtZW50LmNoaWxkcmVuKCk7XG4gICAgICAgIHZhciBkb3RzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoaW5kaWNhdG9yLmNoaWxkcmVuKCkpO1xuICAgICAgICB2YXIgd2Vha2VzdCA9IGRvdHMuc2xpY2UoLTEpWzBdO1xuICAgICAgICB2YXIgd2VhayA9IGRvdHMuc2xpY2UoLTIpO1xuICAgICAgICB2YXIgc3Ryb25nID0gZG90cy5zbGljZSgtMyk7XG4gICAgICAgIHZhciBzdHJvbmdlc3QgPSBkb3RzLnNsaWNlKC00KTtcblxuICAgICAgICBlbGVtZW50LmFmdGVyKGluZGljYXRvcik7XG5cbiAgICAgICAgZWxlbWVudC5iaW5kKCdrZXl1cCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBtYXRjaGVzID0ge1xuICAgICAgICAgICAgICAgIHBvc2l0aXZlOiB7fSxcbiAgICAgICAgICAgICAgICBuZWdhdGl2ZToge31cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY291bnRzID0ge1xuICAgICAgICAgICAgICAgIHBvc2l0aXZlOiB7fSxcbiAgICAgICAgICAgICAgICBuZWdhdGl2ZToge31cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgdG1wLFxuICAgICAgICAgICAgICBzdHJlbmd0aCA9IDAsXG4gICAgICAgICAgICAgIGxldHRlcnMgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonLFxuICAgICAgICAgICAgICBudW1iZXJzID0gJzAxMjM0NTY3ODkwJyxcbiAgICAgICAgICAgICAgc3ltYm9scyA9ICdcXFxcIUAjJCUmLygpPT/CvycsXG4gICAgICAgICAgICAgIHN0clZhbHVlO1xuXG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGRvdHMsIGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2ViZWVmMSc7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgXG4gICAgICAgICAgaWYgKG5nTW9kZWwuJHZpZXdWYWx1ZSkge1xuICAgICAgICAgICAgLy8gSW5jcmVhc2Ugc3RyZW5ndGggbGV2ZWxcbiAgICAgICAgICAgIG1hdGNoZXMucG9zaXRpdmUubG93ZXIgPSBuZ01vZGVsLiR2aWV3VmFsdWUubWF0Y2goL1thLXpdL2cpO1xuICAgICAgICAgICAgbWF0Y2hlcy5wb3NpdGl2ZS51cHBlciA9IG5nTW9kZWwuJHZpZXdWYWx1ZS5tYXRjaCgvW0EtWl0vZyk7XG4gICAgICAgICAgICBtYXRjaGVzLnBvc2l0aXZlLm51bWJlcnMgPSBuZ01vZGVsLiR2aWV3VmFsdWUubWF0Y2goL1xcZC9nKTtcbiAgICAgICAgICAgIG1hdGNoZXMucG9zaXRpdmUuc3ltYm9scyA9IG5nTW9kZWwuJHZpZXdWYWx1ZS5tYXRjaCgvWyQtLzotP3stfiFeX2BcXFtcXF1dL2cpO1xuICAgICAgICAgICAgbWF0Y2hlcy5wb3NpdGl2ZS5taWRkbGVOdW1iZXIgPSBuZ01vZGVsLiR2aWV3VmFsdWUuc2xpY2UoMSwgLTEpLm1hdGNoKC9cXGQvZyk7XG4gICAgICAgICAgICBtYXRjaGVzLnBvc2l0aXZlLm1pZGRsZVN5bWJvbCA9IG5nTW9kZWwuJHZpZXdWYWx1ZS5zbGljZSgxLCAtMSkubWF0Y2goL1skLS86LT97LX4hXl9gXFxbXFxdXS9nKTtcblxuICAgICAgICAgICAgY291bnRzLnBvc2l0aXZlLmxvd2VyID0gbWF0Y2hlcy5wb3NpdGl2ZS5sb3dlciA/IG1hdGNoZXMucG9zaXRpdmUubG93ZXIubGVuZ3RoIDogMDtcbiAgICAgICAgICAgIGNvdW50cy5wb3NpdGl2ZS51cHBlciA9IG1hdGNoZXMucG9zaXRpdmUudXBwZXIgPyBtYXRjaGVzLnBvc2l0aXZlLnVwcGVyLmxlbmd0aCA6IDA7XG4gICAgICAgICAgICBjb3VudHMucG9zaXRpdmUubnVtYmVycyA9IG1hdGNoZXMucG9zaXRpdmUubnVtYmVycyA/IG1hdGNoZXMucG9zaXRpdmUubnVtYmVycy5sZW5ndGggOiAwO1xuICAgICAgICAgICAgY291bnRzLnBvc2l0aXZlLnN5bWJvbHMgPSBtYXRjaGVzLnBvc2l0aXZlLnN5bWJvbHMgPyBtYXRjaGVzLnBvc2l0aXZlLnN5bWJvbHMubGVuZ3RoIDogMDtcblxuICAgICAgICAgICAgY291bnRzLnBvc2l0aXZlLm51bUNoYXJzID0gbmdNb2RlbC4kdmlld1ZhbHVlLmxlbmd0aDtcbiAgICAgICAgICAgIHRtcCArPSAoY291bnRzLnBvc2l0aXZlLm51bUNoYXJzID49IDgpID8gMSA6IDA7XG5cbiAgICAgICAgICAgIGNvdW50cy5wb3NpdGl2ZS5yZXF1aXJlbWVudHMgPSAodG1wID49IDMpID8gdG1wIDogMDtcbiAgICAgICAgICAgIGNvdW50cy5wb3NpdGl2ZS5taWRkbGVOdW1iZXIgPSBtYXRjaGVzLnBvc2l0aXZlLm1pZGRsZU51bWJlciA/IG1hdGNoZXMucG9zaXRpdmUubWlkZGxlTnVtYmVyLmxlbmd0aCA6IDA7XG4gICAgICAgICAgICBjb3VudHMucG9zaXRpdmUubWlkZGxlU3ltYm9sID0gbWF0Y2hlcy5wb3NpdGl2ZS5taWRkbGVTeW1ib2wgPyBtYXRjaGVzLnBvc2l0aXZlLm1pZGRsZVN5bWJvbC5sZW5ndGggOiAwO1xuXG4gICAgICAgICAgICAvLyBEZWNyZWFzZSBzdHJlbmd0aCBsZXZlbFxuICAgICAgICAgICAgbWF0Y2hlcy5uZWdhdGl2ZS5jb25zZWNMb3dlciA9IG5nTW9kZWwuJHZpZXdWYWx1ZS5tYXRjaCgvKD89KFthLXpdezJ9KSkvZyk7XG4gICAgICAgICAgICBtYXRjaGVzLm5lZ2F0aXZlLmNvbnNlY1VwcGVyID0gbmdNb2RlbC4kdmlld1ZhbHVlLm1hdGNoKC8oPz0oW0EtWl17Mn0pKS9nKTtcbiAgICAgICAgICAgIG1hdGNoZXMubmVnYXRpdmUuY29uc2VjTnVtYmVycyA9IG5nTW9kZWwuJHZpZXdWYWx1ZS5tYXRjaCgvKD89KFxcZHsyfSkpL2cpO1xuICAgICAgICAgICAgbWF0Y2hlcy5uZWdhdGl2ZS5vbmx5TnVtYmVycyA9IG5nTW9kZWwuJHZpZXdWYWx1ZS5tYXRjaCgvXlswLTldKiQvZyk7XG4gICAgICAgICAgICBtYXRjaGVzLm5lZ2F0aXZlLm9ubHlMZXR0ZXJzID0gbmdNb2RlbC4kdmlld1ZhbHVlLm1hdGNoKC9eKFthLXpdfFtBLVpdKSokL2cpO1xuXG4gICAgICAgICAgICBjb3VudHMubmVnYXRpdmUuY29uc2VjTG93ZXIgPSBtYXRjaGVzLm5lZ2F0aXZlLmNvbnNlY0xvd2VyID8gbWF0Y2hlcy5uZWdhdGl2ZS5jb25zZWNMb3dlci5sZW5ndGggOiAwO1xuICAgICAgICAgICAgY291bnRzLm5lZ2F0aXZlLmNvbnNlY1VwcGVyID0gbWF0Y2hlcy5uZWdhdGl2ZS5jb25zZWNVcHBlciA/IG1hdGNoZXMubmVnYXRpdmUuY29uc2VjVXBwZXIubGVuZ3RoIDogMDtcbiAgICAgICAgICAgIGNvdW50cy5uZWdhdGl2ZS5jb25zZWNOdW1iZXJzID0gbWF0Y2hlcy5uZWdhdGl2ZS5jb25zZWNOdW1iZXJzID8gbWF0Y2hlcy5uZWdhdGl2ZS5jb25zZWNOdW1iZXJzLmxlbmd0aCA6IDA7XG5cbiAgICAgICAgICAgIC8vIENhbGN1bGF0aW9uc1xuICAgICAgICAgICAgc3RyZW5ndGggKz0gY291bnRzLnBvc2l0aXZlLm51bUNoYXJzICogNDtcbiAgICAgICAgICAgIGlmIChjb3VudHMucG9zaXRpdmUudXBwZXIpIHtcbiAgICAgICAgICAgICAgc3RyZW5ndGggKz0gKGNvdW50cy5wb3NpdGl2ZS5udW1DaGFycyAtIGNvdW50cy5wb3NpdGl2ZS51cHBlcikgKiAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvdW50cy5wb3NpdGl2ZS5sb3dlcikge1xuICAgICAgICAgICAgICBzdHJlbmd0aCArPSAoY291bnRzLnBvc2l0aXZlLm51bUNoYXJzIC0gY291bnRzLnBvc2l0aXZlLmxvd2VyKSAqIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY291bnRzLnBvc2l0aXZlLnVwcGVyIHx8IGNvdW50cy5wb3NpdGl2ZS5sb3dlcikge1xuICAgICAgICAgICAgICBzdHJlbmd0aCArPSBjb3VudHMucG9zaXRpdmUubnVtYmVycyAqIDQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdHJlbmd0aCArPSBjb3VudHMucG9zaXRpdmUuc3ltYm9scyAqIDY7XG4gICAgICAgICAgICBzdHJlbmd0aCArPSAoY291bnRzLnBvc2l0aXZlLm1pZGRsZVN5bWJvbCArIGNvdW50cy5wb3NpdGl2ZS5taWRkbGVOdW1iZXIpICogMjtcbiAgICAgICAgICAgIHN0cmVuZ3RoICs9IGNvdW50cy5wb3NpdGl2ZS5yZXF1aXJlbWVudHMgKiAyO1xuXG4gICAgICAgICAgICBzdHJlbmd0aCAtPSBjb3VudHMubmVnYXRpdmUuY29uc2VjTG93ZXIgKiAyO1xuICAgICAgICAgICAgc3RyZW5ndGggLT0gY291bnRzLm5lZ2F0aXZlLmNvbnNlY1VwcGVyICogMjtcbiAgICAgICAgICAgIHN0cmVuZ3RoIC09IGNvdW50cy5uZWdhdGl2ZS5jb25zZWNOdW1iZXJzICogMjtcblxuICAgICAgICAgICAgaWYgKG1hdGNoZXMubmVnYXRpdmUub25seU51bWJlcnMpIHtcbiAgICAgICAgICAgICAgc3RyZW5ndGggLT0gY291bnRzLnBvc2l0aXZlLm51bUNoYXJzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hdGNoZXMubmVnYXRpdmUub25seUxldHRlcnMpIHtcbiAgICAgICAgICAgICAgc3RyZW5ndGggLT0gY291bnRzLnBvc2l0aXZlLm51bUNoYXJzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdHJlbmd0aCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEwMCwgTWF0aC5yb3VuZChzdHJlbmd0aCkpKTtcblxuICAgICAgICAgICAgaWYgKHN0cmVuZ3RoID4gODUpIHtcbiAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHN0cm9uZ2VzdCwgZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgICAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnIzAwOGNkZCc7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdHJlbmd0aCA+IDY1KSB7XG4gICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChzdHJvbmcsIGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyM2ZWFkMDknO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RyZW5ndGggPiAzMCkge1xuICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2god2VhaywgZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgICAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2UwOTExNSc7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgd2Vha2VzdC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2UwMTQxNCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZTogJzxzcGFuIGNsYXNzPVwicGFzc3dvcmQtc3RyZW5ndGgtaW5kaWNhdG9yXCI+PHNwYW4+PC9zcGFuPjxzcGFuPjwvc3Bhbj48c3Bhbj48L3NwYW4+PHNwYW4+PC9zcGFuPjwvc3Bhbj4nXG4gICAgfTtcbiAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgndXNlck1vZHVsZScpXG4gICAgLmZhY3RvcnkoJ1VzZXJSZXBvc2l0b3J5JywgWydSZXN0RnVsbFJlc3BvbnNlJywgJ0Fic3RyYWN0UmVwb3NpdG9yeScsXG4gICAgICAgIGZ1bmN0aW9uIChSZXN0RnVsbFJlc3BvbnNlLCBBYnN0cmFjdFJlcG9zaXRvcnkpIHtcblxuICAgICAgICAgICAgZnVuY3Rpb24gVXNlclJlcG9zaXRvcnkoKSB7XG4gICAgICAgICAgICAgICAgQWJzdHJhY3RSZXBvc2l0b3J5LmNhbGwodGhpcywgUmVzdEZ1bGxSZXNwb25zZSwgJ21lJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEFic3RyYWN0UmVwb3NpdG9yeS5leHRlbmQoVXNlclJlcG9zaXRvcnkpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xuICAgICAgICB9XG4gICAgXSk7XG4iLCIndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgndXNlck1vZHVsZScpXG5cbiAgICAuZmFjdG9yeSgnVXNlclNlcnZpY2UnLCBbICckcm9vdFNjb3BlJywgJyRxJywgJ1VzZXJSZXBvc2l0b3J5JywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHEsIFVzZXJSZXBvc2l0b3J5KXtcblxuICAgICAgICAvLyByZXR1cm4gYSBmdW5jdGlvbiB0byBpbnN0YW5jaWF0ZVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYWN0aXZlTW9kZWwgPSBudWxsO1xuICAgICAgICAgICAgdmFyIF9nZW5lcmF0ZUZvcm1TY2hlbWEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybTogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ25hbWUnXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9UZXh0YWxrL2FuZ3VsYXItc2NoZW1hLWZvcm0vYmxvYi9tYXN0ZXIvZG9jcy9pbmRleC5tZFxuICAgICAgICAgICAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdFZGl0IFRlYW0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHt0eXBlOiAnc3RyaW5nJywgbWluTGVuZ3RoOiAyLCB0aXRsZTogJ05hbWUnLCBkZXNjcmlwdGlvbjogJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbmFtZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgX3NldEFjdGl2ZU1vZGVsID0gZnVuY3Rpb24obmV3TW9kZWwsIGNhbGxiYWNrRXZlbnROYW1lKXtcbiAgICAgICAgICAgICAgICBhY3RpdmVNb2RlbCA9IG5ld01vZGVsO1xuICAgICAgICAgICAgICAgIGlmKCBjYWxsYmFja0V2ZW50TmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChjYWxsYmFja0V2ZW50TmFtZSwgYWN0aXZlTW9kZWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0aXZlTW9kZWw7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGdldEZvcm1TY2hlbWE6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2dlbmVyYXRlRm9ybVNjaGVtYSgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0TW9kZWw6IGZ1bmN0aW9uKCBtb2RlbCAsIGNhbGxiYWNrRXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfc2V0QWN0aXZlTW9kZWwobW9kZWwsIGNhbGxiYWNrRXZlbnROYW1lKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldEFjdGl2ZU1vZGVsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgICAgICBpZiggYWN0aXZlTW9kZWwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQucmVzb2x2ZShhY3RpdmVNb2RlbCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkLnJlamVjdCh7fSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQucHJvbWlzZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGlkOiAwLFxuICAgICAgICAgICAgICAgIHJlc3Rhbmd1bGFyT2JqOiB7fVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICB9XSlcbiAgICAuZmFjdG9yeSgnU2hhcmVkVXNlclNlcnZpY2UnLCBbICdUZWFtU2VydmljZScsIGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcbiAgICAgICAgcmV0dXJuIG5ldyBVc2VyU2VydmljZSgpO1xuICAgIH1dKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
angular.module("userModule").run(["$templateCache", function($templateCache) {$templateCache.put("userModule/tpl/login.html","<div class=\"row\">\n    <div class=\"center-form panel col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3\">\n        <div class=\"panel-body\">\n            <h2 class=\"text-center\">Log in</h2>\n\n            <form method=\"post\" ng-submit=\"login()\" name=\"loginForm\">\n                <div class=\"form-group has-feedback\">\n                    <input class=\"form-control input-lg\" type=\"text\" name=\"email\" ng-model=\"email\" placeholder=\"Email\"\n                           required autofocus>\n                    <span class=\"ion-at form-control-feedback\"></span>\n                </div>\n\n                <div class=\"form-group has-feedback\">\n                    <input class=\"form-control input-lg\" type=\"password\" name=\"password\" ng-model=\"password\"\n                           placeholder=\"Password\" required>\n                    <span class=\"ion-key form-control-feedback\"></span>\n                </div>\n\n                <button type=\"submit\" ng-disabled=\"loginForm.$invalid\" class=\"btn btn-lg  btn-block btn-success\">Log\n                    in\n                </button>\n\n                <br/>\n\n                <p class=\"text-center\">\n                    <a href=\"#\">Forgot your password?</a>\n                </p>\n\n                <p class=\"text-center text-muted\">\n                    <small>Don\'t have an account yet? <a href=\"/user/signup\">Sign up</a></small>\n                </p>\n\n                <div class=\"\">\n                    <h6 class=\"text text-center\">or</h6>\n                    <hr>\n                </div>\n            </form>\n            <button class=\"btn btn-block btn-google-plus\" ng-click=\"authenticate(\'google\')\">\n                <span class=\"ion-social-googleplus\"></span>Sign in with Google\n            </button>\n\n        </div>\n    </div>\n</div>\n");
$templateCache.put("userModule/tpl/main.html","<div ui-view>\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<h2 ncy-breadcrumb-last></h2>\n			<div class=\"breadcrumb-links\">\n				<div ncy-breadcrumb></div>\n			</div>\n		</div>\n	</div>\n</div>\n\n");
$templateCache.put("userModule/tpl/profile.html","<div class=\"row\">\n    <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">Profile</div>\n        <div class=\"panel-body\">\n            <legend><i class=\"ion-clipboard\"></i> Edit My Profile</legend>\n            <form method=\"post\" ng-submit=\"updateProfile()\">\n                <div class=\"form-group\">\n                    <label class=\"control-label\">Profile Picture</label>\n                    <img class=\"profile-picture\" ng-src=\"{{user.picture || \'http://placehold.it/100x100\'}}\">\n                </div>\n                <div class=\"form-group\">\n                    <label class=\"control-label\"><i class=\"ion-person\"></i> Display Name</label>\n                    <input type=\"text\" class=\"form-control\" ng-model=\"user.displayName\"/>\n                </div>\n                <div class=\"form-group\">\n                    <label class=\"control-label\"><i class=\"ion-at\"></i> Email Address</label>\n                    <input type=\"email\" class=\"form-control\" ng-model=\"user.email\"/>\n                </div>\n                <button class=\"btn btn-lg btn-success\">Update Information</button>\n            </form>\n        </div>\n    </div>\n\n    <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">Accounts</div>\n        <div class=\"panel-body\">\n            <legend><i class=\"ion-link\"></i> Linked Accounts</legend>\n            <div class=\"btn-group-vertical\">\n                <button class=\"btn btn-sm btn-danger\" ng-if=\"user.google\" ng-click=\"unlink(\'google\')\">\n                    <i class=\"ion-social-googleplus\"></i> Unlink Google Account\n                </button>\n            </div>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("userModule/tpl/signup.html","<div class=\"row\">\n    <div class=\"center-form panel col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3\">\n        <div class=\"panel-body\">\n            <h2 class=\"text-center\">Sign up</h2>\n\n            <form method=\"post\" ng-submit=\"signup()\" name=\"signupForm\">\n                <div class=\"form-group has-feedback\"\n                     ng-class=\"{ \'has-error\' : signupForm.displayName.$invalid && signupForm.displayName.$dirty }\">\n                    <input class=\"form-control input-lg\" type=\"text\" name=\"displayName\" ng-model=\"displayName\"\n                           placeholder=\"Name\" required autofocus>\n                    <span class=\"ion-person form-control-feedback\"></span>\n\n                    <div class=\"help-block text-danger\" ng-if=\"signupForm.displayName.$dirty\"\n                         ng-messages=\"signupForm.displayName.$error\">\n                        <div ng-message=\"required\">You must enter your name.</div>\n                    </div>\n                </div>\n\n                <div class=\"form-group has-feedback\"\n                     ng-class=\"{ \'has-error\' : signupForm.email.$invalid && signupForm.email.$dirty }\">\n                    <input class=\"form-control input-lg\" type=\"email\" id=\"email\" name=\"email\" ng-model=\"email\"\n                           placeholder=\"Email\" required\n                           ng-pattern=\"/^[A-z]+[a-z0-9._]+@[a-z]+\\.[a-z.]{2,5}$/\">\n                    <span class=\"ion-at form-control-feedback\"></span>\n\n                    <div class=\"help-block text-danger\" ng-if=\"signupForm.email.$dirty\"\n                         ng-messages=\"signupForm.email.$error\">\n                        <div ng-message=\"required\">Your email address is required.</div>\n                        <div ng-message=\"pattern\">Your email address is invalid.</div>\n                    </div>\n                </div>\n\n                <div class=\"form-group has-feedback\"\n                     ng-class=\"{ \'has-error\' : signupForm.password.$invalid && signupForm.password.$dirty }\">\n                    <input password-strength class=\"form-control input-lg\" type=\"password\" name=\"password\"\n                           ng-model=\"password\" placeholder=\"Password\" required>\n                    <span class=\"ion-key form-control-feedback\"></span>\n\n                    <div class=\"help-block text-danger\" ng-if=\"signupForm.password.$dirty\"\n                         ng-messages=\"signupForm.password.$error\">\n                        <div ng-message=\"required\">Password is required.</div>\n                    </div>\n                </div>\n\n                <div class=\"form-group has-feedback\"\n                     ng-class=\"{ \'has-error\' : signupForm.confirmPassword.$invalid && signupForm.confirmPassword.$dirty }\">\n                    <input password-match=\"password\" class=\"form-control input-lg\" type=\"password\"\n                           name=\"confirmPassword\" ng-model=\"confirmPassword\" placeholder=\"Confirm Password\">\n                    <span class=\"ion-key form-control-feedback\"></span>\n\n                    <div class=\"help-block text-danger\" ng-if=\"signupForm.confirmPassword.$dirty\"\n                         ng-messages=\"signupForm.confirmPassword.$error\">\n                        <div ng-message=\"compareTo\">Password must match.</div>\n                    </div>\n                </div>\n\n                <p class=\"text-center text-muted\">\n                    <small>By clicking on Sign up, you agree to <a href=\"#\">terms & conditions</a> and <a href=\"#\">privacy\n                        policy</a></small>\n                </p>\n\n                <button type=\"submit\" ng-disabled=\"signupForm.$invalid\" class=\"btn btn-lg btn-block btn-primary\">Sign\n                    up\n                </button>\n                <br/>\n\n                <p class=\"text-center text-muted\">Already have an account? <a href=\"/user/login\">Log in now</a></p>\n            </form>\n        </div>\n    </div>\n</div>\n\n");}]);