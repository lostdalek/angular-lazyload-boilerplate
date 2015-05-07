/**
 * Global Application Configuration
 */
'use strict';
angular.module('application')
    .config([
        '$injector',
        '$provide',
        '$ocLazyLoadProvider',
        '$futureStateProvider',
        'OnDemandStateServiceProvider',
        '_',
        function(
            $injector,
            $provide,
            $ocLazyLoadProvider,
            $futureStateProvider,
            OnDemandStateServiceProvider,

            _) {

            $ocLazyLoadProvider.config(OnDemandStateServiceProvider.getModuleStateConfiguration());

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
