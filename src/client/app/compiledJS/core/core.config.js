var friendlyPix;
(function (friendlyPix) {
    'use strict';
    angular
        .module('app.core')
        .config(initDebug)
        .config(initRouter);
    function initDebug($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }
    function initRouter($locationProvider, $urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
            url: '/',
            template: 'ui-view for the home page'
        });
    }
})(friendlyPix || (friendlyPix = {}));
