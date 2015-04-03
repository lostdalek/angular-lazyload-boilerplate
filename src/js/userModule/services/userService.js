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
