namespace friendlyPix {
    'use strict';


    angular
        .module('app.post')
        .controller('PostController', PostController);

    function PostController($filter, friendlyFire,
        $scope, currentUser, feeds, firebase, $stateParams, $firebaseObject, postData, $q, $window, $state) {
        console.log('General Controller instantiated.');
        var vm = this;

        // TODO: use initialize? - get clarity -  $onInit as well
        initialize();

        // initialize
        function initialize() {
            vm.database = firebase.database();
            vm.currentUser = currentUser;

            // GetPostData
            vm.postId = $stateParams.postId;
            vm.postInfo = null;
            vm.postInfo = postData;
            console.log('postinfo', postData);



            // Delete post (auth required to see)

            console.log('hello');
            vm.showDeletePostLink = showDeletePostLink(postData.author.uid);
            vm.deletePostWrapper = deletePostWrapper;



        }


        ///// Staging Controller Logic



        // TODO: sweet alert
        function deletePostWrapper(postId, picStorageUri, thumbStorageUri) {
            deletePost(postId, picStorageUri, thumbStorageUri)
                .then((data) => {
                    console.log('data in deletpostwrapper', data);
                    $window.alert('post deleted');
                    $state.go('home.user', {uid:vm.currentUser.uid});
                })
                .catch((e) => {
                    console.log('error in deletPostWrapper', e);
                });
        }



        function showDeletePostLink(postAuthor) {
            if (vm.currentUser && (postAuthor  === vm.currentUser.uid) ) {
                return true;
            } else {
                return false;
            }
        }

        /**
   * Deletes the given post from the global post feed and the user's post feed. Also deletes
   * comments, likes and the file on Cloud Storage.
   */
        function deletePost(postId, picStorageUri, thumbStorageUri) {
            // console.log(`Deleting ${postId}`);
            // values and params that I will need
            // 1. current authed user it
            // 2. postId (param)
            // 3. picStorageUri & thumbStorageUri (params)
            // 4. database & storage references
            console.log('postId', postId);
            console.log('picStorageUri', picStorageUri);
            console.log('thumbStorageUri', thumbStorageUri);

            const updateObj = {};
            // TODO: updateObj full of references pattern
            updateObj[`/people/${vm.currentUser.uid}/posts/${postId}`] = null;
            updateObj[`/comments/${postId}`] = null;
            updateObj[`/likes/${postId}`] = null;
            updateObj[`/posts/${postId}`] = null;
            updateObj[`/feed/${vm.currentUser.uid}/${postId}`] = null;
            const deleteFromDatabase = friendlyFire.database.ref().update(updateObj);
            if (picStorageUri) {
                const deletePicFromStorage = friendlyFire.storage.refFromURL(picStorageUri).delete();
                const deleteThumbFromStorage = friendlyFire.storage.refFromURL(thumbStorageUri).delete();
                return $q.all([deleteFromDatabase, deletePicFromStorage, deleteThumbFromStorage]);
            }


            return deleteFromDatabase;
        }




        ///// End Of Staging

        // Controller methods




    } // controller
}
