'use strict';
angular.module('userModule')
    .factory('UserRepository', ['RestFullResponse', 'AbstractRepository',
        function (RestFullResponse, AbstractRepository) {

            function UserRepository() {
                AbstractRepository.call(this, RestFullResponse, 'me');
            }

            AbstractRepository.extend(UserRepository);
            return new UserRepository();
        }
    ]);
