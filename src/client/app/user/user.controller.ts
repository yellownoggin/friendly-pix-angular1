namespace friendlyPix {
    'use strict';

    angular
        .module('app.user')
        .controller('UserController', UserController);

    function UserController($stateParams, friendlyFire, $firebaseAuth,
         currentUser, firebase, $firebaseObject, profileData) {
            //   _userFeedData
        console.log('User Controller Instantiated');
        var vm = this;
        console.log('$stateParams', $stateParams);
        vm.uid = $stateParams.uid;
        vm.onFollowChange = onFollowChange;
        vm.authedUser = $firebaseAuth().$getAuth();

        // TODO: nm refers to object for new code controller needs re-factor
        // (currentUser info may come from resolve versus state parameters)


        vm.$onInit = () => {
            if (vm.authedUser) {
                vm.authedUserId = vm.authedUser.uid;
            }
            const nm = this;
            nm.displayName = currentUser.displayName;
            nm.profilePicture = currentUser.photoURL;
            // console.log(_userFeedData, 'message');
            // nm._userFeedData = _userFeedData;

            // Staging Init
            vm.userPageName = null;
            vm.userPagePic = null;

            // let urlUid = $stateParams.uid;
            // const personRef = firebase.database().ref('people').child(urlUid);
            // vm.personObj = $firebaseObject(personRef);
            vm.personObj = profileData;
            // console.log('profilePic', profilePic);
            // let personObj = $firebaseObject(personRef).$loaded((data) => {
            //     vm.userPageName = data.full_name;
            //     vm.userPagePic = data.profile_picture;
            //  });
            // console.log('personObj', personObj);
        };
        // Controller methods


        // Staging


        function getUserPageUser(pageUid) {

        }


        // End of Staging




        /*
        * Triggered when the user changes the "Follow" checkbox.
        */
        function onFollowChange(switchState) {

            // TODO:  why return?
            console.log(vm.authedUserId, 'authedUserId onFollowChange');
            console.log(vm.uid, 'vm.uid onFollowChane');

            if (vm.authedUserId !== vm.uid) {
                console.log('onFollowChange called');
                return friendlyFire.toggleFollowUser(vm.uid, switchState)
                    .then(() => {
                        // TODO: add a toast (not in demo but maked sense)
                        console.log('This follower was updated');
                    });
            } else {
                console.log('onFollowChange not called');
            }
        }
    } // controller
}
