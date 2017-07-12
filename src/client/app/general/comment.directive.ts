namespace friendlyPix {
    angular.module('app.spaPages')
        .directive('commentDirective', commentDirective);


        function commentDirective($timeout) {
            return {
                restict: 'EA',
                scope: {
                    name: '='
                },
                templateUrl: 'app/general/comment-directive.html',
                controller: ($scope, friendlyFire, AuthService, $firebaseArray, firebase) => {
                    // console.log('message', $scope.name);
                    let postId = $scope.name;
                    $scope.postId = postId;
                    $scope.b = 'hello';
                    const vm = $scope;
                    vm.database = firebase.database();
                    vm.currentUser = AuthService.Auth().$getAuth();

                    friendlyFire.getCommentsNew(postId).then((data) => {
                        $scope.a = data;
                        console.log('data in the comment dir controller', data);
                    });


                    $scope.submitComment = (postId, commentVal) => {
                        console.log('key', postId);
                        console.log('key', postId);
                        if (!vm.picComment || vm.picComment.length === 0) {
                            return;
                        }
                        const commentText = commentVal;
                        // console.log(commentText, 'commentText');
                        addComment(postId, commentText);
                        vm.picComment = '';

                        function addComment(postId, commentText) {
                            console.log(postId, 'Message');
                            console.log(commentText, 'commentText');
                            const commentObj = {
                                text: commentText,
                                timestamp: Date.now(),
                                author: {
                                    uid: vm.currentUser.uid,
                                    full_name: vm.currentUser.displayName,
                                    profile_picture: vm.currentUser.photoURL
                                }
                            };
                            console.log('commentObj', commentObj);

                            let ref = vm.database.ref(`comments/${postId}`);
                            let list = $firebaseArray(ref);
                            list.$add(commentObj).then(function(ref) {
                                var id = ref.key;
                                console.log('added record with id ' + id);
                                list.$indexFor(id); // returns location in the array
                            });


                        }

                    };

                    // $firebaseArray
                    $timeout(() => {
                        //  console.log('name', $scope.name);
                    }, 1);
                },
                link: (scope, element, attr, ctrl) => {
                    // console.log('scope.pId', scope.pId);
                    // console.log('attr.name 1', attr.name);
                    // console.log('scope', scope.name);
                    // $timeout(() => {
                    //      console.log('name', scope.name);
                    //      console.log('attr name', attr.name);
                    // }, 1);
                }
            };
        }
}
