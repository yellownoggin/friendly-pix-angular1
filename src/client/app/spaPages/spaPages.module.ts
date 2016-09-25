namespace friendlyPix {
    'use strict';

    angular
        .module('app.spaPages', ['ui.router', 'firebase'])
        .config(initRouter)
        .controller('HomeController', HomeController)
        .controller('UserController', UserController)
        .controller('AddPicController', AddPicController);



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
            })
            .state('home.user', {
                url: 'user/:uid',
                views: {
                    content: {
                        templateUrl: 'app/spaPages/user.html',
                        controller: 'UserController',
                        controllerAs: 'uc'
                    }
                }
            })
            .state('home.addPicture', {
                url: 'add-picture',
                views: {
                    content: {
                        templateUrl: 'app/spaPages/add-picture.html',
                        controller: 'AddPicController',
                        controllerAs: 'ac'
                    }
                }
            })
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

    function HomeController() {

        console.log('Home Controller initialized')
        var vm = this;
        // Controller methods

    }

    function UserController($stateParams) {
        console.log('User Controller Instantiated');
        var vm = this;
        vm.uid = $stateParams.uid;
    }

    function AddPicController(uploadHelper) {
        console.log('Add Pic Controller Instantiated');
        var vm = this;
        vm.imageUrl = uploadHelper.getImageUrl();
        vm.uploadPic = uploadHelper.uploadPic;

    }
    function PostController(uploadHelper) {
        console.log('Post Controller Instantiated');
        var vm = this;
    }



}
