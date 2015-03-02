'use strict';
angular.module('components')
    .controller('ModalCrudResetFormController', ['$scope', '$sce', 'appConfig', '$modalInstance', function ($scope, $sce, appConfig, $modalInstance) {

        $scope.closeModal = function(){
            $modalInstance.close();
        };
        $scope.cancelChange = function() {
            $modalInstance.close({action: 'cancelChange'});
        };
        $scope.processChange = function() {
            $modalInstance.close({action: 'processChange'});
        };
    }]
);
