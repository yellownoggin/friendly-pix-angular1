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
                views: {
                    shell: {
                        templateUrl: 'app/shell/shell.html',
                        controller: 'ShellController',
                        controllerAs: 'sc'
                    }
                }
            })

            /**
             * TODO:  see below
             * adding this here temporarily to test will put in home component
             * Show home.feed state on '/' (nested state)
             * Solution came from faq's ui-router:
             * https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-set-up-a-defaultindex-child-state
             */
            .state('home.feed', {
                url: '',
                views: {
                    content: {
                        template: 'testing content view'
                    }
                }
            })

    }

    /**
     * initTheme - sets up theme using angular material provider
     *
     */
    //@ngInject
    function initTheme($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('grey')
            .accentPalette('orange');
    }


}
