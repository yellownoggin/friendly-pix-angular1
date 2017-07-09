namespace friendlyPix {
    'use strict';


    angular
        .module('app.shell')
        .controller('ShellController', ShellController);

    function ShellController(currentAuth, AuthService,
        friendlyFire, $timeout, $state) {
        // TODO: logic out of the constoller
        var vm = this;

        vm.$onInit = () => {
            console.log('ShellController initialized');
            vm.showSplash = true;
            vm.showLogin = true;
            vm.currentAuth = currentAuth;
            vm.hideSplash = hideSplash;
            showHideSplash(currentAuth);
            showLogin(currentAuth);
        };


        // Contoller methods (Used in view)
        vm.signInWithGoogle = signInWithGoogle;
        vm.signOut = signOut;


        //////////  Controller method logic

        function signInWithGoogle() {
            AuthService.Auth().$signInWithPopup('google').then((result) => {
                friendlyFire.saveUserData(result.user.photoURL, result.user.displayName);
                vm.hideSplash();
            }).catch(function(error) {
                console.error('Authentication failed:', error);
            });
        }

        function signOut() {
            AuthService.Auth().$signOut();
            AuthService.Auth().$onAuthStateChanged(function(firebaseUser) {
                if (firebaseUser) {
                    console.log('Signed in as:', firebaseUser.uid);

                } else {
                    console.log('Signed out');
                    // fixes profile & splash controller not seeing the change in auth
                }
            });
            vm.showSplash = true;
            vm.showLogin = true;
        }

        /**
         * showSplash - controls
         * 1) the splash visibility
         * 2) currentUid binding
         */
        function showHideSplash(auth) {
            if (auth === null) {
                vm.showSplash = true;
            } else {
                hideSplash();
                vm.currentUid = auth.uid;
            }
        }

        /**
         * TODO: put in helper methods
         * hideSplash
         */
        function hideSplash() {
            $timeout(() => {
                vm.showSplash = false;
            }, 1000);

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



    } //Controller

}
