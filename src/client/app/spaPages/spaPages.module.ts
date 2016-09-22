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
                        controllerAs: 'hc'
                    }
                }
            });
    }

    function HomeController() {

        console.log('home controller initialized')
        var vm = this;




        // Controller methods


    }



}
