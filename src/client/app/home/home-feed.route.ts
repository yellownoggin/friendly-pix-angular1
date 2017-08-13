namespace friendlyPix {
    'use strict';

    angular
        .module('app.home')
        .config(initRouter);


    // @ngInject
    function initRouter($stateProvider) {
        $stateProvider
            .state('home.feed', {
                url: '',
                views: {
                    content: {
                        templateUrl: 'app/home/home-feed.html',
                        controller: 'HomeController',
                        controllerAs: 'hc',
                        resolve: {
                            currentUser: (Auth) => {
                                return Auth.$requireSignIn();
                            },
                            homeFeedData: (friendlyFire) => {
                                return friendlyFire.getUpdatedHomeFeeds();
                            }

                        }
                    }
                }
            });
    }
}
