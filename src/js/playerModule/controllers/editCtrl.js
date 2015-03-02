'use strict';
angular.module('playerModule')
    .controller('PlayerEditCtrl', ['$scope', '$modal', '$filter', '$stateParams', '$location', 'Restangular', 'TeamRepository', 'PlayerRepository', 'PlayerService', 'playerObj', '_', 'growl' , function ($scope, $modal, $filter, $stateParams, $location, Restangular, TeamRepository, PlayerRepository, PlayerService, playerObj, _, growl) {
        var $translate = $filter('translate');
        var originalModel = angular.copy(playerObj.data);
        var teamIdList = [];
        var teamTitleMap = [];
        $scope.title = $translate('crudEditPlayer');
        $scope.hasFormError = false;
        $scope.formError = {message: '', raw: {}};

        var _initForm = function(teamCollection) {
            var playerSchema = PlayerService.getFormSchema(teamCollection);
            $scope.schema = playerSchema.schema;
            $scope.form = playerSchema.form;
            $scope.model = angular.copy(originalModel);
            $scope.model.team = 1;
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

            // Then we check if the form is valid
            if( form.$valid ) {
                _.extend(playerObj.data, model);

                $scope.submitPromise = {
                    promise: playerObj.data.put().then(function (response) {
                        //$state.go('/list');
                        $scope.hasFormError = false;
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

        $scope.teamCollection = TeamRepository.getList().then(function(response){
            if( response.status === 200 ){
                _initForm(response.data);
            }
            $scope.teamCollection = response.data;
            return $scope.teamCollection;
        });
}]);
