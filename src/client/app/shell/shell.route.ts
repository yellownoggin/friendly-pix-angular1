// currently in core.config



// namespace friendlyPix {
//     'use strict';
//
//     angular
//         .module('app.spaPages')
//         .config(initRouter);
//
//         // @ngInject
//         function initRouter($stateProvider) {
//             $stateProvider
//                 .state('home', {
//                     url: '/',
//                     views: {
//                         content: {
//                             templateUrl: 'app/shell/shel.html',
//                             controller: 'ShellController',
//                             controllerAs: 'sc',
//                             resolve: {
//                                 'currentAuth': ['$firebaseAuth', ($firebaseAuth) => {
//                                     return $firebaseAuth().$waitForSignIn();
//                                 }]
//                             }
//                         }
//                     }
//                 });
//         }
// }
