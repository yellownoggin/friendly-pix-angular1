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
                                return friendlyFire.getPosts().then((data) => {
                                    // Reverse data entries so descending by date
                                    var fillPostData = {};
                                    var reversedPostData = {};
                                    // var commentData = {};
                                    let p = Object.keys(data.entries);
                                    // Used for the comments set up
                                    // const pReversed = p.reverse();

                                    for (let i = p.length - 1; i >= 0; i--) {

                                        // set up comments
                                        // console.log('p[i]', p[i]);

                                        reversedPostData[p[i]] = data.entries[p[i]];
                                        var promises = [];
                                        var defer = $q.defer();
                                        // console.log(p[i], 'p[i]');

                                     ((j) => {
                                        //  console.log(j, 'j');
                                        var commentData = friendlyFire.getComments(j).then((c) => {
                                                    // console.log('c.entries', c.entries);
                                                    // TODO: work around bc c.entries
                                                    // had a unique id as the key for the comment that I was unable to
                                                    // access in the ng-repeat
                                                    // how to I clear in thei scenario the object of the unique key
                                                    var a = Object.keys(c.entries);
                                                    angular.forEach(a, (b) => {
                                                        reversedPostData[p[i]]['comments'] = c.entries[b];
                                                    });

                                                    // console.log('reversedPostData', reversedPostData[p[i]]);

                                                });
                                        promises.push(commentData);

                                     })(p[i]);

                                     $q.all(promises).then(() => {
                                         defer.resolve(reversedPostData);
                                     });


                                        // console.log('reversedPostData', reversedPostData);
                                        // console.log('commentData', commentData);
                                        // reversedPostData[p[i]] = data.entries[p[i]];
                                        // reversedPostData[p[i]] = commentData;
                                    }


                                    // console.log('defer p', defer.promise);
                                    return defer.promise;
                                });
                                //
                                // .then((data) => {
                                //     var reversedPostData
                                //     // var commentData = {};
                                //     let p = Object.keys(data.entries);
                                //     // Used for the comments set up
                                //     // const pReversed = p.reverse();
                                //
                                //     for (let i =  0; i <  0; 1) {
                                //
                                //  })
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
