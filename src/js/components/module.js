/**
 * Register Generic Components
 */
'use strict';
angular.module('components', [

])
    .factory('RestFullResponse', ['Restangular', function (Restangular) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setFullResponse(true);
        });
    }])
    .factory('AbstractRepository', [
        function () {

            function AbstractRepository(restangular, route) {
                this.restangular = restangular;
                this.route = route;
            }

            AbstractRepository.prototype = {
                getList: function (params) {
                    return this.restangular.all(this.route).getList(params);
                },
                get: function (id) {
                    return this.restangular.one(this.route, id).get();
                },
                getView: function (id) {
                    return this.restangular.one(this.route, id).one(this.route + 'view').get();
                },
                put: function (updatedResource) {
                    return updatedResource.put().$object;
                },
                update: function (updatedResource) {
                    return updatedResource.put().$object;
                },
                create: function (newResource) {
                    if( newResource.originalElement !== undefined ) {
                        delete newResource.originalElement;
                    }
                    return this.restangular.all(this.route).post(newResource);
                },
                remove: function (object) {
                    return this.restangular.one(this.route, object.id).remove();
                }
            };

            AbstractRepository.extend = function (repository) {
                repository.prototype = Object.create(AbstractRepository.prototype);
                repository.prototype.constructor = repository;
            };

            return AbstractRepository;
        }
    ]);
