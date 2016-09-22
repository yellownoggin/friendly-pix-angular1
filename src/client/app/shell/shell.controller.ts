namespace friendlyPix {
    'use strict';

    angular
        .module('app.shell')
        .controller('ShellController', ShellController);

    function ShellController(currentAuth, AuthService, friendlyFire) {
        console.log('Shell Controller World!');

        var vm = this;
        vm.showSplash = true;
        vm.signInWithGoogle = signInWithGoogle;
        vm.showLogin = true;
        vm.hideSplash = hideSplash;
        vm.signOut = signOut;


        showHideSplash(currentAuth);
        showLogin(currentAuth);


        //////////  Shell methods

        function signInWithGoogle() {
            AuthService.Auth().$signInWithPopup('google').then((result) => {
                friendlyFire.saveUserData(result.user.photoURL, result.user.displayName);
                vm.hideSplash();
            }).catch(function(error) {
                console.error("Authentication failed:", error);
            });
        }

        function signOut() {
            AuthService.Auth().$signOut();
            AuthService.Auth().$onAuthStateChanged(function(firebaseUser) {
                if (firebaseUser) {
                    console.log("Signed in as:", firebaseUser.uid);

                } else {
                    console.log("Signed out");
                    // fixes profile & splash controller not seeing the change in auth
                 }
            });
            vm.showSplash = true;
            vm.showLogin = true;
        }

        /**
         * showSplash - description
         * TODO:  fill out
         */
        function showHideSplash(auth) {
            if (auth === null) {
                vm.showSplash = true;
            } else {
                hideSplash();
            }
        }

        /**
         * TODO: put in helper methods
         * hideSplash
         */
        function hideSplash() {
            vm.showSplash = false;
        }

        /**
         * showLogin - description
         * TODO:  fill out
         */
        function showLogin(auth) {
            if (auth === null) {
                vm.showLogin = true;
            } else {
                vm.showLogin = false;
            }
        }



    } // /ShellController

}
