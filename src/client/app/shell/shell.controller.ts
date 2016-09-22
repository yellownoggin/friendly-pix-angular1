namespace friendlyPix {
     'use strict';

     angular
         .module('app.shell')
         .controller('ShellController', ShellController);

         function ShellController(currentAuth) {
             console.log('Shell Controller World!');

             var vm = this;
             vm.showSplash = true;


             showHideSplash(currentAuth);
             showLogin(currentAuth);

            //  Shell methods

            /**
             * showSplash - description
             * TODO:  fill out
             */
            function showHideSplash(auth) {
                // if authed hidesplash(using animation)
                // if not authed showsplash = true
                console.log(auth, 'auth');
                if (auth  === null) {
                    vm.showSplash = true;
                } else {
                    hideSplash();
                }
            }

            function hideSplash() {
                vm.showSplash = false;
            }




            /**
             * showLogin - description
             * TODO:  fill out
             */
            function showLogin(auth) {
                console.log(auth, 'auth');
                if (auth  === null) {
                    vm.showLogin = true;
                } else {
                    vm.showLogin = false;
                }
            }



         }

}
