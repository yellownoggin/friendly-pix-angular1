namespace friendlyPix {
    'use strict';


    angular
        .module('app.core')
        .config(initDebug)
        .config(initRouter)
        .config(initTheme);


    /**
     * Toggle debug info data (better disabled in production environments)
     * https://docs.angularjs.org/guide/production
     */
    // @ngInject
    function initDebug($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }


    /**
     * initRouter - Initialize the router's default behaviors
     */
    // @ngInject
    function initRouter($locationProvider, $urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');
        // TODO: $location provider
        $stateProvider
            .state('home', {
                abstract: true,
                url: '/',
                template: 'ui-view for the home page'
            });
    }

    /**
     * initTheme - sets up theme using angular material provider
     *
     */
    //   @ngInject
    function initTheme($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('gray')
            .accentPalette('orange');
    }


}
