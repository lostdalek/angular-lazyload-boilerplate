'use strict';
angular.module('application')
    .controller('ApplicationCtrl', ['$translate', '$scope', 'TeamRepository',   function ($translate, $scope, TeamRepository ) {
    var app = this;
    app.teamCount = 0;

    // count teams for demo:
    app.teamCollection = TeamRepository.getList().then(function(response){
        app.teamCount = response.data.length;
        app.teamCollection = response.data;
        return app.teamCollection;
    });

    // refresh teamCount on time:
    $scope.$watch(angular.bind(app, function (teamCount) {
        return app.teamCount;
    }), function(newCount){
        app.teamCount = newCount;
    });
}]);
