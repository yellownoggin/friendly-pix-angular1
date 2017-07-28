namespace friendlyPix {
    'use strict';

    angular
        .module('app.user')
        .controller('UserController', UserController);

    function UserController($stateParams, friendlyFire, $firebaseAuth,
        currentUser, firebase, $firebaseObject, profileData, feeds, $q, $scope) {
        //   _userFeedData
        console.log('User Controller Instantiated');
        var vm = this;
        vm.uid = $stateParams.uid;
        vm.onFollowChange = onFollowChange;
        vm.authedUser = $firebaseAuth().$getAuth();
        vm.currentUserUid = vm.authedUser.uid;
        vm.database = firebase.database();

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

            ///// Staging Init

            // userPage user's info
            vm.personObj = profileData;
            vm.userPageUsersId = profileData.$id;
            // get profile users posts length

            vm.personObjPostsCount = getUserPagePostsCount(profileData.posts);


            // Following behavior
            // toggleFollowUser
            // let currentUsersProfile =
            vm.showToggleFollow = showToggleFollow;
            vm.toggleFollowUserTest = toggleFollowUserTest;
            vm.toggleFollowUser = toggleFollowUser;

            // TODO: may have to go into a route resolve (remember state parameters
            // will be needed in a change to the method parameters current user & user page user)
            // Updata: works with out being in route guess because the data is here already and controller
            //  seems like it will update the promise at least once - will not work with watchers (multiple
            //  promise fills after the instantiation)
            trackFollowStatus().then((data) => {
                // do somethings this the follow button
                // enable it as well
                // change the label from following to follow
                // refreshswitchstate??
                // TODO: try the ternary
                vm.currentFollowedState = data.val() !== null;
                vm.followLabel = data.val() ? 'Following' : 'Follow';
                console.log('vm.currentFollowedState', vm.currentFollowedState);
                console.log('vm.followLabel ', vm.followLabel );


            });



        };
        // Controller methods


        // Staging

        function getUserPagePostsCount(postsRef) {
            if (postsRef) {
                let a =  feeds.convertToArray(postsRef);
                return a.length;
            } else {
                return '0';
            }
        }



        // followbutton (knowing the curent follow state)
        // and then tracking it when changes
        /**
         * Starts tracking the "Follow" checkbox status
         * Requires the current user id and the userpage's user's id
         */
        function trackFollowStatus() {
            if (vm.currentUserUid) {
                // regitertofollowstatusupdate
                return registerToFollowStatusUpdate(vm.userPageUsersId);

            }
        }


        function registerToFollowStatusUpdate(userPageUid) {
            let defer = $q.defer();

            let followingStatusRef = vm.database.ref(`/people/${vm.currentUserUid}/following/${userPageUid}`);
            // TODO: try catch on this type of method (on) since there is no documentation showing a error callback
            followingStatusRef.on('value', (data) => {
                defer.resolve(data);
            // TODO: add to firebase refs
        });

            return defer.promise;
    }



        /**
         * toggleFollowUser - TODO:
         * followedUserid - userId  from user page( not current authorized user)
         * follow is a boolean(from checked)
         * returns {promise}
         */
        function toggleFollowUser(followedUserId, follow) {
            // add or removed posts from users homepage
            // TODO: How do you inject firebase rough with followed uid
            // Can establish it in the controller
            // console.log(vm.user.uid, 'vm.user.uid inside toggle follow');
            // console.log(followedUserId, 'followedUserId');
            return vm.database.ref(`/people/${followedUserId}/posts`)
                .once('value')
                .then(data => {

                    const updateData = {};
                    // TODO: why let
                    let lastPostId = true;
                    console.log(follow, 'follow');
                    // add followed users post to home feed
                    data.forEach(post => {
                        // updateData[`/feed/${vm.user.uid}/${post.key}`] =
                        //     follow ? !!follow : null;
                        lastPostId = post.key;
                    });
                    // console.log(updateData, 'sport');

                    // Add followed user to the 'following' list.
                    updateData[`/people/${vm.currentUserUid}/following/${followedUserId}`] =
                        follow ? lastPostId : null;

                    // And the to the was the followers
                    updateData[`/followers/${followedUserId}/${vm.currentUserUid}`] =
                        follow ? !!follow : null;

                    return vm.database.ref().update(updateData);
                });

        }





        function toggleFollowUserTest(followedUserId, followState) {
            // https://docs.angularjs.org/api/ng/directive/ngChange
            // console.log('toggleFollowUserTest', toggleFollowUserTest);
            console.log('followState', followState);
            console.log('followedUserId', followedUserId);
            // A. add followedUserId's posts to feed/currentUserUid/   = true
            // 1. get the followedUsersPosts
            // 2. store individual followedUserId posts refs = followState(null if false)
            //      - stored in an update Object
            // 3. collect the latestPostId of followedUserId (why?)
            // beyond using it in the following ref TODO:
            // return?
            return vm.database.ref(`/people/${followedUserId}/posts`).once('value').then((data) => {
                    const updateData = {};
                    let lastPostId = true;
                    data.forEach((post) => {
                        updateData[`/feed/${vm.currentUserUid}/${post.key}`] =
                            followState ? !!followState : null;
                        lastPostId = post.key;
                    });

                    // B. add followedUserId to people/currentUserUid/following/ = latestPostId
                    updateData[`/people/${vm.currentUserUid}/following/${followedUserId}`] = followState
                        ? lastPostId : null;
                    // C. add this current logged in user to followers/followingId/currentUserUid
                    updateData[`/followers/${followedUserId}/${vm.currentUserUid}/`] =
                        followState ? !!followState : null;

                    return vm.database.ref().update(updateData);
                })
                .catch((e) => { console.log('e', e); });
        }

        function showToggleFollow(currentUserUid, userProfileId) {
            // console.log('currentUserUid', currentUserUid);
            // console.log('userProfileId', userProfileId);
            // console.log('currentUserUid === userProfileI', currentUserUid === userProfileId);
            let a = currentUserUid === userProfileId ? true : false;
            return a;
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
