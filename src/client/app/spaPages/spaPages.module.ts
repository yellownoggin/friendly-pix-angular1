namespace friendlyPix {
    'use strict';

    angular
        .module('app.spaPages', ['ui.router', 'firebase'])
        .config(initRouter)
        .controller('HomeController', HomeController);



    /**
     * initRouter - configure routes for spa pages
      * Show home.feed state on '/' (nested state)
      * Solution came from faq's ui-router:
      * https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-set-up-a-defaultindex-child-state
      */

    // @ngInject
    function initRouter($stateProvider) {
        $stateProvider
            .state('home.feed', {
                url: '',
                views: {
                    content: {
                        templateUrl: 'app/spaPages/home.html',
                        controller: 'HomeController',
                        controllerAs: 'hc',
                        resolve: {
                            "currentAuth": ['AuthService', (AuthService) => {
                                return AuthService.Auth().$waitForSignIn();
                            }]
                        }
                    }
                }
            })
    }

    function HomeController(currentAuth) {

        console.log('home controller initialized')
        var vm = this;



        showLogin(currentAuth);
        // Controller methods


        /**
         * showLogin - description
         * TODO:  fill out
         */
        function showLogin(auth) {
            console.log(auth, 'auth');
            if (auth  === null) {
                vm.showLogin = true;
            } else {
                vm.showLogin = false;
            }
        }
    }


    // spaPages Services (maybe site on re-factor)
    // @ngInject
    // TODO: ngInject in the right place?
    angular
        .module('app.spaPages')
        .service('AuthService', AuthService)

    function AuthService($firebaseAuth) {

        this.Auth = Auth;


        // Service methods
        function Auth() {
            return $firebaseAuth();
        }
    }



}
