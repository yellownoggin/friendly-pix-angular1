namespace friendlyPix {
    'use strict';

    angular
        .module('app.spaPages')
        .config(initRouter);

        // @ngInject
        function initRouter($stateProvider) {
            $stateProvider
                .state('home', {
                    abstract: true,
                    url: '/',
                    views: {
                        shell: {
                            templateUrl: 'app/shell/shell.html',
                            controller: 'ShellController',
                            controllerAs: 'sc',
                            resolve: {
                                'currentAuth': ['AuthService', (AuthService) => {
                                    return AuthService.Auth().$waitForSignIn();
                                }]
                            }
                        }
                    }
                });
        }
}
