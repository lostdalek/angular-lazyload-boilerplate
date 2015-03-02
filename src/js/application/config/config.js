/**
 * Application Configuration
 */
'use strict';
angular.module('application')
    .config([
        '$injector',
        '$ocLazyLoadProvider',
        '$futureStateProvider',
        'OnDemandStateServiceProvider',
        'RestangularProvider',
        '$stateProvider',
        '$httpProvider',
        '$breadcrumbProvider',
        '$urlRouterProvider',
        '$locationProvider',
        'appConfigProvider',
        'growlProvider',
        'Modernizr',
        '_',
        function(
            $injector,
            $ocLazyLoadProvider,
            $futureStateProvider,
            OnDemandStateServiceProvider,
            RestangularProvider,
            $stateProvider,
            $httpProvider,
            $breadcrumbProvider,
            $urlRouterProvider,
            $locationProvider,
            appConfigProvider,
            growlProvider,
            Modernizr,
            _) {


             var appConfig = appConfigProvider.getContextConfiguration();
             var basePath = appConfig['basePath'];

            $ocLazyLoadProvider.config(OnDemandStateServiceProvider.getModuleStateConfiguration());

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

            RestangularProvider.setBaseUrl(appConfig.resources.baseUrl+appConfig.resources.endPoints.backendApi.path);

            // auth deauth will remove these:
            RestangularProvider.setDefaultHeaders({
                //'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            });

            // if data is embedded in meta data:
            // reject data if not json:
            RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
                if( _.isObject(data) === false ) {
                    if( data[0] === '<') {
                        deferred.reject(data);
                        console.log('restangular interceptor: not json:', data);
                    }
                }
                return data;
            });
            RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
                var extractedData;
                // .. to look for getList operations
                if (operation === 'getList') {
                    extractedData = {};
                    extractedData = data._embedded;
                    extractedData.links = data._links;
                    extractedData.meta = data.meta;
                } else {
                    extractedData = data;
                }
                return extractedData;
            });



            // inject route states provider
            $injector.invoke(OnDemandStateServiceProvider.routeStates);

            var ocLazyLoadStateFactory = ['$q', '$ocLazyLoad', 'futureState', function ($q, $ocLazyLoad, futureState) {
                var deferred = $q.defer();
                $ocLazyLoad.load(futureState.module).then(function(name) {
                    deferred.resolve();
                }, function() {
                    deferred.reject();
                });
                return deferred.promise;
            }];

            $futureStateProvider.stateFactory('ocLazyLoad', ocLazyLoadStateFactory);
            $futureStateProvider.addResolve(['$injector', function ($injector) {
                return $injector.invoke(OnDemandStateServiceProvider.predefinedStates).then(
                    function (appStatesResult) {
                        angular.forEach(appStatesResult, function(state){
                            $futureStateProvider.futureState(state);
                        });
                    }
                );
            }]);

        }]);
