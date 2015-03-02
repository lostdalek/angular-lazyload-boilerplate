'use strict';
angular.module('components')
    .factory('RestFullResponse', ['Restangular', function (Restangular) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setFullResponse(true);
        });
    }]);
