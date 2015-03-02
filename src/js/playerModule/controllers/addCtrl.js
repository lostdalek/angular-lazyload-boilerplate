'use strict';
angular.module('playerModule')
    .controller('PlayerAddCtrl',[ '_', '$window', '$rootScope', '$scope','$state', '$modal', '$filter', '$timeout', '$location', 'growl', 'appConfig', 'TeamRepository', 'PlayerRepository', 'TeamService', 'PlayerService',
        function (_, $window, $rootScope, $scope, $state, $modal, $filter, $timeout, $location, growl, appConfig, TeamRepository, PlayerRepository, TeamService, PlayerService) {
            var originalModel = {};//angular.copy(playerObj.data);
            var $translate = $filter('translate');
            $scope.title = $translate('crudAddPlayer');
            $scope.hasFormError = false;
            $scope.formError = {message: '', raw: {}};

            var _initForm = function(teamCollection) {
                var playerSchema = PlayerService.getFormSchema(teamCollection);
                $scope.schema = playerSchema.schema;
                $scope.form = playerSchema.form;
                $scope.model = angular.copy(originalModel);
            };

            var _getTeamById = function( teamId) {
                var team = null;
                angular.forEach($scope.teamCollection, function(object,i){
                    if( object.id === teamId) {
                        team = object;
                    }
                });
                return team;
            };

            $scope.resetForm = function(form, model) {
                $scope.model = angular.copy(originalModel);
            };

            $scope.submitForm = function(form, model) {
                // First we broadcast an event so all fields validate themselves
                $scope.$broadcast('schemaFormValidate');

                // Then we check if the form is valid
                var team = _getTeamById(model.team);

                if( form.$valid && team !== null) {
                    $scope.submitPromise = {
                        promise: team.post('player', model).then(function (response) {
                            $scope.hasFormError = false;
                            growl.success($translate('crudCreateSuccess'), {ttl: 5000});
                        }, function(response){
                            growl.error($translate('crudCreateFailure'), {ttl: 5000});
                            $scope.hasFormError = true;
                            $scope.formError.message = response.statusText;
                            $scope.formError.raw = response.data;
                        }),
                        message:'',
                        backdrop:false,
                        templateUrl:'application/tpl/loading.button.html',
                        delay:0,
                        minDuration:0
                    };
                }
            };

            $scope.teamCollection = TeamRepository.getList().then(function(response){
                if( response.status === 200 ){
                    _initForm(response.data);
                }
                $scope.teamCollection = response.data;
                return $scope.teamCollection;
            });
        }]
);
