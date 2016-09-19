var friendlyPix;
(function (friendlyPix) {
    'use strict';
    angular
        .module('app.core')
        .config(initDebug)
        .config(initRouter)
        .config(initTheme)
        .run(initDatabase);
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
    function initDatabase(firebase) {
        var config = {
            apiKey: "AIzaSyD9ItMOV_b4PlU0P68uerXoUDG_oqi74cg",
            authDomain: "friendlypix-angular1.firebaseapp.com",
            databaseURL: "https://friendlypix-angular1.firebaseio.com",
            storageBucket: "friendlypix-angular1.appspot.com",
            messagingSenderId: "428223190133"
        };
        firebase.initializeApp(config);
    }
})(friendlyPix || (friendlyPix = {}));
