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
                            controllerAs: 'gc'
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
