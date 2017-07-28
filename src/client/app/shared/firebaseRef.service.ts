namespace friendlyPix {
    'use strict';


    angular
        .module('app.shared')
        .service('FbOarService', FbOarService);

    function FbOarService($firebaseArray, $firebaseRef, $firebaseAuth, firebase) {
        
        // set up
        var vm = this;
        vm.currentUser = $firebaseAuth().$getAuth();
        vm.gProvider = gProvider();
        // console.log(vm.currentUser.uid);

        function gProvider() {
            let gProvider = new firebase.auth.GoogleAuthProvider();
            gProvider.setCustomParameters({
                prompt: 'select_account'
            });

            return gProvider;
        }

        /**
         *
         */
        /////// Returned service methods

        //////// Dynamic child refs
        if (vm.currentUser) {
            vm.followingRef = $firebaseRef.people.child(`${vm.currentUser.uid}/following`);
            vm.followingArray = $firebaseArray(vm.followingRef);
        }
        // vm.followingRef = $firebaseRef.people.child(`${vm.currentUser.uid}/following`);

        /////// Arrays
        // vm.peopleArray  = $firebaseArray($firebaseRef.peopleArray);
        // vm.followingArray = $firebaseArray(vm.followingRef);


        // this.currentUserFeed = $firebaseArray($firebaseRef.feedArray.child(currentUser.uid));


    }
}
