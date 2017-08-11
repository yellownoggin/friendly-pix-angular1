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
                            generalFeedData: (friendlyFire) => {
                                return friendlyFire.getPostsTest()
                                    .then((data) => {
                                        return data;
                                    })
                                    .catch((e) => {
                                        console.log('e in generalFeedData resolve: ', e);
                                    });
                            },
                            currentAuth: (Auth) => {
                                return Auth.$waitForSignIn();

                            }
                        }
                    }
                }
            });
    }
}
