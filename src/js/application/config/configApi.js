/**
 * Global Application API Configuration
 */
'use strict';
angular.module('application')
    .config(['RestangularProvider', '_', '$authProvider', 'appConfigProvider', function(RestangularProvider, _, $authProvider, appConfigProvider){

        var appConfig = appConfigProvider.getContextConfiguration();
        var basePath = appConfig['basePath'];

        // default headers (overrided by api factories)
        RestangularProvider.setDefaultHeaders({
            'Content-Type': 'application/json',
        });
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
    }]);
