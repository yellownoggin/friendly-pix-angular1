namespace friendlyPix {
    'use strict';

    angular
        .module('app.spaPages')
        .directive('commentDirective', commentDirective);


    function commentDirective($timeout) {
        return {
            restict: 'EA',
            scope: {
                name: '='
            },
            templateUrl: 'app/general/comment-directive.html',
            controller: ($scope, friendlyFire) => {
                let postId = $scope.name;
                $scope.postId = postId;
                const vm = $scope;

                friendlyFire.getCommentsNew(postId).then((data) => {
                    $scope.a = data;
                    console.log('data in the comment dir controller', data);
                });

                // Submit new comments
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
