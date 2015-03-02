"use strict";angular.module("playerModule",["components","teamModule"]),angular.module("playerModule").config(["$translateProvider","appConfigProvider",function(e,t){e.translations("en",{playerTitle:"Player",crudAddPlayer:"Add Player",crudEditPlayer:"Edit Player",crudViewPlayer:"View Player"}),e.preferredLanguage(t.getLocale())}]),angular.module("playerModule").config(["$stateProvider","$urlRouterProvider",function(e){e.state("app.player.list",{url:"/list",ncyBreadcrumb:{label:"Player list"},controller:"PlayerListCtrl",templateProvider:["$templateCache",function(e){return e.get("playerModule/tpl/list.html")}]}).state("app.player.add",{url:"/add",ncyBreadcrumb:{label:"Player Add"},controller:"PlayerAddCtrl",templateProvider:["$templateCache",function(e){return e.get("playerModule/tpl/edit.html")}]}).state("app.player.edit",{url:"/edit/{id}",ncyBreadcrumb:{label:"Player Edit"},controller:"PlayerEditCtrl",templateProvider:["$templateCache",function(e){return e.get("playerModule/tpl/edit.html")}],resolve:{playerObj:["$stateParams","PlayerRepository",function(e,t){return t.get(e.id).then(function(e){return e})}]}}).state("app.player.view",{url:"/{id}",ncyBreadcrumb:{label:"Player View"},templateUrl:"playerModule/tpl/view.html",controller:"PlayerViewCtrl",templateProvider:["$templateCache",function(e){return e.get("playerModule/tpl/view.html")}],resolve:{playerObj:["$stateParams","PlayerRepository",function(e,t){return t.get(e.id).then(function(e){return e})}]}})}]),angular.module("playerModule").controller("PlayerAddCtrl",["_","$window","$rootScope","$scope","$state","$modal","$filter","$timeout","$location","growl","appConfig","TeamRepository","PlayerRepository","TeamService","PlayerService",function(e,t,r,a,o,l,n,i,u,c,s,m,d,p,y){var g={},f=n("translate");a.title=f("crudAddPlayer"),a.hasFormError=!1,a.formError={message:"",raw:{}};var P=function(e){var t=y.getFormSchema(e);a.schema=t.schema,a.form=t.form,a.model=angular.copy(g)},h=function(e){var t=null;return angular.forEach(a.teamCollection,function(r){r.id===e&&(t=r)}),t};a.resetForm=function(){a.model=angular.copy(g)},a.submitForm=function(e,t){a.$broadcast("schemaFormValidate");var r=h(t.team);e.$valid&&null!==r&&(a.submitPromise={promise:r.post("player",t).then(function(){a.hasFormError=!1,c.success(f("crudCreateSuccess"),{ttl:5e3})},function(e){c.error(f("crudCreateFailure"),{ttl:5e3}),a.hasFormError=!0,a.formError.message=e.statusText,a.formError.raw=e.data}),message:"",backdrop:!1,templateUrl:"application/tpl/loading.button.html",delay:0,minDuration:0})},a.teamCollection=m.getList().then(function(e){return 200===e.status&&P(e.data),a.teamCollection=e.data,a.teamCollection})}]),angular.module("playerModule").controller("PlayerEditCtrl",["$scope","$modal","$filter","$stateParams","$location","Restangular","TeamRepository","PlayerRepository","PlayerService","playerObj","_","growl",function(e,t,r,a,o,l,n,i,u,c,s,m){var d=r("translate"),p=angular.copy(c.data);e.title=d("crudEditPlayer"),e.hasFormError=!1,e.formError={message:"",raw:{}};var y=function(t){var r=u.getFormSchema(t);e.schema=r.schema,e.form=r.form,e.model=angular.copy(p),e.model.team=1};e.resetForm=function(r,a){var o="components/ui/modals/tpl/modalCrudResetForm.html",l="ModalCrudResetFormController",n=t.open({keyboard:"false",templateUrl:o,controller:l,resolve:{resource:function(){return{resource:a}}}});n.result.then(function(t){void 0!==t.action&&("cancelChange"===t.action||"processChange"===t.action&&(e.model=angular.copy(p)))})},e.submitForm=function(t,r){e.$broadcast("schemaFormValidate"),t.$valid&&(s.extend(c.data,r),e.submitPromise={promise:c.data.put().then(function(){e.hasFormError=!1,m.success(d("crudUpdateSuccess"),{ttl:5e3})},function(t){m.error(d("crudUpdateFailure"),{ttl:5e3}),e.hasFormError=!0,e.formError.message=t.statusText,e.formError.raw=t.data}),message:"",backdrop:!1,templateUrl:"application/tpl/loading.button.html",delay:0,minDuration:0})},e.teamCollection=n.getList().then(function(t){return 200===t.status&&y(t.data),e.teamCollection=t.data,e.teamCollection})}]),angular.module("playerModule").controller("PlayerListCtrl",["$scope","$stateParams","$location","$modal","Restangular","PlayerRepository","_",function(e,t,r,a,o,l){e.currentPage=1,e.perPage=10,e.meta={};var n=function(){l.getList({page:e.currentPage,per_page:e.perPage}).then(function(t){e.player=t.data,e.meta=t.data.meta,i(t.data.meta)})},i=function(t){if(void 0===e.initialisedPagination){e.initialisedPagination=!0;e.totalItems=parseInt(t.total*t.pages,10),e.totalItems=parseInt(t.total,10),e.perPage=parseInt(t.per_page,10),e.maxSize=5,e.bigCurrentPage=1}};e.setPage=function(t){e.currentPage=t},e.pageChanged=function(){n(!0,{page:e.currentPage,limit:e.perPage})},e["delete"]=function(e){var t="components/ui/modals/tpl/modalCrudDelete.html",r="ModalCrudDeleteController",o=a.open({keyboard:"false",templateUrl:t,controller:r,resolve:{resource:function(){return{resource:e}}}});o.result.then(function(t){void 0!==t.action&&("cancelChange"===t.action||"processChange"===t.action&&l.remove(e).then(function(){n()}))})},n()}]),angular.module("playerModule").controller("PlayerCtrl",["$scope","$state","PlayerRepository",function(){}]),angular.module("playerModule").controller("PlayerViewCtrl",["$scope","$stateParams","$location","$filter","Restangular","TeamRepository","PlayerRepository","PlayerService","playerObj","_",function(e,t,r,a,o,l,n,i,u,c){var s=angular.copy(u.data),m=a("translate");e.title=m("crudViewPlayer");var d=function(t){var r=i.getFormSchema(t);e.schema=r.schema,e.form=r.form,e.model=angular.copy(s)};e.resetForm=function(){e.model=angular.copy(s)},e.submitForm=function(t,r){e.$broadcast("schemaFormValidate"),t.$valid&&(c.extend(u.data,r),u.data.put().then(function(e){console.log(e)}))},e.teamCollection=l.getList().then(function(t){return 200===t.status&&d(t.data),e.teamCollection=t.data,e.teamCollection})}]),angular.module("playerModule").factory("PlayerRepository",["RestFullResponse","AbstractRepository","Restangular",function(e,t){function r(){t.call(this,e,"player")}return t.extend(r),new r}]),angular.module("playerModule").factory("PlayerService",["$rootScope","$q","TeamRepository",function(e,t){var r=null,a=function(e){var t=[],r=[];return angular.forEach(e,function(e){r.push(e.id),t.push({value:e.id,name:e.name})}),{form:["name",{key:"team",type:"select",titleMap:t}],schema:{type:"object",title:"Edit Player",properties:{name:{type:"string",minLength:2,title:"Name",description:""},team:{title:"Team",type:"integer","enum":r}},required:["name","team"]}}},o=function(t){r=t,e.$broadcast("PlayerService.activeModel:change",r)};return{getFormSchema:function(e){return a(e)},exportModel:function(){},setModel:function(e){return o(e)},getActiveModel:function(){var e=t.defer();return null!==r?e.resolve(r):e.reject({}),e.promise}}}]);
angular.module("playerModule").run(["$templateCache", function($templateCache) {$templateCache.put("playerModule/tpl/edit.html","<div class=\"container-fluid\">\n<div class=\"row\">\n	<div class=\"col-lg-12\">\n\n		<h2><a ui-sref=\"^.list\" class=\"btn btn-large btn-default btn-round\">\n			<i class=\"fa fa-angle-left\"></i>\n		</a></h2>\n	</div>\n</div>\n\n<div class=\"row\">\n	<div class=\"col-lg-12 bg-content\">\n		<div class=\"row\">\n			<div class=\"col-lg-12\">\n\n				<form  name=\"playerForm\" ng-submit=\"submitForm(playerForm,model)\">\n					<h2>{{ title }}</h2>\n					<div  class=\"form-group\" sf-schema=\"schema\" sf-form=\"form\" sf-model=\"model\"></div>\n					<div class=\"form-group\">\n						<div class=\"col-sm-offset-2 col-sm-10\">\n							<p class=\" pull-right\">\n								<a href=\"javascript:void(0);\" class=\"btn btn-lg btn-round btn-warning\"\n								   ng-click=\"resetForm(playerForm,model)\"><i class=\"fa fa-trash\"></i></a>\n								<button type=\"submit\"\n										cg-busy=\"submitPromise\"\n										class=\"btn btn-default btn-round btn-success\"\n										ng-click=\"submit()\"\n										pop=\"{{formError.message}}\"\n										pop-title=\"yayaa\"\n										pop-show=\"{{ hasFormError }}\" pop-placement=\"bottom\"\n										>\n									<i class=\"fa fa-check\"><span ></span></i>\n								</button>\n							</p>\n						</div>\n					</div>\n\n				</form>\n			</div>\n			<div class=\"col-lg-12\">\n				<div ng-if=\"hasFormError\">\n					<h4>An error occured</h4>\n					<p>{{formError.message}}</p>\n					<h5>Server returned</h5>\n					<pre>{{formError.raw | json }}</pre>\n				</div>\n			</div>\n		</div>\n\n		</div>\n	</div>\n</div>\n\n\n");
$templateCache.put("playerModule/tpl/list.html","<div class=\"row\">\n    <div class=\"col-lg-12\">\n\n        <h2>{{\'playerTitle\'|translate}}<a ui-sref=\"^.add\" href=\"\" class=\"btn btn-default  btn-round btn-warning pull-right\">\n            <i class=\"fa fa-plus\"></i>\n        </a></h2>\n    </div>\n</div>\n<div class=\"row\">\n    <div class=\"col-lg-12\">\n        <div class=\"widget\">\n            <div class=\"widget-header\">\n                <i class=\"fa fa-tasks\"></i><span ncy-breadcrumb-last></span>\n                <input st-search=\"\" type=\"text\" placeholder=\"Search\" class=\"form-control input-sm pull-right\"\n                       ng-if=\"dashboard.userData.config.searchable\"/>\n                <div class=\"clearfix\"></div>\n            </div>\n            <div class=\"widget-body medium no-padding no-height-limit\">\n                <div class=\"table-responsive\">\n                    <table class=\"table\">\n                        <tbody>\n                        <tr ng-repeat=\"player in player\">\n                            <td>\n                                <a ui-sref=\"^.view({id:player.id})\" href=\"\">#{{player.id}} - {{player.name}}</a>\n                                <span class=\"pull-right\">\n                            <a class=\"btn btn-default btn-xs btn-round btn-info\" ui-sref=\"^.edit({id:player.id})\">\n                                <i class=\"fa fa-pencil\"></i>\n                            </a>\n                          <a class=\"btn btn-default btn-xs btn-round btn-warning\" ng-click=\"delete(player)\">\n                              <i class=\"fa fa-trash\"></i>\n                          </a>\n                                </span>\n                            </td>\n                        </tr>\n                        </tbody>\n                    </table>\n                    <div class=\"text-center\">\n                        <pagination\n                                ng-model=\"currentPage\"\n                                ng-change=\"pageChanged(page)\"\n                                total-items=\"totalItems\" items-per-page=\"perPage\"\n                                page=\"bigCurrentPage\"\n                                max-size=\"maxSize\" class=\"pagination-md\"\n                                boundary-links=\"true\" rotate=\"true\" num-pages=\"numPages\"\n                                previous-text=\"previous\"\n                                next-text=\"next\"\n                                first-text=\"first\"\n                                last-text=\"last\">\n                        </pagination>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("playerModule/tpl/main.html","<div ui-view>\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<h2 ncy-breadcrumb-last></h2>\n			<div class=\"breadcrumb-links\">\n				<div ncy-breadcrumb></div>\n			</div>\n		</div>\n	</div>\n</div>\n");
$templateCache.put("playerModule/tpl/view.html","<div class=\"container-fluid\">\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n\n			<h2><a ui-sref=\"^.list\" class=\"btn btn-large btn-default btn-round\">\n				<i class=\"fa fa-angle-left\"></i>\n			</a> <a href=\"/player/edit/{{model.id}}\" class=\"btn btn-default  btn-round btn-warning pull-right\">\n				<i class=\"glyphicon glyphicon-pencil\"></i>\n			</a></h2>\n		</div>\n	</div>\n\n	<div class=\"row\">\n		<div class=\"col-lg-12 bg-content\">\n			<div class=\"row\">\n				<div class=\"col-lg-12\">\n\n					<form name=\"playerForm\" ng-submit=\"submitForm(playerForm,model)\">\n						<h2>{{ title }}</h2>\n\n						<div class=\"form-group\" sf-schema=\"schema\" sf-form=\"form\" sf-model=\"model\"\n							 sf-options=\"{ formDefaults: { readonly: true } }\"></div>\n					</form>\n				</div>\n			</div>\n\n		</div>\n	</div>\n</div>\n");}]);