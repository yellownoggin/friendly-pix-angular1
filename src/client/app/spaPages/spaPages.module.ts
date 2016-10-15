namespace friendlyPix {
    'use strict';

    angular
        .module('app.spaPages', ['ui.router', 'firebase'])
        .config(initRouter)
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



    function UserController($stateParams, friendlyFire, $firebaseAuth) {
        console.log('User Controller Instantiated');
        var vm = this;
        vm.uid = $stateParams.uid;
        vm.onFollowChange = onFollowChange;
        vm.authedUser = $firebaseAuth().$getAuth();


        vm.$onInit = () => {
            if (vm.authedUser) {
                vm.authedUserId = vm.authedUser.uid;
            }
        };
        // Controller methods

        /*
        * Triggered when the user changes the "Follow" checkbox.
        */
        function onFollowChange(switchState) {

            // TODO:  why return?
            console.log(vm.authedUserId, 'authedUserId onFollowChange');
            console.log(vm.uid, 'vm.uid onFollowChane');

            if (vm.authedUserId !== vm.uid) {
                console.log('onFollowChange called');
                return friendlyFire.toggleFollowUser(vm.uid, switchState)
                    .then(() => {
                        // TODO: add a toast (not in demo but maked sense)
                        console.log('This follower was updated');
                    });
            } else {
                console.log('onFollowChange not called');
            }
        }
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
