namespace friendlyPix {
    'use strict';

    angular
        .module('app.user')
        .controller(UserController);

    function UserController($stateParams, friendlyFire, $firebaseAuth) {
        console.log('User Controller Instantiated');
        var vm = this;
        vm.uid = $stateParams.uid;
        vm.onFollowChange = onFollowChange;
        vm.authedUser = $firebaseAuth().$getAuth();


        vm.$onInit = () => {
            if (vm.authedUser) {
                vm.authedUserId = vm.authedUser.uid;
            }
        };
        // Controller methods

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
