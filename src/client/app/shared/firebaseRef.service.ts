 namespace friendlyPix {
       'use strict';


       angular
        .module('app.shared')
        .service('FbOarService', FbOarService);

        function FbOarService($firebaseArray, $firebaseRef, $firebaseAuth) {
            console.log('hello from array service');
            // set up
            var vm = this;
            vm.currentUser = $firebaseAuth().$getAuth();
            // console.log(vm.currentUser.uid);


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
