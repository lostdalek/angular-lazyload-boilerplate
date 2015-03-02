'use strict';
angular.module('components')
    .provider('ObjectPath', function(){
        this.parse = window.ObjectPath.parse;
        this.stringify = window.ObjectPath.stringify;
        this.normalize = window.ObjectPath.normalize;
        this.$get = function(){
            return window.ObjectPath;
        };
    });

