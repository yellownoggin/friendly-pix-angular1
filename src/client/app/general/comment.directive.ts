namespace friendlyPix {
    'use strict';

    angular
        .module('app.shared')
        .directive('commentDirective', commentDirective);


    function commentDirective($timeout) {
        return {
            restict: 'EA',
            scope: {
                name: '='
            },
            templateUrl: 'app/general/comment-directive.html',
            controller: ($scope, friendlyFire, friendlyAngularFire) => {
                console.log('comment directive activated');
                let postId = $scope.name;
                $scope.postId = postId;
                const vm = $scope;


                friendlyAngularFire.getCommentsNew(postId).then((data) => {
                    $scope.c = data.length;
                    $scope.a = data;
                    // console.log('modulus', $scope.c  % $scope.a.length);

                    // console.log('scope a == data ', $scope.a === data);
                });

                // Submit new comments
                /**
                 * TODO:
                 * 1. Realtime updates of the comments when addComment called in submitComment/addComment
                 * @param  {[type]} !vm.picComment||vm.picComment.length===0 [description]
                 * @return {[type]}                                          [description]
                 */
                $scope.submitComment = (postId, commentVal) => {
                    if (!vm.picComment || vm.picComment.length === 0) {
                        return;
                    }
                    const commentText = commentVal;
                    friendlyFire.addComment(postId, commentText);
                    vm.picComment = '';

                };
            },
        };
    }
}
