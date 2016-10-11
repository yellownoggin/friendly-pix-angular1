namespace friendlyPix.app.shared {
    'use strict';

    // resource: https://blogs.msdn.microsoft.com/tess/2015/12/10/
    // 3b-services-getting-started-with-angularjs-typescript-and-asp-net-web-api/

    class SharedDevService {
        user: any;
        vm: any;
        database: any;
        firebaseRefs: any;

        constructor(private firebase: any, private $firebaseAuth: any, private $q: any) {
            // var vm = this;  this convention does not seem to work
            this.user = $firebaseAuth().$getAuth();
            this.database = firebase.database();
            this.firebaseRefs = [];
        }


        // Class Methods

        // this is firebase.js method
        subscribeToHomeFeed(latestEntryId) {
            console.log('shared development sto home feed was this called');
            return this._subscribeToFeed(`/feed/${this.user.uid}`, latestEntryId, true);
        }



        // get and store the location/query filtered & sorted by lastPostId
        // this is firebase.js method
        _subscribeToFeed(uri, latestEntryId = null, fetchPostDetails = false) {
            console.log('shared development _sto home feed was this called');
            var deferred = this.$q.defer();
            let feedRef = this.database.ref(uri);
            if (latestEntryId) {
                feedRef = feedRef.orderByKey().startAt(latestEntryId);
            }

            feedRef.on('child_added', feedData => {
                // weed out the latestEntryId
                console.log('feed  subscription child added called');

                if (feedData.key !== latestEntryId) {
                    console.log('feed subscription child added called inside if');
                    // need to set up if for the if no fetchPostDetails
                    // but main is do pass the postData to the callback

                    // Get the postDetails using the feedData.key
                    this.database.ref(`/posts/${feedData.key}`).once('value').then((r) => {
                        console.log(r, 'r inside subscribe to homefeed');
                        deferred.resolve(r);
                    });
                }
            });

            this.firebaseRefs.push(feedRef);
            return deferred.promise;
        }


        // Add new posts from followers live
        // TODO: put this out into general documentation. And out of code for clean for reference now so it digests
        //  subscribeToHomeFeed at this point is only receiving live current users
        // posts live (bc users posts(uploadNewPic) updated to both people & feeed ref locations).

        startHomeFeedLiveUpdaters() {
            console.log('start home feed live updaters called');
            // thinking.
            // 1. get/store ref of followingUsers posts ref.
            // get the lastPostId form the following
            // this is how I thought to do in the beginning.
            // this.database.ref(`/peopel/${this.user.uid}/following`).once(r => {
            //     1. interate thru storing followingid and lastpost id of  user we are following;
            //     2.
            //
            // });
            const followingRef = this.database.ref(`/people/${this.user.uid}/following`);
            this.firebaseRefs.push(followingRef);
            followingRef.on('child_added', followingData => {
                console.log('followingRef.on child_added triggered');
                // Start listening 2 the following users posts to populate the home feed
                const followedUid = followingData.key;
                let followedUserPostsRef = this.database.ref(`/people/${followedUid}/posts`);
                if (followingData.val() instanceof String) {
                    followedUserPostsRef = followedUserPostsRef.orderByKey().startAt(followingData.val());
                }
                this.firebaseRefs.push(followedUserPostsRef);
                followedUserPostsRef.on('child_added', postData => {
                    console.log(postData.key , 'post child added from following user');
                    if (postData.key !== followingData.val()) {
                    const updates = {};
                    updates[`/feed/${this.user.uid}/${postData.key}`] = true;
                    updates[`/people/${this.user.uid}/following/${followedUid}`] = postData.key;
                    this.database.ref().update(updates);
                    }
                });
            });
            // Stop listening to users we follow.
            // followingRef.on('child_removed', followingData => {
            //     const followedUserId = followingData.key;
            //     this.database.ref(`/people/${followingUid}/posts`).off();
            // });
        }









    /**
     * Keep feed populated with latest followed posts live
     */
    // startHomeFeedLiveUpdaters() {
    //     // Make sure we listen on each followed people's posts
    //     const followingRef = this.database.ref(`/people/${this.user.uid}/following`);
    //     this.firebaseRefs.push(followingRef);
    //     followingRef.on('child_added', followingData => {
    //         // Start listening through the fall post populate the home feed.
    //         const followedUid = followingData.key;
    //         let followedUserPostsRef = this.database.ref(`/people/${followedUid}/posts`);
    //         if (followingData.val() instanceof String) {
    //             followedUserPostsRef = followedUserPostsRef.orderByKey().startAt(followingData.val());
    //         }
    //         this.firebaseRefs.push(followedUserPostsRef);
    //         followerdUserPostsRef.on(
    //     })
    // }
    //
    //

} //  /class

angular
    .module('app.shared')
    .service('sharedDev', SharedDevService);
}
