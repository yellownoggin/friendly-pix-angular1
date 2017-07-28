namespace friendlyPix {
    'use strict';

    /**
     *  Handles the Home and General Feeds UI
     *  basic and realtime behaviors.
     *  Methods used in controllers and routers resolve|
     */

    angular
        .module('app.shared')
        .service('feeds', feedsService);

    function feedsService($firebaseAuth, friendlyFire, $q, sharedDev, $rootScope) {
        var _self = this;
        _self.user = $firebaseAuth().$getAuth();
        _self.getHomeFeed = getHomeFeed;
        _self.subscribeToHomeFeed = subscribeToHomeFeed;
        _self.subscribeToGeneralFeed = subscribeToGeneralFeed;
        _self.newPosts = {};
        _self.getNewPostsCount = getNewPostsCount;
        _self.convertToArray = convertToArray;
        // _self.getTimeText = getTimeText;
        // _self.concatNextPage = concatNextPage;




        // Staging






        /**
         * Pagination event listener: used currently in inifinite scroll
         * TODO: concatNextPage or the behavior as a service
         * or stuck in controller? Best practice in this case.
         * JAQ and stack overflow.
         * This is the ui: gc.concatNextPage(gc.nextPage, gc.entries, gc.busy)
         * controller: vm.concatNextPage = feeds.concatNextPage;
         */
        // function concatNextPage(nextPageFN, currentEntries, busyState) {
        //     console.log('nextPageFN', nextPageFN);
        //     console.log('currentEntries', currentEntries);
        //     console.log(' busyState',  busyState);
        //     console.log('concatNextPage called');
        //     // 1. Prevents from multiple calls of same nextPage on scroll
        //     // 2. Returns at the end of posts
        //     if (busyState  === true) {
        //         console.log('busyState true');
        //         return;
        //     } else if (typeof nextPageFN !== 'function') {
        //         console.log('No more posts');
        //         return;
        //     }
        //
        //     // Sets pagination to busy state preventint multiple calls
        //     busyState = true;
        //     nextPageFN().then((data) => {
        //         console.log('data in nextPageFN', data.entries);
        //         var newData = [];
        //         newData = _self.convertToArray(data.entries);
        //         nextPageFN = data.nextPage;
        //         currentEntries = currentEntries.concat(newData);
        //         console.log('currentEntries', currentEntries);
        //         busyState = false;
        //         $rootScope.$apply();
        //     });
        // }


        /**
         * Converts firebase posts ref data to array and makes descending
         * TODO: needs to say in function name that makes descending
         * @param  {Object} data data from getPostsTest a firebase query
         * & read method
         * @return {Array}
         */
        function convertToArray(data) {
            // TODO: save for firebase object to usable angular array
            // and array of objects: ie. convertToArrayObjectsDescending
            var reversedPostData = [];
            let p = Object.keys(data);

            for (let i = p.length - 1; i >= 0; i--) {
                // convert to an array and add the key
                let myObject = {};
                myObject['value'] = data[p[i]];
                myObject['key'] = p[i];
                reversedPostData.push(myObject);

            }
            console.log('convertToArray returning data');
            return reversedPostData;
        }




        // TODO: jq: one reason that apply is here is because passing the bindings in
        //  here.(Aha: should be passing the bindings in here or make a promise)
        function getNewPostsCount(feedReference, lPostId, lengthBinding, ArrayBinding) {
            feedReference.on('child_added', (feedData) => {

                // Take out the latestEntryId post (already in feed)
                if (feedData.key !== lPostId) {

                    // Just need the keys to get a count for button
                    // displayAllPosts/getpostsTest doing feed update
                    // on click
                    ArrayBinding.push(feedData.key);
                    lengthBinding = ArrayBinding.length;
                    $rootScope.$apply();
                }
            });
        }


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


        // TODO: Jaq: will this work with super amount of updates
        // Specifically promise. How does this work for super amount of users
        //  on the same time (answer?: individual instance).
        //  Meaning what if one person it's get new posts and changes
        //  this subscription to a different latestEntryId will paths cross
        function _subscribeToFeed(uri, latestEntryId = null, fetchPostDetails = false) {
            // Load all posts info
            // posts ref
            let feedRef = this.database.ref(uri);
            if (latestEntryId) {
                feedRef = feedRef.orderByKey().startAt(latestEntryId);
            }

            return feedRef.on('child_added', (feedData) => {
                // Take out the latestEntryId post (already in feed)
                if (feedData.key !== latestEntryId) {

                    // No posts details use what's there (? key, value(?postId only))
                    if (!fetchPostDetails) {
                        //  Won't need callback - will return as a promise(already built into this)
                        // addPostCallback(feedData.key, feedData.value)
                        var feedDataIds = Object.keys(feedData);
                        return feedDataIds.length;
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
