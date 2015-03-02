'use strict';
angular.module('teamModule', ['components'])
    .config(function(){
    })
    /**
     * Rest API access
     */
    .factory('TeamRepository', ['RestFullResponse', 'AbstractRepository',
        function (RestFullResponse, AbstractRepository) {

            function TeamRepository() {
                AbstractRepository.call(this, RestFullResponse, 'team');
            }

            AbstractRepository.extend(TeamRepository);
            return new TeamRepository();
        }
    ])
    /**
     * Team Application Model
     */
    .factory('TeamService', [ '$rootScope', '$q', 'TeamRepository', function($rootScope, $q, TeamRepository){

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
    .factory('SharedTeamService', [ 'TeamService', function(TeamService){
        return new TeamService();
    }])
    .controller('TeamCtrl', ['$scope', '$state', 'TeamRepository', function ($scope, $state, TeamRepository) {

    }]);
