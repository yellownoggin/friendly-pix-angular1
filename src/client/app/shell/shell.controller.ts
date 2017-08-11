namespace friendlyPix {
    'use strict';


    angular
        .module('app.shell')
        .controller('ShellController', ShellController);

    function ShellController(currentAuth, Auth,
        friendlyFire, $timeout, $state, FbOarService, $scope, $window) {
        // TODO: logic out of the constoller
        var vm = this;

        vm.$onInit = () => {
            console.log('ShellController initialized');
            vm.showSplash = true;
            vm.showLogin = true;
            vm.currentAuth = currentAuth;
            vm.hideSplash = hideSplash;
            vm.showUserInfoForDevelopment = showUserInfoForDevelopment;
            showHideSplash(currentAuth);
            showLogin(currentAuth);
        };


        // Contoller methods (Used in view)
        vm.signInWithGoogle = signInWithGoogle;
        vm.signOut = signOut;
        vm.skipSignIn = skipSignIn;


        function showUserInfoForDevelopment() {
            $window.alert(`User id: ${vm.currentAuth.uid} & Name: ${vm.currentAuth.displayName}`);
        }

        //////////  Controller method logic

        function skipSignIn() {
            vm.showSplash = false;
            $state.go('home.generalFeed');
        }

        function signInWithGoogle() {
            const gProvider = FbOarService.gProvider;


            // TODO: Issue: on new login (coming from anogher user login state)
            // - after hide splash. Directive does not get current user info. tried:
            // keeps the old state
            // 1. scope.apply
            // 2. $state.go('home-generalFeed'); to kick start directive controller  actions
            // both did not work.
            // note:
            // reloading the page (after login makes it work as expecting)


            Auth.$signInWithPopup(gProvider).then((result) => {
                console.log('result.user.displayName', result.user.displayName);
                console.log('result.user', result.user);

                friendlyFire.saveUserData(result.user.photoURL, result.user.displayName);
                vm.hideSplash();
            }).catch(function(error) {
                console.error('Authentication failed:', error);
            });
        }

        function signOut() {
            Auth.$signOut();
            Auth.$onAuthStateChanged(function(firebaseUser) {
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
