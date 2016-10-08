namespace friendlyPix.app.shared {
    'use strict';

    // resource: https://blogs.msdn.microsoft.com/tess/2015/12/10/
    // 3b-services-getting-started-with-angularjs-typescript-and-asp-net-web-api/

    class SharedDevService {
        user: any;
        vm: any;
        database: any;
        firebaseRefs: any;

        constructor(private firebase: any, private $firebaseAuth: any) {
            // var vm = this;  this convention does not seem to work
            this.user = $firebaseAuth().$getAuth();
            this.database = firebase.database();
            this.firebaseRefs = [];
        }


        // Class Methods

        // this is firebase.js method
        subscribeToHomeFeed(cb, latestEntryId) {
            console.log('shared development sto home feed was this called');
            return this._subscribeToFeed(`/feed/${this.user.uid}`, cb, latestEntryId, true);
        }



        // get and store the location/query filtered & sorted by lastPostId
        // this is firebase.js method
        _subscribeToFeed(uri, cb, latestEntryId = null, fetchPostDetails = false ) {
            console.log('shared development _sto home feed was this called');
            let feedRef = this.database.ref(uri);
            if (latestEntryId) {
                feedRef = feedRef.orderByKey().startAt(latestEntryId);
            }

            feedRef.on('child_added', feedData => {
                // weed out the latestEntryId
                if (feedData.key !== latestEntryId) {
                    // need to set up if for the if no fetchPostDetails
                    // but main is do pass the postData to the callback

                    // Get the postDetails using the feedData.key

                    this.database.ref(`/posts/${feedData.key}`).once('value').then(postData => {
                        cb(postData.key, postData.val());
                    });

                }
            });

            this.firebaseRefs.push(feedRef);
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
