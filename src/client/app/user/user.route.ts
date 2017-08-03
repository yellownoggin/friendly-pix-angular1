namespace friendlyPix {
    'use strict';

    angular
        .module('app.user')
        .config(initRouter);

    function initRouter($stateProvider) {
        $stateProvider
            .state('home.user', {
                url: 'user/:uid',
                views: {
                    content: {
                        templateUrl: 'app/user/user.html',
                        controller: 'UserController',
                        controllerAs: 'uc',
                        resolve: {

                            currentUser: (Auth) => {
                                // TODO: Auth refactor just return the one method not this.Auth
                                return Auth.$getAuth();
                            },
                            profileData: ($stateParams, firebase, $firebaseObject) => {
                                return getCurrentProfileMetaData();

                                function getCurrentProfileMetaData() {
                                    let urlUid = $stateParams.uid;
                                    let pic;
                                    const personRef = firebase.database().ref('people').child(urlUid);
                                    return $firebaseObject(personRef).$loaded((data) => {
                                        return data;
                                    });
                                }

                            },
                            profileFeedData: (friendlyFire, $stateParams, feeds) => {
                                return friendlyFire.getUsersPageFeedPosts($stateParams.uid).then((data) => {
                                    console.log('profile data in the resolve', data);
                                    return data;
                                 });
                            }
                        }

                    }

                }
            });

    }
}
