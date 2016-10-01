namespace friendlyPix {
    'use strict';

    angular
        .module('app.shared')
        .service('feeds', feedsService);

    function feedsService($firebaseAuth, friendlyFire, $q) {
        var vm = this;
        this.user  = $firebaseAuth().$getAuth();
        vm.showHomeFeed = showHomeFeed;



        /**
        * Shows the feed showing all followed users.
        */

        function showHomeFeed() {
            // Clear previously displayed posts if any
            // this.clear()

            var entries = undefined;  // (1) promise return convention or pattern
            // this needs to be verified or cleaned up) seems to be out in space
            if (vm.user) {
                // Make sure the home feed is updated with followed users new posts
                // friendlyFire.updateHomeFeeds().then()


                // angular note: returns added 4 promise
                //  demo: uses addPost(so does not need to return data)

                return friendlyFire.updateHomeFeeds().then(() => {
                    var deferred = $q.defer();

                    return friendlyFire.getHomeFeedPosts().then((data) => {
                        const postIds = Object.keys(data.entries);
                        if (postIds.length === 0) {
                            // the fade in will be in the html with angular.
                            // vm.noPostsMessage.fadeIn();
                            // how to give the no posts message here
                            // need an argument to bind it.
                            // TODO: ^
                            console.log('There are no posts.');
                        }
                        // Listen to New Posts
                        // TODO:  NEXT METHOD TO DO don't know if this is a jquery thingy
                        const latestPostId = postIds[postIds.length - 1];
                        // TODO:  NEXT METHOD TO DO
                        //  friendlyFire.subscribeToHomeFeed(
                        //      (postId, postValue) => {
                        //          this.addNewPost(postId, postValue);
                        //      }, latestPostId);

                        // NOTE: data.entries for this page and data.nextPage
                        // to use with as they have it toggleNextPageButton();

                        // Store data.entries (and later data.nextPage ) in injuries
                        //  Resolve the promise
                        //  return deferred.promise so to be used in the controller
                        //  and ngrepeat
                        entries = data.entries;
                        deferred.resolve(entries);
                        return deferred.promise;
                    });

                    // TODO:  Add new posts from followers live
                    // friendlyPix.firebase.startHomeFeedLiveUpdaters(
                    // Listen for post deletions
                    //    friendlyPix.firebase.registerForPostsDeletion(postId => this.onPostDeleted(postId));
                });

            }
        }
    }
}
