namespace friendlyPix {
    'use strict';

     angular
       .module('app.splash')
       .controller('SplashController', SplashController);

       function SplashController(currentAuth) {
           console.log('Splash controller initiated.');
           console.log('Splash controller current uid: ', currentAuth);
       }
}
