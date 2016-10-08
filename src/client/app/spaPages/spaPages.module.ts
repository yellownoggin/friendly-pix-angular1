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
                        controllerAs: 'hc',
                        resolve: {
                            'currentAuth': ['$firebaseAuth', ($firebaseAuth) => {
                                return $firebaseAuth().$waitForSignIn();
                            }]
                        }

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

    function HomeController(FbOarService, feeds, $firebaseAuth, $scope, currentAuth) {
        // TODO: Issues: initial controller loads promise fine
        // - but route change ( navigating away and back) does not
        // - need to get a definitive pattern for this
        // https://johnpapa.net/route-resolve-and-controller-
        // activate-in-angularjs/

        console.log('Home Controller initialized');
        var vm = this;
        vm.pixData = {};
        // vm.showNoPostsMessageContainer = undefined;
        vm.newPosts = {fred: 'fred'};



        // Controller activation methods
        activate();

        function activate() {
            if (currentAuth) {
                console.log($firebaseAuth().$getAuth().uid, 'current user');
                getHomeFeed();
                watchNewPosts();
            }
        }

        // this.$onInit = function () {
        // return getHomeFeed();
        // $scope.$watch('vm.newPosts', (n, o) => {
        //     console.log(vm.newPosts, 'vm.newPosts');
        //     console.log(Object.keys(vm.newPosts).length, 'vm.newPosts length');
        // });
        // };


        // Controller methods declarations

        if ($firebaseAuth().$getAuth()) {
            console.log($firebaseAuth().$getAuth().uid, 'current user');
        }

        // Get home feed posts

        function getHomeFeed() {
            feeds.showHomeFeed().then((results) => {
                console.log(results, 'results');
                if (results) {
                    hideNoPostsContainer();
                    vm.pixData = results[0];
                }
                feeds.subscribeToHomeFeed(vm.newPosts, results[1]);

            });
        }

        function hideNoPostsContainer() {
            console.log('hideNoPostsContainer called');
            vm.showNoPostsMessageContainer = false;
        }

        function watchNewPosts() {
            $scope.$watch('vm.newPosts', (n, o) => {
                console.log(vm.newPosts, 'vm.newPosts');
                console.log(Object.keys(vm.newPosts).length, 'vm.newPosts length');
            });
        }

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
