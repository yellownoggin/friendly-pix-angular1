namespace friendlyPix {
    'use strict';

    angular
        .module('app.spaPages')
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
                            currentUser: (AuthService) => {
                                return AuthService.currentUser;
                            },
                            homeFeedData: (friendlyFire, AuthService) => {
                                // TODO: currentUserUid is rendered in the firebase.js
                                // const currentUserUid = AuthService.currentUserUid;

                                return getUpdatedHomeFeeds();

                                // TODO: put in feed.js
                                function getUpdatedHomeFeeds() {
                                    return friendlyFire.updateHomeFeeds().then(() => {
                                        return friendlyFire.getHomeFeedPosts().then((data) => {
                                            console.log('data', data);
                                            return data;
                                        });

                                    });
                                }
                            }

                        }
                    }
                }
            });
    }
}
