var friendlyPix;
(function (friendlyPix) {
    'use strict';
    angular
        .module('app.core')
        .config(initDebug)
        .config(initRouter)
        .config(initTheme);
    function initDebug($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }
    function initRouter($locationProvider, $urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
            abstract: true,
            url: '/',
            template: 'ui-view for the home page'
        });
    }
    function initTheme($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('gray')
            .accentPalette('orange');
    }
})(friendlyPix || (friendlyPix = {}));
