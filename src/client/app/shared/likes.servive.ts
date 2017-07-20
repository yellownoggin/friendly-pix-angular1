namespace friendlyPix {
    'use strict';

    // TODO: rename file to service

    angular
        .module('app.shared')
        .factory('Like', likeService)
        .factory('LikeCount', likeCountService);

    // Factories logic

    function likeCountService($firebaseArray, $rootScope) {


        return likeCount;


        function likeCount(postId) {
            // let self = {};
            // console.log('self', self);
            let likeData = {};

            let ref = firebase.database().ref(`likes/${postId}`);
            //
            likeData['ref'] = $firebaseArray(ref);

            // $firebaseArray(ref).$loaded().then((data) => {
            //     if (!data.length) {
            //         likeData['count'] = 0;
            //     } {
            //         likeData['count'] = data.length;
            //     }
            //
            // });

            return likeData;

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
