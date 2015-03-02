'use strict';
angular.module('components')
    /**
     * when used in .config -> appConfigProvider
     * when used in .controller -> appConfig (will return $get)
     */
    .provider('appConfig', [function(){
        // default configuration
        var locale = 'en',
            env = 'dev',
            // set here overridable keys:
            defaultContext = {
                debug: true,
                locale: locale,
                env: env
            },
            configPrototype = {
                dev: {
                    locale: locale,
                    localisation: {
                        numberFormat: ',.0f',
                    },
                    overrideLangDefinitions: false,
                    staticPath: '',
                    basePath: '',

                    // Resources keys are remapped in getResource()
                    defaultCollectionLimit: 10,
                    defaultCollectionPage: 1,
                    resources: {
                        baseUrl: 'http://localhost:3000/',
                        grantType: 'password',
                        endPoints: {
                            // auth api
                            backendApi: {
                                path: 'api/'
                            }
                        }
                    }
                }
            },
            config = null;
        /**
         * On application configuration defaultContext can be overrided per modules
         * @param appContext
         * @returns {*}
         */
        var _setConfiguration = function(appContext) {
            var useContext = angular.copy(defaultContext);
            if( appContext!== undefined ) {
                useContext = angular.extend(useContext, appContext);
            }
            config = configPrototype[useContext.env];
            // add locale to prototype
            config.locale = useContext.locale;

            // if an envConfiguration global Object exists:
            if (typeof window.envConfiguration !== 'undefined') {
                config.basePath = window.envConfiguration.basePath;
                config.staticPath = window.envConfiguration.staticPath;
                config.resources.baseUrl = window.envConfiguration.apiBaseUrl;
            }
            return config;
        };
        return {

            getLocale: function() {
                if( config === null ) {
                    _setConfiguration();
                }
                return config.locale;
            },
            getContextConfiguration: function() {
                if( config === null ) {
                    _setConfiguration();
                }
                return config;
            },
            setContextConfiguration: function(contextOpts) {
                _setConfiguration(contextOpts);
                return config;
            },
            // once app is configured / in run state, these methods are exposed
            $get: ['$q', function ($q) {
                return {
                    getLocale: function( ){
                        return locale;
                    },
                    get: function(key) {
                        return config[key] !== undefined ? config[key] : null;
                    }
                };
            }]
        };
    }]);
