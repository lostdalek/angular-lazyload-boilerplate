'use strict';
angular.module('teamModule')
    .controller('TeamAddCtrl',[ '$window', '$scope','growl', '$filter', '$modal', '$timeout', '$location',  'TeamRepository', 'TeamService', 'appConfig',
        function ($window, $scope, growl, $filter, $modal, $timeout, $location, TeamRepository, TeamService, appConfig) {
            var teamServiceInstance = new TeamService();
            var $translate = $filter('translate');
            var originalModel = {};
            $scope.title = $translate('crudAddTeam');

            var _initForm = function() {
                var teamSchema = teamServiceInstance.getFormSchema();
                $scope.schema = teamSchema.schema;
                $scope.form = teamSchema.form;
                $scope.model = angular.copy(originalModel);
            };

            $scope.resetForm = function(form, model) {
                $scope.model = angular.copy(originalModel);
            };

            $scope.submitForm = function(form, model) {
                // First we broadcast an event so all fields validate themselves
                $scope.$broadcast('schemaFormValidate');
                if( form.$valid ) {
                    var postModel = angular.copy(model);

                    $scope.submitPromise = {
                        promise: TeamRepository.create(postModel).then(function (response) {
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

            _initForm();

        }]
);
