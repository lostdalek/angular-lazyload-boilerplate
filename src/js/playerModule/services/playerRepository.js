'use strict';
angular.module('playerModule')
    .factory('PlayerRepository', ['RestFullResponse', 'AbstractRepository', 'Restangular',
        function (RestFullResponse, AbstractRepository, Restangular) {
            function PlayerRepository() {
                AbstractRepository.call(this, RestFullResponse, 'player');
            }

            AbstractRepository.extend(PlayerRepository);
            return new PlayerRepository();
        }
    ]);
