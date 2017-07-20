namespace friendlyPix {
    'use strict';

    // TODO: rename file to service or factory
    // service makes more sense here since it is returning data??*

    angular
        .module('app.shared')
        .factory('Like', likeService)
        .factory('LikeCount', likeCountService);

    // Factories/ logic

    // TODO: technically a service more like a factory
    // Used this as end inspiration:
    // https://github.com/gordonmzhu/angular-course-demo-app-v2/
    // blob/master/src/app/core/party.service.js

    function likeCountService($firebaseArray, $rootScope) {
        return {
            getPostLikes: getPostLikes
        };

        function getPostLikes(postId) {
            let ref = firebase.database().ref(`likes/${postId}`);
            return $firebaseArray(ref);
        }

    }


    /**
     * [likeService description]
     * @param  {[type]} $firebaseObject [description]
     * @param  {[type]} firebase        [description]
     * @return {[type]}                 [description]
     */
    function likeService($firebaseObject, firebase) {

        return like;

        function like(postId, uid) {
            // create a reference to the database node where we will store our database
            let ref = firebase.database().ref('likes');
            let likeRef = ref.child(`${postId}`).child(`${uid}`);



            // return it as a synchronized object
            return $firebaseObject(likeRef);
        }

    }
}
