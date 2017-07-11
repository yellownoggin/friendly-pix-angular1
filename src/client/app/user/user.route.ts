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
                                templateUrl: 'app/user/user.html',
                                controller: 'UserController',
                                controllerAs: 'uc',
                                resolve: {

                                    currentUser: (AuthService) => {
                                        // TODO: AuthService refactor just return the one method not this.Auth
                                        return AuthService.Auth().$getAuth();
                                    },
                                    _userFeedData: (friendlyFire) => {
                                         return friendlyFire.getProfileFeed().then((data) => {
                                             return data.entries;
                                         });
                                    }
                                }
                            }
                        }
                    });
            }

}
