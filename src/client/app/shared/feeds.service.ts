namespace friendlyPix {
    'use strict';

    angular
        .module('app.shared')
        .service('feeds', feedsService);

    function feedsService($firebaseAuth, friendlyFire, $q, sharedDev) {
        var _self = this;
        _self.user = $firebaseAuth().$getAuth();
        _self.getHomeFeed = getHomeFeed;
        _self.subscribeToHomeFeed = subscribeToHomeFeed;
        _self.subscribeToGeneralFeed = subscribeToGeneralFeed;
        _self.newPosts = {};
        // vm.addNewPost = addNewPost;
        // vm.watchHomeFeedNewPosts = watchHomeFeedNewPosts;like
        console.log(_self.user, 'current user');


        // Staging


        // showGeneralFeed not going to work for angular the way it is
        // Need to piece it out in the controller
        // 1. subscribeToGeneralFeed
        // 2. registerForPostsDeletion
        // ---
        // showGeneralFeed as a
        // function showGeneralFeed() {
        //     friendlyFire.getPostsTest().then((data) => {
        //         // Get latest post Id
        //
        //     });
        // }

        function subscribeToGeneralFeed(latestPostId) {
            // uses subscribeToFeed and
            // returns the results from that(??) not sure that matter
            return _subscribeToFeed('/posts/', latestPostId);
        }

        function _subscribeToFeed(uri, latestEntryId = null, fetchPostDetails = false) {
            // Load all posts info
            // posts ref
            let feedRef = this.database.ref(uri);
            if (latestEntryId) {
                feedRef = feedRef.orderByKey().startAt(latestEntryId);
            }

            feedRef.on('child_added', (feedData) => {
                // Take out the latestEntryId post (already in feed)
                if (feedData.key !== latestEntryId) {

                    // No posts details use what's there (? key, value(?postId only))
                    if (!fetchPostDetails) {
                        //  Won't need callback - will return as a promise(already built into this)
                        // addPostCallback(feedData.key, feedData.value)
                        var feedDataIds = Object.keys(feedData);
                        return  feedDataIds.length;
                    }

                }
            });
        }



        // End of Staging



        /**
        * Shows the user's feed and all followed users posts.
        */

        function getHomeFeed(newPostsLiveUpdaterObj) {
            // Clear previously displayed posts if any
            // this.clear()

            var entries = undefined;  // (1) promise return convention or pattern
            var deferredPixData = $q.defer();
            var deferredLatestPostId = $q.defer();
            var deferredNexPage = $q.defer();
            // this needs to be verified or cleaned up) seems to be out in space
            if (_self.user) {
                // Make sure the home feed is updated with followed users new posts
                // friendlyFire.updateHomeFeeds().then()



                // angular note: returns added 4 promise
                //  demo: uses addPost(so does not need to return data)

                return friendlyFire.updateHomeFeeds().then(() => {
                    // TODO: qq what is the angular way to update dom when listener is set

                    friendlyFire.getHomeFeedPosts().then((data) => {
                        const postIds = Object.keys(data.entries);
                        const latestPostId = postIds[postIds.length - 1];

                        var entries = data.entries;
                        var nextPage = data.nextPage;
                        deferredPixData.resolve(entries);
                        deferredNexPage.resolve(nextPage);
                        deferredLatestPostId.resolve(latestPostId);

                    });

                    // TODO:  Add new posts from followers live
                    sharedDev.startHomeFeedLiveUpdaters();
                    return $q.all([deferredPixData.promise, deferredNexPage.promise, deferredLatestPostId.promise]);
                    // Listen for post deletions
                    //    friendlyPix.firebase.registerForPostsDeletion(postId => this.onPostDeleted(postId));
                });

            } else {
                const deferred = $q.defer();
                deferred.resolve('No user is signed in');
                return deferred.promise;
            }
        } // showHomeFeed


        function subscribeToHomeFeed(newPostsVar, latestPostId) {
            console.log('sto home feed was this called');
            sharedDev.subscribeToHomeFeed(
                (postId, postValue) => {
                    //  console.log(newPostsVar, 'newPostsVar');
                    newPostsVar[postId] = postValue;
                }, latestPostId);
        }


        // function toggleNextPageButton(nextPage) {
        //     // unbind listenr nextPageButton click event
        //
        //     if (nextPage) {
        //         const loadMorePosts = () => {
        //
        //         }
        //     }
        // }

        // function addNewPost(postId, postValue) {
        //     console.log('add new post called');
        //     vm.newPosts[postId] = postValue;
        //
        // }

        // function watchHomeFeedNewPosts(bindValue) {
        //
        //     $scope.$watch('vm.newPosts', (newValue, oldValue) => {
        //         console.log('watch home feed new post called');
        //         bindValue = newValue;
        //     });
        // }


    }
}
