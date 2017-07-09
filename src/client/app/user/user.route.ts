namespace friendlyPix {
        'use strict';

        angular
            .module('app.user')
            .config(initRouter);

            function initRouter($stateProvider) {
                $stateProvider
                    .state('home.user', {
                        url: 'user/:uid',
                        views: {
                            content: {
                                templateUrl: 'app/spaPages/user.html',
                                controller: 'UserController',
                                controllerAs: 'uc'
                            }
                        }
                    });
            }

}
