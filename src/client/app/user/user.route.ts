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
                                return Auth.$waitForSignIn();
                            },
                            profileData: ($stateParams, firebase, $firebaseObject) => {
                                return getCurrentProfileMetaData($stateParams.uid);
                                function getCurrentProfileMetaData(userPageUid) {
                                    let urlUid = userPageUid;
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
