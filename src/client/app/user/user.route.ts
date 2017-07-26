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

                            currentUser: (AuthService) => {
                                // TODO: AuthService refactor just return the one method not this.Auth
                                return AuthService.Auth().$getAuth();
                            },
                            profileData: ($stateParams, firebase, $firebaseObject) => {
                                return getCurrentProfileData();

                                function getCurrentProfileData() {
                                    let urlUid = $stateParams.uid;
                                    let pic;
                                    const personRef = firebase.database().ref('people').child(urlUid);
                                    return $firebaseObject(personRef).$loaded((data) => {
                                        return data;
                                    });
                                }

                            }



                        }
                        // _userFeedData: (friendlyFire) => {
                        //      return friendlyFire.getProfileFeed().then((data) => {
                        //          return data.entries;
                        //      });
                        // }
                    }
                }
            }
        });

}
