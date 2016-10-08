namespace friendlyPix {
    'use strict';

    angular
        .module('app.shared')
        .service('feeds', feedsService);

    function feedsService($firebaseAuth, friendlyFire, $q, sharedDev) {
        var vm = this;
        this.user  = $firebaseAuth().$getAuth();
        vm.showHomeFeed = showHomeFeed;
        vm.subscribeToHomeFeed = subscribeToHomeFeed;
        // vm.newPosts = {};
        // vm.addNewPost = addNewPost;
        // vm.watchHomeFeedNewPosts = watchHomeFeedNewPosts;


        /**
        * Shows the feed showing all followed users.
        */

        function showHomeFeed(newPostsLiveUpdaterObj) {
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
                    var deferredPixData = $q.defer();

                    // TODO: qq what is the angular way to update dom when listener is set

                    // returning this with pixdata to set the subscribeToHomeFeed
                    // in the controller scope
                    // the demo uses a callback in this method that uses
                    //  jquery which can add to the dom withing the feed service
                    // angularway work around
                    var deferredLatestPostId = $q.defer();

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
                        deferredPixData.resolve(entries);
                        deferredLatestPostId.resolve(latestPostId);
                        return $q.all([deferredPixData.promise, deferredLatestPostId.promise]);
                    });

                    // TODO:  Add new posts from followers live
                    // friendlyPix.firebase.startHomeFeedLiveUpdaters();
                    // Listen for post deletions
                    //    friendlyPix.firebase.registerForPostsDeletion(postId => this.onPostDeleted(postId));
                });

            }
        } // showHomeFeed


        function subscribeToHomeFeed (newPostsVar, latestPostId) {
            console.log('sto home feed was this called');
             sharedDev.subscribeToHomeFeed(
                 (postId, postValue) => {
                     console.log(newPostsVar, 'newPostsVar');
                     newPostsVar[postId] = postValue;
                 }, latestPostId);
        }


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
