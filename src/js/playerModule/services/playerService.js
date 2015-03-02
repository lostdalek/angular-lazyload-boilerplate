'use strict';
angular.module('playerModule')
.factory('PlayerService', [ '$rootScope', '$q', 'TeamRepository', function($rootScope, $q, TeamRepository){
    var activeModel = null;

    var _exportModel = function(formModel) {};
    var _generateFormSchema = function (teams) {
        var teamTitleMap = [];
        var teamIdList = [];
        angular.forEach(teams, function (object, i) {
            teamIdList.push(object.id);
            teamTitleMap.push({value: object.id, name: object.name});
        });
        return {
            form: [
                'name',
                {
                    key: 'team',
                    type: 'select',
                    titleMap: teamTitleMap
                }
            ],
            // https://github.com/Textalk/angular-schema-form/blob/master/docs/index.md
            schema: {
                type: 'object',
                title: 'Edit Player',
                properties: {
                    name: {type: 'string', minLength: 2, title: 'Name', description: ''},
                    team: {
                        title: 'Team',
                        type: 'integer',
                        enum: teamIdList
                    }
                },
                required: [
                    'name',
                    'team'
                ]
            }
        };
    };

    var _setActiveModel = function(newModel){
        activeModel = newModel;
        $rootScope.$broadcast('PlayerService.activeModel:change', activeModel);
    };

    return {
        getFormSchema: function(teamCollection) {
            return _generateFormSchema(teamCollection);
        },
        exportModel: function() {

        },
        setModel: function( model ) {
            return _setActiveModel(model);
        },
        getActiveModel: function() {
            var d = $q.defer();
            if( activeModel !== null) {
                d.resolve(activeModel);
            } else {
                d.reject({});
            }
            return d.promise;
        }
    };
}]);
