namespace friendlyPix {
    'use strict';

    angular
      .module('app.splash')
      .config(initRouter);

      function initRouter($stateProvider) {
          $stateProvider
          .state('home.splash', {
              url: '',
              views: {
                  content: {
                      templateUrl: 'app/splash/splash.html',
                      controller: 'SplashController',
                      controllerAs: 'splash',
                      resolve: {
                          currentAuth: (Auth) => {
                              return Auth.$waitForSignIn();
                          }
                      }
                  }
              }
          });
      }

}
