'use strict';
angular.module('playerModule')
    .controller('PlayerListCtrl', ['$scope', '$stateParams', '$location', '$modal', 'Restangular', 'PlayerRepository',  '_', function ($scope, $stateParams, $location, $modal, Restangular, PlayerRepository,  _) {
        $scope.currentPage = 1;
        $scope.perPage = 10;
        //$scope.totalItems = 50;
        //$scope.bigTotalItems = 50;
        $scope.meta = {};

        var refreshList = function(force, options) {

            PlayerRepository.getList({page:$scope.currentPage, per_page: $scope.perPage}).then(function(response){
                $scope.player = response.data;
                $scope.meta = response.data.meta;
                initPagination(response.data.meta);
            });
        };
        var initPagination =  function(meta) {
            if( $scope.initialisedPagination === undefined ) {
                $scope.initialisedPagination = true;

                // pagination options:
                var forceRefresh = true;

                $scope.totalItems = parseInt(meta.total*meta.pages, 10);
                $scope.totalItems = parseInt(meta.total, 10);
                $scope.perPage =parseInt(meta.per_page, 10);
                //
                $scope.maxSize = 5; // maximum displayed page
                $scope.bigCurrentPage = 1; // first page
            }
        };

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged =  function(){
            refreshList( true, {
                page: $scope.currentPage,
                limit: $scope.perPage
            });
        };
        $scope.delete = function(data) {

            var templateUrl = 'components/ui/modals/tpl/modalCrudDelete.html',
                controller = 'ModalCrudDeleteController';

            var parentScope = $scope,
                modalInstance = $modal.open({
                    keyboard: 'false',
                    templateUrl: templateUrl,
                    controller: controller,
                    resolve: {
                        resource: function() {
                            return {resource: data };
                        }
                    }
                });
            modalInstance.result.then(function (response) {
                if( response.action !== undefined ) {
                    if( response.action === 'cancelChange') {
                    } else if (response.action === 'processChange'){
                        PlayerRepository.remove(data).then(function () {
                            refreshList();
                            //$scope.player = PlayerRepository.getList();
                        });
                    }
                }
            });
        };

        refreshList();
    }]);
