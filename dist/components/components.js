"use strict";angular.module("components",[]).factory("RestFullResponse",["Restangular",function(t){return t.withConfig(function(t){t.setFullResponse(!0)})}]).factory("AbstractRepository",[function(){function t(t,e){this.restangular=t,this.route=e}return t.prototype={getList:function(t){return this.restangular.all(this.route).getList(t)},get:function(t){return this.restangular.one(this.route,t).get()},getView:function(t){return this.restangular.one(this.route,t).one(this.route+"view").get()},put:function(t){return t.put().$object},update:function(t){return t.put().$object},create:function(t){return void 0!==t.originalElement&&delete t.originalElement,this.restangular.all(this.route).post(t)},remove:function(t){return this.restangular.one(this.route,t.id).remove()}},t.extend=function(e){e.prototype=Object.create(t.prototype),e.prototype.constructor=e},t}]),angular.module("components",[]).provider("appConfig",[function(){var t="en",e="dev",n={debug:!0,locale:t,env:e},o={dev:{locale:t,localisation:{numberFormat:",.0f"},overrideLangDefinitions:!1,staticPath:"",basePath:"",defaultCollectionLimit:10,defaultCollectionPage:1,resources:{baseUrl:"http://localhost:3000/",grantType:"password",endPoints:{backendApi:{path:"api/"}}}}},r=null,a=function(t){var e=angular.copy(n);return void 0!==t&&(e=angular.extend(e,t)),r=o[e.env],r.locale=e.locale,"undefined"!=typeof window.envConfiguration&&(r.basePath=window.envConfiguration.basePath,r.staticPath=window.envConfiguration.staticPath,r.resources.baseUrl=window.envConfiguration.apiBaseUrl),r};return{getLocale:function(){return null===r&&a(),r.locale},getContextConfiguration:function(){return null===r&&a(),r},setContextConfiguration:function(t){return a(t),r},$get:["$q",function(){return{getLocale:function(){return t},get:function(t){return void 0!==r[t]?r[t]:null}}}]}}]),angular.module("components").factory("AbstractRepository",[function(){function t(t,e){this.restangular=t,this.route=e}return t.prototype={getList:function(t){return this.restangular.all(this.route).getList(t)},get:function(t){return this.restangular.one(this.route,t).get()},getView:function(t){return this.restangular.one(this.route,t).one(this.route+"view").get()},put:function(t){return t.put().$object},update:function(t){return t.put().$object},create:function(t){return void 0!==t.originalElement&&delete t.originalElement,this.restangular.all(this.route).post(t)},remove:function(t){return this.restangular.one(this.route,t.id).remove()}},t.extend=function(e){e.prototype=Object.create(t.prototype),e.prototype.constructor=e},t}]),angular.module("components").factory("RestFullResponse",["Restangular",function(t){return t.withConfig(function(t){t.setFullResponse(!0)})}]),angular.module("oc.lazyLoad.uiRouterDecorator",["ui.router"]).config(["$stateProvider",function(t){function e(t,e,n){var o;return{templateProvider:function(){return o.promise},resolve:["$templateCache","$ocLazyLoad","$q",function(r,a,i){return o=i.defer(),a.load({name:t,files:angular.isArray(e)?e:[e]}).then(function(){o.resolve(n&&r.get(n))})}]}}t.decorator("views",function(t,n){var o={},r=n(t);return angular.forEach(r,function(t,n){if(t.lazyModule&&t.lazyFiles&&t.lazyTemplateUrl){var r=e(t.lazyModule,t.lazyFiles,t.lazyTemplateUrl);t.resolve.$lazyLoader=r.resolve,t.lazyTemplateUrl&&(t.templateProvider=r.templateProvider)}o[n]=t}),r})}]),angular.module("components").constant("_",window._),angular.module("components").constant("Modernizr",window.Modernizr),angular.module("components").provider("ObjectPath",function(){this.parse=window.ObjectPath.parse,this.stringify=window.ObjectPath.stringify,this.normalize=window.ObjectPath.normalize,this.$get=function(){return window.ObjectPath}}),angular.module("components").controller("ModalCrudDeleteController",["$scope","$sce","appConfig","$modalInstance",function(t,e,n,o){t.closeModal=function(){o.close()},t.cancelChange=function(){o.close({action:"cancelChange"})},t.processChange=function(){o.close({action:"processChange"})}}]),angular.module("components").controller("ModalCrudResetFormController",["$scope","$sce","appConfig","$modalInstance",function(t,e,n,o){t.closeModal=function(){o.close()},t.cancelChange=function(){o.close({action:"cancelChange"})},t.processChange=function(){o.close({action:"processChange"})}}]);
angular.module("components").run(["$templateCache", function($templateCache) {$templateCache.put("components/ui/modals/tpl/modalCrudDelete.html","\n<div class=\"modal-header\">\n    <button type=\"button\" class=\"close\" prevent-default ng-click=\"closeModal()\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>\n    <h4 class=\"modal-title\">Information\n    </h4>\n</div>\n<div class=\"modal-body\">\n    <p>Are you sure you want to remove this client?</p>\n</div>\n\n<div class=\"modal-footer\">\n    <p>\n        <a class=\"btn btn-primary\" href=\"#\"  prevent-default ng-click=\"cancelChange()\">Cancel</a>\n        <a class=\"btn btn-primary\" href=\"#\"  prevent-default ng-click=\"processChange()\">Yes</a></p>\n</div>\n");
$templateCache.put("components/ui/modals/tpl/modalCrudResetForm.html","\n<div class=\"modal-header\">\n	<button type=\"button\" class=\"close\" prevent-default ng-click=\"closeModal()\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>\n	<h4 class=\"modal-title\">Information\n	</h4>\n</div>\n<div class=\"modal-body\">\n	<p>Are you sure you want to reset changes?</p>\n</div>\n\n<div class=\"modal-footer\">\n	<p>\n		<a class=\"btn btn-primary\" href=\"#\"  prevent-default ng-click=\"cancelChange()\">Cancel</a>\n		<a class=\"btn btn-primary\" href=\"#\"  prevent-default ng-click=\"processChange()\">Yes</a></p>\n</div>\n");}]);