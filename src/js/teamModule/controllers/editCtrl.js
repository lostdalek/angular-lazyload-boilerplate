'use strict';
angular.module('teamModule')
    .controller('TeamEditCtrl', ['$scope', '$timeout', '$modal', 'growl', '$filter', '$stateParams', '$location', 'Restangular', 'TeamRepository', 'TeamService', 'teamObj', '_', function ($scope, $timeout, $modal, growl, $filter, $stateParams, $location, Restangular, TeamRepository, TeamService, teamObj, _) {
        var teamServiceInstance = new TeamService();
        var originalModel = angular.copy(teamObj.data);
        var $translate = $filter('translate');
        $scope.title = $translate('crudEditTeam');
        $scope.hasFormError = false;
        $scope.formError = {message: '', raw: {}};

        var _initForm = function() {
            var teamSchema = teamServiceInstance.getFormSchema();
            $scope.schema = teamSchema.schema;
            $scope.form = teamSchema.form;
            $scope.model = angular.copy(originalModel);
        };

        $scope.resetForm = function(form, model) {
            var templateUrl = 'components/ui/modals/tpl/modalCrudResetForm.html',
                controller = 'ModalCrudResetFormController';

            var parentScope = $scope,
                modalInstance = $modal.open({
                    keyboard: 'false',
                    templateUrl: templateUrl,
                    controller: controller,
                    resolve: {
                        resource: function() {
                            return {resource: model };
                        }
                    }
                });
            modalInstance.result.then(function (response) {
                if( response.action !== undefined ) {
                    if( response.action === 'cancelChange') {
                    } else if (response.action === 'processChange'){
                        $scope.model = angular.copy(originalModel);
                    }
                }
            });
        };

        $scope.submitForm = function(form, model) {
            // First we broadcast an event so all fields validate themselves
            $scope.$broadcast('schemaFormValidate');

            if (form.$valid) {
                _.extend(teamObj.data, $scope.model);
                teamObj.data.put().then(function (response) {
                });
            }
        };

        $scope.submitForm = function(form, model) {

            // First we broadcast an event so all fields validate themselves
            $scope.$broadcast('schemaFormValidate');

            if( form.$valid ) {
                _.extend(teamObj.data, $scope.model);

                $scope.submitPromise = {
                    promise: teamObj.data.put().then(function (response) {
                        //$state.go('/list');
                        growl.success($translate('crudUpdateSuccess'), {ttl: 5000});
                    }, function(response){
                        growl.error($translate('crudUpdateFailure'), {ttl: 5000});
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

}]);
