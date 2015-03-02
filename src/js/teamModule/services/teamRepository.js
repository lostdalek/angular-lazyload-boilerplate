'use strict';
angular.module('teamModule')
    .factory('TeamRepository', ['RestFullResponse', 'AbstractRepository',
        function (RestFullResponse, AbstractRepository) {

            function TeamRepository() {
                AbstractRepository.call(this, RestFullResponse, 'team');
            }

            AbstractRepository.extend(TeamRepository);
            return new TeamRepository();
        }
    ]);
