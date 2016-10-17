namespace friendlyPix {
    'use strict';

    /**
     * Handles all Firebase interactions.
     */
    angular
        .module('app.shared')
        .factory('friendlyFire', friendlyFirebaseFactory);


    // @ngInject
    function friendlyFirebaseFactory(latinize, $firebaseAuth, firebase, $q, FbOarService) {

        // setup
        var vm = this;
        vm.auth = $firebaseAuth();
        vm.user = $firebaseAuth().$getAuth();
        vm.database = firebase.database();
        vm.storage = firebase.storage();
        vm.deleteFromFeed = deleteFromFeed;
        vm._getPaginatedFeed = _getPaginatedFeed;
        vm.updateHomeFeeds = updateHomeFeeds;
        vm.getPostData = getPostData;
        vm.$q = $q;


        // private values
        var POSTS_PAGE_SIZE = 5,
            USER_PAGE_POSTS_PAGE_SIZE = 6;


        return {
            saveUserData: saveUserData,
            uploadNewPic: uploadNewPic,
            updateHomeFeeds: updateHomeFeeds,
            toggleFollowUser: toggleFollowUser,
            getHomeFeedPosts: getHomeFeedPosts,
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
                // Once both pics and thumbnails has been uploaded add a
                //  new post in the firebase database and to expand outpost
                //  lists(users posts & home post).
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
            });

        } // uploadNewPic


        function updateHomeFeeds() {
            // Gets current authorized user/following reference*
            var followingRef = vm.database.ref(`/people/${vm.user.uid}/following`);

            // return an empty promise
            return followingRef.once('value', followingData => {
                // Start listening to the followed users post to populate home feed
                var following = followingData.val();
                if (!following) {
                    return;
                }
                var updateOperations = Object.keys(following).map(followedUid => {
                    // Get followed users posts set up
                    var followedUserPostsRef = vm.database.ref(`/people/${followedUid}/posts`);
                    // lastSyncedPostId is stored with the following/followedUsersUid  under the current user
                    var lastSyncedPostId = following[followedUid];
                    // Only add posts not previously synced - using startat
                    if (lastSyncedPostId instanceof String) {
                        followedUserPostsRef = followedUserPostsRef.orderByKey().startAt(lastSyncedPostId);
                    }
                    // Listen for data(postSnap)
                    return followedUserPostsRef.once('value', postData => {
                        var updates = {};
                        if (!postData.val()) {
                            return;
                        }
                        // iterate through the posts  add 2 current users feed
                        //  update last post id to for next update
                        // store in the updates object
                        Object.keys(postData.val()).forEach(postId => {
                            if (postId !== lastSyncedPostId) {
                                updates[`/feed/${vm.user.uid}/${postId}`] = true;
                                updates[`/people/${vm.user.uid}/following/${followedUid}`] = postId;
                            }
                        });
                        // update database with update object(filled with the information above)
                        return vm.database.ref().update(updates);
                    });
                });
                return $q.all(updateOperations);
            });
        }


        /**
         * toggleFollowUser - TODO:
         * followedUserid - userId  from user page( not current authorized user)
         * follow is a boolean(from checked)
         * returns {promise}
         */
        function toggleFollowUser(followedUserId, follow) {
            // add or removed posts from users homepage
            // TODO: How do you inject firebase rough with followed uid
            // Can establish it in the controller
            // console.log(vm.user.uid, 'vm.user.uid inside toggle follow');
            // console.log(followedUserId, 'followedUserId');
            return vm.database.ref(`/people/${followedUserId}/posts`).once('value')
                .then(
                data => {

                    // TODO: why  constant
                    const updateData = {};
                    // TODO: why let
                    let lastPostId = true;
                    console.log(follow, 'follow');
                    // add followed users post to home feed
                    data.forEach(post => {
                        updateData[`/feed/${vm.user.uid}/${post.key}`] =
                            follow ? !!follow : null;
                        lastPostId = post.key;
                    });
                    // console.log(updateData, 'sport');

                    // Add followed user to the 'following' list.
                    updateData[`/people/${vm.user.uid}/following/${followedUserId}`] =
                        follow ? lastPostId : null;

                    // And the to the was the followers
                    updateData[`/followers/${followedUserId}/${vm.user.uid}`] =
                        follow ? !!follow : null;
                    return vm.database.ref().update(updateData);
                });

        }

        function getHomeFeedPosts() {
            return _getPaginatedFeed(`/feed/${vm.user.uid}/`,
                POSTS_PAGE_SIZE, null, true);
        }



        function _getPaginatedFeed(uri, pageSize, earliestEntryId = null, fetchPostDetails = false) {
            console.log('_getPaginatedFeed is called');
            let ref = vm.database.ref(uri);

            // ??
            if (earliestEntryId) {
                ref = ref.orderByKey().endAt(earliestEntryId);
            }

            // Were fetching an additional item as a cheap way to test if there is a next page.
            return ref.limitToLast(pageSize + 1).once('value').then(data => {
                const entries = data.val() || {};

                // Figure out if there is a next page.
                let nextPage = null;
                const entryIds = Object.keys(entries);
                if (entryIds.length > pageSize) {
                    delete entries[entryIds[0]];
                    const nextPageStartingId = entryIds.shift();
                    nextPage = () => vm._getPaginatedFeed(
                        uri, pageSize, nextPageStartingId, fetchPostDetails
                    );
                }

                if (fetchPostDetails) {
                    // Fetch details of all posts
                    // TODO:
                    // firebase-fp.service.ts#L537
                    const queries = entryIds.map(postId => vm.getPostData(postId));
                    // Since all the requests are being done on the same feed it's unlikely that a single 1
                    // would fail and not the others so using promise.all(q.all)  is not so risky
                    return vm.$q.all(queries).then(results => {
                        const deleteOps = [];
                        results.forEach(result => {
                            if (result.val()) {
                                console.log(result.key, 'result.key');
                                entries[result.key] = result.val();
                            } else {
                                //
                                delete entries[result.key]; // TODO: why is this here?
                                // needs a method
                                deleteOps.push(vm.deleteFromFeed(uri, result.key));
                            }
                        });
                        if (deleteOps.length > 0) {
                            // todo;
                            return vm._getPaginatedFeed(uri, pageSize, earliestEntryId, fetchPostDetails);
                        }
                        return { entries: entries, nextPage: nextPage };
                    });
                }
                return { entries: entries, nextPage: nextPage };
            });
        }

        /**
          * Deletes the given postId entry from the user's home feed.
          */
        function deleteFromFeed(uri, postId) {
            return this.database.ref(`${uri}/${postId}`).remove();
        }


        /**
        * Fetches a single post data.
        */
        function getPostData(postId) {
            return this.database.ref(`/posts/${postId}`).once('value');
        }

    } // factory




}
