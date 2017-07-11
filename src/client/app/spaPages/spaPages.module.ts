namespace friendlyPix {
    'use strict';

    angular
        .module('app.spaPages', ['ui.router', 'firebase'])
        .config(initRouter);

    /**
     * initRouter - configure routes for spa pages
      * Show home.feed state on '/' (nested state)
      * Solution came from faq's ui-router:
      *  https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-set-up-a-defaultindex-child-state
      */

      // TODO: clean up home.post route
    // @ngInject
    function initRouter($stateProvider) {
        $stateProvider
            .state('home.post', {
                url: 'post/:postId',
                views: {
                    content: {
                        controller: 'PostController',
                        controllerAs: 'pc',
                        templateUrl: 'app/spaPages/post.html'
                    }
                }
            });
    }


    function PostController(uploadHelper) {
        console.log('Post Controller Instantiated');
        var vm = this;

    }



}
