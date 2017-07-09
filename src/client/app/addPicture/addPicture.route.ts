namespace friendlyPix {
    'use strict';

    angular
        .module('app.addPicture')
        .config(initRouter);

        // @Inject
        function initRouter($stateProvider) {
            $stateProvider
                .state('home.addPicture', {
                    url: 'add-picture',
                    views: {
                        content: {
                            templateUrl: 'app/spaPages/add-picture.html',
                            controller: 'AddPicController',
                            controllerAs: 'ac'
                        }
                    }
                });
            }
    }
