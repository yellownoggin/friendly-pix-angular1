namespace friendlyPix {
    'use strict';


    angular
        .module('app.core')
        .config(initDebug)
        .config(initRouter)
        .config(initTheme)
        .run(initDatabase);


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
            });
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

    /**
     * initDatabase - initialize current real-time database with firebase
     * TODO:  separate database into a service best practice?
     */
    //@ngInject
    function initDatabase(firebase) {
        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyD9ItMOV_b4PlU0P68uerXoUDG_oqi74cg",
            authDomain: "friendlypix-angular1.firebaseapp.com",
            databaseURL: "https://friendlypix-angular1.firebaseio.com",
            storageBucket: "friendlypix-angular1.appspot.com",
            messagingSenderId: "428223190133"
        };
        firebase.initializeApp(config);
    }

}
