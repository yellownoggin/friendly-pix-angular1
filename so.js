// namespace friendlyPix {
//     'use strict';
//
//     angular
//         .module('app.spaPages')
//         .config(initRouter);
//
//
//     // @ngInject
//     function initRouter($stateProvider) {
//         $stateProvider
//             .state('home.feed', {
//                 url: '',
//                 views: {
//                     content: {
//                         templateUrl: 'app/home/home-feed.html',
//                         controller: 'HomeController',
//                         controllerAs: 'hc',
//                         resolve: {
//                             'currentAuth': ['$firebaseAuth', ($firebaseAuth) => {
//                                 return $firebaseAuth().$waitForSignIn();
//                             }],
//                             '_pixData': ['feeds', (feeds, sharedDev) => {
//                                 return feeds.showHomeFeed().then((results) => {
//                                     if (results) {
//                                         console.log('called from router resolve');
//
//                                         return results;
//                                     } else {
//                                         console.log('Error showHomeFeed');
//                                     }
//                                 });
//                             }]
//                         }
//                     }
//                 }
//             });
//     }
// }
