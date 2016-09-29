namespace friendlyPix {
    'use strict';


    // Initialize Firebase outside of the angular app* per the firebase angular youtube conventions

    var config = {
        apiKey: 'AIzaSyD9ItMOV_b4PlU0P68uerXoUDG_oqi74cg',
        authDomain: 'friendlypix-angular1.firebaseapp.com',
        databaseURL: 'https://friendlypix-angular1.firebaseio.com',
        storageBucket: 'friendlypix-angular1.appspot.com',
        messagingSenderId: '428223190133'
    };

    //  TODO: how to get this recoginized
    firebase.initializeApp(config);

    angular
        .module('app.core')
        .config(initDebug)
        .config(initRouter)
        .config(initTheme)
        .config(initfirebaseRef)
        .constant('latinize', latinize)
        // .run(initDatabase);
        // .constant('firebaseUi', firebaseui.auth.AuthUI)
        // .constant('firebaseMe', firebase)



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
                        controllerAs: 'sc',
                        resolve: {
                            "currentAuth": ['AuthService', (AuthService) => {
                                console.log(AuthService.Auth().$waitForSignIn());
                                return AuthService.Auth().$waitForSignIn();
                            }]
                        }
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
    function initfirebaseRef($firebaseRefProvider) {
        $firebaseRefProvider.registerUrl({
            default: config.databaseURL,
            people: `${config.databaseURL}/people`,
            feedArray: `${config.databaseURL}/feed`,
            postsArray: `${config.databaseURL}/posts`
        })
    }


}
