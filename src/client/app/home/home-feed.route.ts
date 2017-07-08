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
                        // template: 'app/home/home-feed.html',
                        controller: 'HomeController',
                        controllerAs: 'hc',
                        resolve: {
                            'currentAuth': ['$firebaseAuth', ($firebaseAuth) => {
                                return $firebaseAuth().$waitForSignIn();
                            }],
                            '_pixData': ['feeds', (feeds, sharedDev) => {
                                // TODO: this holds up the app on initialization.
                                // without the try catch
                                try  {
                                    return feeds.getHomeFeed().then((results) => {
                                        if (results) {
                                            console.log(results, 'called from router resolve');
                                            return results;
                                        } else {
                                            console.log('Error showHomeFeed');
                                        }
                                    });
                                } catch (e) {
                                    console.error(e, 'error');
                                }

                            }]
                        }
                    }
                }
            });
    }
}
