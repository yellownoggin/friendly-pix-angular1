namespace friendlyPix {
    'use strict';

    /**
     * Handles all Firebase interactions.
     */
    angular
        .module('app.shared')
        .factory('friendlyFire', friendlyFirebaseFactory);


    // @ngInject
    function friendlyFirebaseFactory(latinize, $firebaseAuth, firebase,
        $q, FbOarService, $firebaseArray, $firebaseObject, $rootScope) {
        // setup
        var self = this;
        self.auth = $firebaseAuth();
        self.user = $firebaseAuth().$getAuth();
        self.currentUserUid = self.user.uid;
        self.database = firebase.database();
        self.storage = firebase.storage();
        self.firebaseArray = $firebaseArray;
        self.getPosts = getPosts;
        self.deleteFromFeed = deleteFromFeed;
        self._getPaginatedFeed = _getPaginatedFeed;
        self.updateHomeFeeds = updateHomeFeeds;
        self.getPostData = getPostData;
        self.$q = $q;
        self.rootScope = $rootScope;

        // Firebase references that are listend to
        self.firebaseRefs = [];




        // private values*?  think that is wrong to think it should be private
        var POSTS_PAGE_SIZE = 20,
            USER_PAGE_POSTS_PAGE_SIZE = 6;

        return {
            saveUserData: saveUserData,
            uploadNewPic: uploadNewPic,
            updateHomeFeeds: updateHomeFeeds,
            toggleFollowUser: toggleFollowUser,
            getHomeFeedPosts: getHomeFeedPosts,
            getProfileFeed: getProfileFeed,
            getPosts: getPosts,
            getComments: getComments,
            subscribeToComments: subscribeToComments,
            addComment: addComment,
            getCommentsNew: getCommentsNew,
            getPostsTest: getPostsTest,
            registerToFollowStatusUpdate: registerToFollowStatusUpdate,
            cancelAllSubscriptions: cancelAllSubscriptions
        };


        // Staging



        function registerToFollowStatusUpdate(userPageUid, callback) {
            if (self.currentUserUid) {
                let followStatusRef = self.database.ref(`/people/${self.currentUserUid}/following/${userPageUid}`);
                // Get and track follow state
                followStatusRef.on('value', callback);
                // TODO: add to firebase refs
                self.firebaseRefs.push(followStatusRef);
            }

        }


        function getCommentsNew(postId) {
            return _getPaginatedFeedNew(`/comments/${postId}`, 5, null, false);
        }



        /**
         * [getPosts description]
         *  TODO: postSize should not be hardcoded in param
         *  should be a getter
         */
        function getPosts() {
            return self._getPaginatedFeed('/posts/', 5);
        }



        /**
        * Fetches a single post data.
        */
        function getPostData(postId) {
            let ref = this.database.ref(`/posts/${postId}`).once('value');
        }

        function getPostsTest() {
            return _getPaginatedFeedTest('/posts/', 5);
        }



        /**
         * [_getPaginatedFeed description]
         */
        function _getPaginatedFeedTest(uri, pageSize, earliestEntryId = null, fetchPostDetails = false) {

            let ref = self.database.ref(uri);

            if (earliestEntryId) {
                ref = ref.orderByKey().endAt(earliestEntryId);
            }

            // Were fetching an additional item as a cheap way to test if there is a next page.
            return ref.limitToLast(pageSize + 1).once('value').then(data => {
                const entries = data.val() || {};

                // return data.val();

                // Figure out if there is a next page.
                let nextPage = null;
                const entryIds = Object.keys(entries);
                if (entryIds.length > pageSize) {
                    delete entries[entryIds[0]];
                    const nextPageStartingId = entryIds.shift();

                    nextPage = () => _getPaginatedFeedTest(
                        uri, pageSize, nextPageStartingId, fetchPostDetails
                    );
                }

                // if (fetchPostDetails) {
                //     // Fetch details of all posts
                //     // TODO:
                //     // firebase-fp.service.ts#L537
                //     const queries = entryIds.map(postId => self.getPostData(postId));
                //     // Since all the requests are being done on the same feed it's unlikely that a single 1
                //     // would fail and not the others so using promise.all(q.all)  is not so risky
                //     return self.$q.all(queries).then(results => {
                //         const deleteOps = [];
                //         results.forEach(result => {
                //             if (result.val()) {
                //                 console.log(result.key, 'result.key');
                //                 entries[result.key] = result.val();
                //             } else {
                //                 //
                //                 delete entries[result.key]; // TODO: why is this here?
                //                 // needs a method
                //                 deleteOps.push(self.deleteFromFeed(uri, result.key));
                //             }
                //         });
                //         if (deleteOps.length > 0) {
                //             // todo;
                //             return self._getPaginatedFeed(uri, pageSize, earliestEntryId, fetchPostDetails);
                //         }
                //         return { entries: entries, nextPage: nextPage };
                //     });
                // } // if postDetails



                return { entries: entries, nextPage: nextPage };
            });
        }

        /**
         * [_getPaginatedFeed description]
         */
        function _getPaginatedFeed(uri, pageSize, earliestEntryId = null, fetchPostDetails = false) {

            let ref = self.database.ref(uri);

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
                    nextPage = () => self._getPaginatedFeed(
                        uri, pageSize, nextPageStartingId, fetchPostDetails
                    );
                }

                if (fetchPostDetails) {
                    // Fetch details of all posts
                    // TODO:
                    // firebase-fp.service.ts#L537
                    const queries = entryIds.map(postId => self.getPostData(postId));
                    // Since all the requests are being done on the same feed it's unlikely that a single 1
                    // would fail and not the others so using promise.all(q.all)  is not so risky
                    return self.$q.all(queries).then(results => {
                        const deleteOps = [];
                        results.forEach(result => {
                            if (result.val()) {

                                entries[result.key] = result.val();
                            } else {
                                //
                                delete entries[result.key]; // TODO: why is this here?
                                // needs a method
                                deleteOps.push(self.deleteFromFeed(uri, result.key));
                            }
                        });
                        if (deleteOps.length > 0) {
                            // todo;
                            return self._getPaginatedFeed(uri, pageSize, earliestEntryId, fetchPostDetails);
                        }
                        return { entries: entries, nextPage: nextPage };
                    });
                }
                return { entries: entries, nextPage: nextPage };
            });
        }





        function addComment(postId, commentText) {
            const commentObj = {
                text: commentText,
                timestamp: Date.now(),
                author: {
                    uid: self.user.uid,
                    full_name: self.user.displayName,
                    profile_picture: self.user.photoURL
                }
            };


            let ref = self.database.ref(`comments/${postId}`);
            let list = $firebaseArray(ref);
            list.$add(commentObj).then(function(ref) {
                var id = ref.key;

                list.$indexFor(id); // returns location in the array
            });


        }

        // End of Staging


        // TODO: comment size parameter needs a static value
        function getComments(postId) {
            return self._getPaginatedFeed(`/comments/${postId}`, 5, null, false);
        }

        function getProfileFeed() {

            return self._getPaginatedFeed(`people/${self.user.uid}/posts`, 100, null, true);


        }


        function subscribeToComments(postId, latestCommentId) {
            _subscribeToFeed(`/comments/${postId}`, latestCommentId, false);
        }

        function _subscribeToFeed(uri, latestEntryId = null, fetchPostDetails = false) {
            // load all posts information.
            let feedRef = self.database.ref(uri);
            if (latestEntryId) {
                feedRef = feedRef.orderByKey().startAt(latestEntryId);
            }
            feedRef.on('child_added', (feedData) => {
                if (feedData.key !== latestEntryId) {
                    // TODO: add the else for the post(not comment) subscriptions
                    if (!fetchPostDetails) {
                        // self.rootScope.$apply();
                    }
                }

            });
            self.firebaseRefs.push(feedRef);
        }

        // function getGeneralFeed(parameter) {
        //     throw new Error("Not implemented yet");
        // }

        ////////// END OF STAGING



        /********* Auth Methods *********/

        /**
         * saveUserData
         * Saves or updates public user data in Firebase (such as image URL,
         * display name...).
         */
        function saveUserData(imageUrl, displayName) {
            var user = self.auth.$getAuth();
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
            return self.database.ref(`people/${user.uid}`).update(updateData);
        }


        function uploadNewPic(pic, thumb, fileName, text) {
            console.log(text, 'text');
            // Start the pic file upload to Firebase Storage
            var picRef = self.storage.ref(`${self.user.uid}/full/${Date.now()}/${fileName}`);
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
            var thumbRef = self.storage.ref(`${self.user.uid}/thumb/${Date.now()}/${fileName}`);
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
                var newPostKey = self.database.ref('/posts').push().key;
                var update = {};
                update[`/posts/${newPostKey}`] = {
                    full_url: urls[0],
                    thumb_url: urls[1],
                    text: text,
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    full_storage_uri: picRef.toString(),
                    thumb_storage_uri: thumbRef.toString(),
                    author: {
                        uid: self.user.uid,
                        full_name: self.user.displayName,
                        profile_picture: self.user.photoURL
                    }
                };
                update[`/people/${self.user.uid}/posts/${newPostKey}`] = true;
                update[`/feed/${self.user.uid}/${newPostKey}`] = true;
                return self.database.ref().update(update).then(() => newPostKey);
            });

        } // uploadNewPic



        /********* Feeds Methods *********/


        function getHomeFeedPosts() {
            return _getPaginatedFeed(`/feed/${self.user.uid}/`,
                POSTS_PAGE_SIZE, null, true);
        }

        /**
          * Deletes the given postId entry from the user's home feed.
          */
        function deleteFromFeed(uri, postId) {
            return this.database.ref(`${uri}/${postId}`).remove();
        }


        function updateHomeFeeds() {
            // Gets current authorized user/following reference*
            var followingRef = self.database.ref(`/people/${self.user.uid}/following`);

            // return an empty promise
            return followingRef.once('value', followingData => {
                // Start listening to the followed users post to populate home feed
                var following = followingData.val();
                if (!following) {
                    return;
                }
                var updateOperations = Object.keys(following).map(followedUid => {
                    // Get followed users posts set up
                    var followedUserPostsRef = self.database.ref(`/people/${followedUid}/posts`);
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
                                updates[`/feed/${self.user.uid}/${postId}`] = true;
                                updates[`/people/${self.user.uid}/following/${followedUid}`] = postId;
                            }
                        });
                        // update database with update object(filled with the information above)
                        return self.database.ref().update(updates);
                    });
                });
                return $q.all(updateOperations);
            });
        }


        /********* UserPage Methods *********/


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
            // console.log(self.user.uid, 'self.user.uid inside toggle follow');
            // console.log(followedUserId, 'followedUserId');
            return self.database.ref(`/people/${followedUserId}/posts`).once('value')
                .then(data => {

                    const updateData = {};
                    // TODO: why let
                    let lastPostId = true;
                    console.log(follow, 'follow');
                    // add followed users post to home feed
                    data.forEach(post => {
                        // updateData[`/feed/${self.user.uid}/${post.key}`] =
                        //     follow ? !!follow : null;
                        lastPostId = post.key;
                    });
                    // console.log(updateData, 'sport');

                    // Add followed user to the 'following' list.
                    updateData[`/people/${self.user.uid}/following/${followedUserId}`] =
                        follow ? lastPostId : null;

                    // And the to the was the followers
                    updateData[`/followers/${followedUserId}/${self.user.uid}`] =
                        follow ? !!follow : null;

                    return self.database.ref().update(updateData);
                });

        }

        /**
         * Turns off and clears Firebase listeners  ( prevents memory leaks)
         *
         */
        function cancelAllSubscriptions() {
            self.firebaseRefs.forEach((ref) => {
                ref.off();
            });
            self.firebaseRefs = [];
        }


    } // factory


}
