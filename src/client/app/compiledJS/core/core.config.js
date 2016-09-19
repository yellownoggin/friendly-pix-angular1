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
            views: {
                shell: {
                    templateUrl: 'app/shell/shell.html',
                    controller: 'ShellController',
                    controllerAs: 'sc'
                }
            }
        })
            .state('home.feed', {
            url: '',
            views: {
                content: {
                    template: 'testing content view'
                }
            }
        });
    }
    function initTheme($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('grey')
            .accentPalette('orange');
    }
})(friendlyPix || (friendlyPix = {}));
