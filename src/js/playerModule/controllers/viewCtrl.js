'use strict';
angular.module('playerModule')
    .controller('PlayerViewCtrl', ['$scope', '$stateParams', '$location', '$filter', 'Restangular', 'TeamRepository', 'PlayerRepository', 'PlayerService', 'playerObj', '_', function ($scope, $stateParams, $location, $filter, Restangular, TeamRepository, PlayerRepository, PlayerService, playerObj, _) {
        var originalModel = angular.copy(playerObj.data);
        var teamIdList = [];
        var teamTitleMap = [];
        var $translate = $filter('translate');
        $scope.title = $translate('crudViewPlayer');

        var _initForm = function(teamCollection) {
            var playerSchema = PlayerService.getFormSchema(teamCollection);
            $scope.schema = playerSchema.schema;
            $scope.form = playerSchema.form;
            $scope.model = angular.copy(originalModel);
        };

        $scope.resetForm = function(form, model) {
            $scope.model = angular.copy(originalModel);
        };

        $scope.submitForm = function(form, model) {
            // First we broadcast an event so all fields validate themselves
            $scope.$broadcast('schemaFormValidate');

            // Then we check if the form is valid
            if (form.$valid) {
                _.extend(playerObj.data, model);
                playerObj.data.put().then(function (response) {
                    //$state.go('/list');
                });
            }
        };

        $scope.teamCollection = TeamRepository.getList().then(function(response){
            if( response.status === 200 ){
                _initForm(response.data);
            }
            $scope.teamCollection = response.data;
            return $scope.teamCollection;
        });
    }]);
