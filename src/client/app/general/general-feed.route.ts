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
                                    // Reverse data entries so descending by date
                                    var fillPostData = {};
                                    var reversedPostData = {};
                                    var commentData = {};
                                    let p = Object.keys(data.entries);
                                    // Used for the comments set up
                                    const pReversed = p.reverse();

                                    for (let i = p.length - 1; i >= 0; i--) {

                                        // TODO: abstraction and docs
                                        reversedPostData[p[i]] = data.entries[p[i]];

                                    }
                                    return reversedPostData;

                                });
                            }
                        },
                        //     generalFeedDataAF: (friendlyFire, $q) => {
                        //         return friendlyFire.getPostsNew().then((data) => {
                        //             return data.entries;
                        //
                        //         });
                        //     }
                        // },
                        signedIn: ($firebaseAuth) => {
                             return $firebaseAuth().$waitForSignIn();
                        }
                    }
                }
            });
    }
}
