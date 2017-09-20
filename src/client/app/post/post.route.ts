namespace friendlyPix {
    'use strict';

    angular
        .module('app.post')
        .config(initRouter);

    function initRouter($stateProvider) {
        $stateProvider
            .state('home.post', {
                url: 'post/:postId',
                views: {
                    content: {
                        templateUrl: 'app/post/post.html',
                        controller: 'PostController',
                        controllerAs: 'pc',
                        resolve: {
                            currentUser: (Auth) => {
                                return Auth.$waitForSignIn();
                            },
                            postData: ($stateParams, friendlyFire, $firebaseObject) => {
                                // const currentUserUid = Auth.Auth().$getAuth().uid;
                                const currentPostId = $stateParams.postId;
                                return getPost(currentPostId);
                                function getPost(postId) {
                                    console.log('get post called');
                                    let postRef = friendlyFire.database.ref(`/posts/${postId}`);
                                    return $firebaseObject(postRef).$loaded().then((data) => {
                                        console.log('data in resolve', data);
                                        return data;
                                    });
                                }
                             }

                        }

                    }

                }
            });


    }
}
