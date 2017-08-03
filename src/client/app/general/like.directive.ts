namespace friendlyPix {
    'use strict';

    angular
        .module('app.spaPages')
        .directive('likeDirective', likeDirective);


    function likeDirective($timeout) {
        return {
            restict: 'EA',
            scope: {
                post: '='
            },
            templateUrl: 'app/general/like-directive.html',
            controller: ($scope, friendlyFire, firebase, $firebaseArray,
                $firebaseObject, $firebaseAuth, Auth, Like, LikeCount) => {
                // TODO: basic clean up and controller pattern init, reveal, etc
                // console.log('like directive activated');
                let entryId = $scope.post;
                $scope.entryId = entryId;
                const vm = $scope;
                // TODO: fix auth service;
                vm.currentUser = $firebaseAuth().$getAuth();
                // console.log('current user in linke dire', vm.currentUser.uid);
                vm.database = firebase.database();
                $scope.updateUsersLike = updateUsersLike;

                // Gets current and realtime syncs for new ones
                $scope.likeCount = LikeCount.getPostLikes(entryId);


                getUserLikeStatus(entryId, vm.currentUser.uid);



                function updateUsersLike(value) {
                    // creates a new ref likes and adds child uid and timestamp
                    $scope.like = Like(entryId, vm.currentUser.uid);
                    $scope.userLikeStatus = value;
                    let val = value ? firebase.database.ServerValue.TIMESTAMP : null;
                    $scope.like.$value = val;

                    $scope.like.$save()
                        .then(() => {
                            console.log('Like saved');
                        })
                        .catch((error) => {
                            console.log('error in updateUsersLike', error);
                        });
                }

                // TODO: future problem not sure where register comes into play at
                // firebase.js#L389 registerUserLike
                function getUserLikeStatus(postId, uid) {
                    // console.log('uid in get User Like status', uid);
                    let ref = vm.database.ref(`likes/${postId}/${vm.currentUser.uid}`);
                    $firebaseObject(ref).$loaded()
                        .then((data) => {
                            // console.log('log', data.$value);
                            if (data.$value) {

                                vm.userLikeStatus = true;
                                // TODO: like testing logs
                                // console.log('userlike value', vm.userLikeStatus);
                            } else {
                                vm.userLikeStatus = false;
                                // console.log('userlike value', vm.userLikeStatus);
                            }

                        })
                        .catch((e) => {
                            console.log('Error in get user:', e);
                        });
                }

            }
        };
    }
}
