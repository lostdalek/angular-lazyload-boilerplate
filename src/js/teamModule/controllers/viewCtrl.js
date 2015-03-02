'use strict';
angular.module('teamModule')
    .controller('TeamViewCtrl', ['$scope', '$stateParams', '$location', '$filter', 'Restangular', 'TeamRepository', 'TeamService', 'teamObj', '_', function ($scope, $stateParams, $location, $filter, Restangular, TeamRepository, TeamService, teamObj, _) {
        var teamServiceInstance = new TeamService();
        var originalModel = angular.copy(teamObj.data);
        var $translate = $filter('translate');
        $scope.title = $translate('crudViewTeam');
        $scope.hasFormError = false;
        $scope.formError = {message: '', raw: {}};

        var _initForm = function() {
            var teamSchema = teamServiceInstance.getFormSchema();
            $scope.schema = teamSchema.schema;
            $scope.form = teamSchema.form;
            $scope.model = angular.copy(originalModel);
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

        _initForm();
    }]);
