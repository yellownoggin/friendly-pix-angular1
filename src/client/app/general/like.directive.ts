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
                $firebaseObject, $firebaseAuth, AuthService, Like, LikeCount) => {
                    // console.log('like directive activated');
                let entryId = $scope.post;
                $scope.entryId = entryId;
                const vm = $scope;
                // TODO: fix auth service;
                vm.currentUser = $firebaseAuth().$getAuth();
                // console.log('current user in linke dire', vm.currentUser.uid);
                vm.database = firebase.database();
                $scope.updateUsersLike = updateUsersLike;

                // TODO: Issues: (this is trello only revisit)
                // 1.  on new login - after hide splash.
                // Directive does not get current user info.
                // It is reading or displaying and using the
                // prior user's auth info until refresh
                // AuthService.Auth().$onAuthStateChanged((fbUser) => {
                //     console.log('onAuthStateChanged called', fbUser);
                //     getUserLike(entryId, vm.currentUser.uid);
                // });
                // 2. likecount() unless in the click event
                // will not update the like count

                // LikeCount(entryId).$loaded().then((data) => {
                //     // console.log('data in likeCount', data.length);
                //     $scope.likeCount = data.length;
                //
                // });
                $scope.likeCount = LikeCount(entryId);


                // console.log('likeCount', likeCount);
                //  console.log('likeCount count', likeCount.count);
                // $timeout(() => { console.log('likeCount count', likeCount.count); }, 1000);

                // console.log('likeCount ref', likeCount.ref);
                // $scope.likeCountRef = likeCount.likeData.ref;
                // $scope.likeCountCount = vm.likeData.count;

                getUserLike(entryId, vm.currentUser.uid);



                function updateUsersLike(value) {
                    // creates a new ref likes and adds child uid and timestamp
                    $scope.like = Like(entryId, vm.currentUser.uid);
                    $scope.userLikeStatus = value;
                    console.log('scope.like', $scope.like);

                    let val = value ? firebase.database.ServerValue.TIMESTAMP : null;
                    console.log('val', val);
                    console.log('current user in like method', vm.currentUser.uid);
                    $scope.like.$value = val;
                    console.log('scope.like', $scope.like);

                    $scope.like.$save()
                        .then(() => {
                            console.log('Like saved');
                            // console.log('val', val);
                            LikeCount(entryId).$loaded().then((data) => {
                                console.log('data in likeCount', data.length);
                                $scope.likeCount = data.length;
                            });
                        })
                        .catch((error) => {
                            console.log('error in updateUsersLike', error);
                        });
                }
                // function updateUsersLike() {
                //     // creates a new ref likes and adds child uid and timestamp
                //     $scope.like = Like('Mary');
                //     console.log('scope.like', $scope.like);
                //     //
                //     let val = value ? firebase.database.ServerValue.TIMESTAMP : null;
                //     console.log('val', val);
                //     $scope.like[vm.currentUser.uid] = 1;
                //
                //     $scope.like.$save().then(() => {
                //         console.log('Like saved');
                //         console.log('val', val);
                //     })
                //     .catch((error) => {
                //         console.log('error in updateUsersLike', error);
                //     });
                // }








                // function updateLike(postId, value) {
                //     console.log('postId', postId);
                //     console.log('value', value);
                //     console.log('currentUser uid', vm.currentUser.uid);
                //
                //     // Update the like button on action/state
                //     vm.userLikeStatus = value;
                //
                //     // Set the current user like to database
                //     // TODO: can you use angularfire api here?
                //     // let ref = vm.database.ref(`likes/${postId}/${vm.currentUser.uid}`);
                //     let ref = vm.database.ref(`likes/${postId}`);
                //     let O = $firebaseObject(ref);
                //     O.$save
                //
                //     // let O = $firebaseObject(ref).$loaded()
                //     //     .then((data) => {
                //     //         console.log('data', data);
                //     //     })
                //     //     .catch((e) => {
                //     //         console.log('e', e);
                //     //     });
                //     // let ref2 = vm.database.ref(`likes/${postId}/total_likes`);
                //     // let val = value ? firebase.database.ServerValue.TIMESTAMP : null;
                //     // ref.set(val);
                //     // if()
                //     // ref2.set()
                // }
                //
                // TODO: future problem not sure where register comes into play at
                // firebase.js#L389 registerUserLike
                function getUserLike(postId, uid) {
                    console.log('uid in get User Like status', uid);
                    let ref = vm.database.ref(`likes/${postId}/${vm.currentUser.uid}`);
                    $firebaseObject(ref).$loaded()
                        .then((data) => {
                            console.log('log', data.$value);
                            if (data.$value) {

                                vm.userLikeStatus = true;
                                console.log('userlike value', vm.userLikeStatus);
                            } else {
                                vm.userLikeStatus = false;
                                console.log('userlike value', vm.userLikeStatus);
                            }

                        })
                        .catch((e) => {
                            console.log('Error in get user:', e);
                        });
                }



                // = (likeNumber, userLikeValue) => {
                //     console.log('ln', likeNumber);
                //     console.log('ulv', userLikeValue);
                //
                //     $scope.userLikeStatus = userLikeValue;
                //
                //     if (likeNumber === undefined) {
                //         likeNumber = 0;
                //     }
                //     likeNumber++;
                //
                //     $scope.likeNumber = likeNumber;
                //     console.log('ln bottom', likeNumber);
                // };

                function addLikeToPost(ln) {
                    // let ln = ln;


                }


            }
        };
    }
}


// const vm = $scope;
//
// friendlyFire.getCommentsNew(postId).then((data) => {
//     $scope.a = data;
//     console.log('data in the comment dir controller', data);
// });
//
// // Submit new comments
// $scope.submitComment = (postId, commentVal) => {
//     if (!vm.picComment || vm.picComment.length === 0) {
//         return;
//     }
//     const commentText = commentVal;
//     friendlyFire.addComment(postId, commentText);
//     vm.picComment = '';

// };
