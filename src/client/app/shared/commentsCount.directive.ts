namespace friendlyPix {
    'use strict';

    angular
        .module('app.shared')
        .directive('commentCount', commentCountDirective);
// TODO: refactor clean up see also trello user page feed post parts
    function commentCountDirective($timeout) {
        return {
            restict: 'EA',
            scope: {
                post: '='
            },
            templateUrl: 'app/shared/commentCount.html',
            controller: ($scope, friendlyFire, firebase, $firebaseArray) => {
                const entryId = $scope.post;

                // Get comments
                // vm.getCommentsCount = getCommentsCount;
                $scope.getCommentsCount = getCommentsCount(entryId);


                function getCommentsCount(postId) {
                    console.log('get comments count called', postId);
                    const ref = firebase.database().ref(`/comments/${postId}`);
                    return $firebaseArray(ref);
                }



            }
        };
    }
}
