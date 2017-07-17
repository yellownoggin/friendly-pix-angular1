namespace friendlyPix {
    'use strict';

    angular
        .module('app.shared')
        .factory('Like', likeService)
        .factory('LikeCount', likeCountService);

    // Factories logic

    function likeCountService($firebaseArray) {
        return likeCount;

        function likeCount(postId) {
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
