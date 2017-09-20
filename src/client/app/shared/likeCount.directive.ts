namespace friendlyPix {
    'use strict';
    // TODO: combine this with like directive
    angular
        .module('app.shared')
        .directive('likeCount', likeCountDirective);


    function likeCountDirective($timeout) {
        return {
            restict: 'EA',
            scope: {
                post: '='
            },
            templateUrl: 'app/shared/likeCount.html',
            controller: ($scope, friendlyFire, firebase, $firebaseArray,
                $firebaseObject, $firebaseAuth, Auth, Like, LikeCount) => {
                let entryId = $scope.post;

                // Gets current and realtime syncs for new ones
                $scope.likeCount = LikeCount.getPostLikes(entryId);



            }
        };
    }
}
