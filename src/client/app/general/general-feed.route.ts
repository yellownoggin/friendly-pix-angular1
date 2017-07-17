namespace friendlyPix {
    'use strict';

    angular
        .module('app.spaPages')
        .config(initRouter);

    function initRouter($stateProvider) {
        $stateProvider
            .state('home.generalFeed', {
                url: 'feed',
                views: {
                    content: {
                        templateUrl: 'app/general/general-feed.html',
                        controller: 'GeneralController',
                        controllerAs: 'gc',
                        resolve: {
                            generalFeedData: (friendlyFire, $q) => {
                                return friendlyFire.getPostsNew().then((data) => {
                                    return data;

                                });
                            }
                        },
                        signedIn: ($firebaseAuth) => {
                             return $firebaseAuth().$waitForSignIn();
                        }
                    }
                }
            });
    }
}
