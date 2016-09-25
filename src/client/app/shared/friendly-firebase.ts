namespace friendlyPix {
    'use strict';

    /**
     * Handles all Firebase interactions.
     */
    angular
        .module('app.shared')
        .factory('friendlyFire', friendlyFirebaseFactory);


    // @ngInject
    function friendlyFirebaseFactory(latinize, $firebaseAuth, firebase, $q) {

        // setup
        var vm = this;
        vm.auth = $firebaseAuth();
        vm.user = $firebaseAuth().$getAuth();
        vm.database = firebase.database();
        vm.storage = firebase.storage();



        return {
            saveUserData: saveUserData,
            uploadNewPic: uploadNewPic
        };



        // Factor methods

        /**
         * saveUserData
         * Saves or updates public user data in Firebase (such as image URL,
         * display name...).
         */
        function saveUserData(imageUrl, displayName) {
            var user = vm.auth.$getAuth();
            if (!displayName) {
                displayName = 'Anonymous';
            }
            let searchFullName = displayName.toLowerCase();
            let searchReversedFullName = searchFullName.split(' ').reverse().join(' ');
            try {
                searchFullName = latinize(searchFullName);
                searchReversedFullName = latinize(searchReversedFullName);
            } catch (e) {
                console.error(e);
            }
            const updateData = {
                profile_picture: imageUrl,
                full_name: displayName,
                _search_index: {
                    full_name: searchFullName,
                    reversed_full_name: searchReversedFullName
                }
            };
            return vm.database.ref(`people/${user.uid}`).update(updateData);
        }


        function uploadNewPic(pic, thumb, fileName, text) {
            console.log(text, 'text');
            // Start the pic file upload to Firebase Storage
            var picRef = vm.storage.ref(`${vm.user.uid}/full/${Date.now()}/${fileName}`);
            var metadata = {
                contentType: pic.type
            };
            var picUploadTask = picRef.put(pic, metadata).then(snapshot => {
                console.log('New pic uploaded. Size in bytes:', snapshot.totalBytes);
                var url = snapshot.metadata.downloadURLs[0];
                console.log('File available at', url);
                return url;
            }).catch(error => {
                console.error('Error while uploading new pic', error);
            });
            var thumbRef = vm.storage.ref(`${vm.user.uid}/thumb/${Date.now()}/${fileName}`);
            var thumbUploadTask = thumbRef.put(thumb, metadata).then(snapshot => {
                console.log('New thumbRefthumbRefthumbRefthumbRef uploaded. Size in bytes:', snapshot.totalBytes);
                var url = snapshot.metadata.downloadURLs[0];
                console.log('File available at', url);
                return url;
            }).catch(error => {
                console.error('Error while uploading new thumb', error);
            });

            return $q.all([picUploadTask, thumbUploadTask]).then(urls => {
                // Once both pics and thumbnails has been uploaded add a new post in the firebase database and to expand outpost lists(users posts & home post).
                var newPostKey = vm.database.ref('/posts').push().key;
                var update = {};
                update[`/posts/${newPostKey}`] = {
                    full_url: urls[0],
                    thumb_url: urls[1],
                    text: text,
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    full_storage_uri: picRef.toString(),
                    thumb_storage_uri: thumbRef.toString(),
                    author: {
                        uid: vm.user.uid,
                        full_name: vm.user.displayName,
                        profile_picture: vm.user.photoURL
                    }
                };
                update[`/people/${vm.user.uid}/posts/${newPostKey}`] = true;
                update[`/feed/${vm.user.uid}/${newPostKey}`] = true;
                return vm.database.ref().update(update).then(() => newPostKey);
            })

        } // uploadNewPic
    }

}
