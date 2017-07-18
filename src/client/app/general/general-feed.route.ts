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
                                return friendlyFire.getPosts().then((data) => {
                                    return data.entries;

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
