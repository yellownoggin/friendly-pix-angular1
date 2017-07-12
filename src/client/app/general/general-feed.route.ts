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
                            generalDataDescending: (friendlyFire, $q) => {

                                // TODO: should this go in the method as property ie. data.reversedEntries
                                return friendlyFire.getPostsNew().then((data) => {
                                    // console.log('data in the r', data);
                                    return data;
                                    // Reverse data entries so descending by date
                                    // var fillPostData = {};
                                    // var reversedPostData = {};
                                    // var commentData = {};
                                    // let p = Object.keys(data.entries);
                                    // Used for the comments set up
                                    // const pReversed = p.reverse();

                                    // for (let i = p.length - 1; i >= 0; i--) {
                                    //
                                    //     // TODO: abstraction and docs
                                    //     reversedPostData[p[i]] = data.entries[p[i]];
                                    //
                                    // }
                                    // return reversedPostData;
                                });
                        },
                        rComments: (friendlyFire) => {

                            return friendlyFire.getCommentsNew().then((data) => {
                                // console.log('comment data in the r', data);
                                return data;
                            });
                        }

                    }
                }
            }
            });
    }
}


// resolve: {
//     'currentAuth': ['$firebaseAuth', ($firebaseAuth) => {
//         return $firebaseAuth().$waitForSignIn();
//     }],
//     '_pixData': ['feeds', (feeds, sharedDev) => {
//         return feeds.showHomeFeed().then((results) => {
//             if (results) {
//                 console.log('called from router resolve');
//
//                 return results;
//             } else {
//                 console.log('Error showHomeFeed');
//             }
//         });
//     }]
// }
