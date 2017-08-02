namespace friendlyPix {
    'use strict';

    angular
        .module('app.spaPages')
        .controller('HomeController', HomeController);

    function HomeController(currentUser, homeFeedData, feeds, $firebaseAuth,
        firebase, $scope, $q, sharedDev, friendlyFire, $timeout) {
        console.log('Home Controller initialized');
        var vm = this;
        vm.database = firebase.database();
        vm.firebaseRefs = [];
        vm.currentUser = currentUser;

        // John Papa init pattern & reveal-like technique
        init();

        function init() {
            console.log('Home Feed Controller Instantiated');

            // Prevents duplicates on nextPage
            vm.busy = false;
            vm.concatNextPage = concatNextPage;

            showHomeFeed();
            // TODO: can these go into show home feed? What else in this controller can go into a service
            friendlyFire.startHomeFeedLiveUpdaters();
            friendlyFire.registerForPostsDeletion(onPostDeleted);

            vm.homeFeedPostsArray = feeds.convertToDescendingArray(homeFeedData.entries);

            let latestPostId = vm.homeFeedPostsArray[0].key;
            let feedRef = vm.database.ref(`/feed/${vm.currentUser.uid}`).orderByKey().startAt(latestPostId);
            vm.length = null;
            vm.newPostsCountArray = [];
            // feeds.getNewPostsCount(feedRef, latestPostId, vm.length, vm.newPostsCountArray);
            feeds.getNewPostsCountHome(feedRef, latestPostId, (key) => {
                vm.newPostsCountArray.push(key);
                vm.length = vm.newPostsCountArray.length;
                console.log('vm.length', vm.length);
                $scope.$apply();
            });



        }

        // Staging

        /**
         * registerForPostsDeletion
         */

         function  onPostDeleted(postId) {
             // take out of newPosts queue if in there
             if (vm.newPostsCountArray.indexOf(' + postId + ') || vm.homeFeedPostsArray.indexOf(postId) > -1) {

                 if (vm.newPostsCountArray.indexOf(postId) > -1) {
                    vm.newPostsCountArray.splice(vm.newPostsQueue.indexOf(postId), 1);
                    vm.length = vm.newPostsCountArray.length;
                    console.log('newPostsCountArray', vm.newPostsCountArray);
                 }
                // Delete from the current posts array
                // Using condition bc of pagination
                 if (vm.homeFeedPostsArray.indexOf(postId)) {
                     vm.homeFeedPostsArray.splice(vm.homeFeedPostsArray.indexOf(postId), 1);
                 }
                 $scope.$apply();
             }
         }




        function showHomeFeed() {
            // clear();   see clear
            // raw clear
            vm.homeFeedPostsArray = [];
            vm.homeFeedNexPage = null;
            vm.noPostsMessage = false;
            vm.newPostsQueue = [];
            // TODO: if (vm.currentUserUid)??

            // Bind new data
            vm.homeFeedPostsArray = feeds.convertToDescendingArray(homeFeedData.entries);
            vm.homeFeedNexPage = homeFeedData.nextPage;
            console.log('vm.homeFeedNexPage', vm.homeFeedNexPage);

            // Show no posts message logic
            if (vm.homeFeedPostsArray.length === 0) {
                vm.noPostsMessage = true;
            }
            let latestEntryId = vm.homeFeedPostsArray[0].key;
            console.log('latestEntryId', latestEntryId);

            // subscribe to New posts (subscriveTofeed is the correct method)
            // friendlyFire.subscribeToHomeFeed(latestEntryId).then((data) => {
            //     console.log('data', data);
            //     $timeout(() => {
            //         vm.newPostsQueue.push(data);
            //         console.log('timeout', vm.newPostsQueue.length);
            //     });
            //
            // });
        }


        function concatNextPage() {

            // 1. Prevents from multiple calls of same nextPage on scroll
            // 2. Returns at the end of posts
            if (vm.busy === true) {
                return;
            } else if (typeof vm.homeFeedNexPage !== 'function') {
                console.log('No more posts');
                return;
            }

            // Sets pagination to busy state preventint multiple calls
            vm.busy = true;
            vm.homeFeedNexPage().then((data) => {
                var newData = [];
                newData = feeds.convertToArray(data.entries);
                vm.homeFeedNexPage = data.nextPage;
                vm.homeFeedPostsArray = vm.homeFeedPostsArray.concat(newData);
                vm.busy = false;
                $scope.$apply();
            });
        }


        function clear() {
            // for show home feed and others most likely
            // 1. clear the feed posts that were in there
            // 2. clears any timers (getTimeText)
            // 3. clears listeners(cancel all subscriptions)
            // 4. hide newposts, nextPage, and no posts button
            // 5. unbind the nextPage button click listener/event
            // 6. stop scrolls listener?s
        }


        // Staging End


        // TODO: notes
        //         function showHomeFeed() {
        //             // Clear existing posts TODO: is that all?
        //
        //             if (Object.keys(_pixData[0]).length > 0) {
        //                 vm.showNoPostsMessage = false;
        //                 var pixDataArray = [];
        //                 vm.pixDataArray1 = [];
        //
        //                 // Converting to an array in order to concat with next page data
        //                 pixDataArray = convertToArrayAndReverse(_pixData[0]);
        //                 vm.pixData = pixDataArray;
        //                 vm.nextPage = _pixData[1];
        //                 vm.newData = {};
        //                 console.log(vm.nextPage, 'vm.nextPage');
        //                 vm.lastSyncedPostId = _pixData[2];
        //
        //                 subscribeToHomeFeed(vm.lastSyncedPostId, (postData) => {
        //                     vm.newData = postData.val();
        //                     $scope.$apply(() => {
        //                         // update the nextPage to call with proper nextPageStartingId
        //                         vm.pixDataArray1.unshift(vm.newData);
        //                         console.log(vm.pixDataArray1, 'vm.pixDataArray1');
        //                     });
        //
        //                 });
        //
        //                 sharedDev.startHomeFeedLiveUpdaters();
        //
        //             } else {
        //                 vm.showNoPostsMessage = true;
        //             }
        //
        //         }
        //
        //
        //         function next() {
        //             // TODO:
        //             // https://material.angularjs.org/latest/demo/virtualRepeat
        //             // also for ref:
        //             // https://github.com/firebase/friendlypix/blob/master/web/scripts/feed.js#L91
        //             vm.nextPage().then((data) => {
        //                 console.log(data.entries);
        //                 var arr = convertToArray(data.entries);
        //                 $scope.$apply(() => {
        //                     // update the nextPage to call with proper nextPageStartingId
        //                     vm.nextPage = data.nextPage;
        //                     vm.pixData = vm.pixData.concat(arr);
        //                     console.log(vm.pixData, 'pixdata after next');
        //                 });
        //
        //             });
        //         }
        //
        //
        //         function convertToArray(obj) {
        //             var entries = Object.keys(obj);
        //             var arr = [];
        //             for (let i = 0; i < entries.length; i++) {
        //                 arr.push(obj[entries[i]]);
        //             }
        //             return arr;
        //         }
        //
        //
        //         function convertToArrayAndReverse(obj) {
        //             var entries = Object.keys(obj);
        //             var arr = [];
        //             for (let i = 0; i < entries.length; i++) {
        //                 arr.push(obj[entries[i]]);
        //             }
        //             arr.reverse();
        //             return arr;
        //         }
        //
        //
        //
        //         // Subscribe to home feed real-time updates(user & following)
        //
        //         // watchNewPosts();
        //
        //         // scope.$watchCollection('np', function(newValue, oldValue) {
        //         // console.log(scope.newPosts, 'watch scope.newPosts');
        //         // console.log('watch called');
        //         // console.log(newValue, 'n');
        //         // console.log(oldValue, 'o');
        //         //         vm.newPostDataLength = newValue.length;
        //         // });
        //
        //         // subscribeToHomeFeed(vm.latestEntryId, (postId, postVal) => {
        //         // console.log(postVal, 'post value');
        //         // var a = postId;
        //         // var b = postVal;
        //         // scope.np.push(a);
        //
        //
        //         // console.log(scope.np, 'scope.np');
        //
        //         // });
        //
        //         //
        //         // function addNewPost() {
        //         //     vm.pixData = vm.np.concat(vm.pixData);
        //         // }
        //
        //
        //
        //         // .then((postData) => {
        //         //     console.log(postData.key, 'post key');
        //         //     console.log(postData.val(), 'post value');
        //         //     var a = postData.key;
        //         //     var b = postData.val();
        //         //     vm.newPosts.push({ 'post key': a, 'post value': b });
        //         // });
        //         // vm.showNoPostsMessageContainer = undefined;
        //
        //
        //
        //         // Controller methods declarations
        //
        //         if ($firebaseAuth().$getAuth()) {
        //             console.log($firebaseAuth().$getAuth().uid, 'current user');
        //         }
        //
        //
        //         function hideNoPostsContainer() {
        //             console.log('hideNoPostsContainer called');
        //             vm.showNoPostsMessageContainer = false;
        //         }
        //
        //         function updateNewPosts() {
        //             console.log(vm.pixData, 'vm.pixData in updateNewPosts');
        //             vm.pixData = vm.pixDataArray1.concat(vm.pixData);
        //             vm.pixDataArray1 = [];
        //             // $scope.$apply(() => {
        //             //     vm.pixData = vm.pixDataArray1.concat(vm.pixData);
        //             // });
        //         }
        //
        //
        //         /// Real time home subscription/updates methods
        //
        //
        //         // this is firebase.js method
        //         function subscribeToHomeFeed(latestEntryId, cb) {
        //             console.log('shared development sto home feed was this called');
        //             return _subscribeToFeed(`/feed/${vm.currentAuth.uid}`, latestEntryId, true, cb);
        //         }
        //
        //
        //
        //         // get and store the location/query filtered & sorted by lastPostId
        //         // this is firebase.js method
        //         function _subscribeToFeed(uri, latestEntryId = null, fetchPostDetails = false, cb) {
        //             console.log('shared development _sto home feed was this called');
        //             // var deferred = vm.$q.defer();
        //             let feedRef = vm.database.ref(uri);
        //             if (latestEntryId) {
        //                 feedRef = feedRef.orderByKey().startAt(latestEntryId);
        //             }
        //             // vm.firebaseRefs.push(feedRef);
        //
        //             feedRef.on('child_added', feedData => {
        //                 // weed out the latestEntryId
        //                 console.log('feed  subscription child added called');
        //
        //                 if (feedData.key !== latestEntryId) {
        //                     console.log('feed subscription child added called inside if');
        //                     // need to set up if for the if no fetchPostDetails
        //                     // but main is do pass the postData to the callback
        //
        //                     // Get the postDetails using the feedData.key
        //                     vm.database.ref(`/posts/${feedData.key}`).once('value').then((postData) => {
        //                         console.log(postData.key, 'r inside subscribe to homefeed');
        //
        //                         cb(postData);
        //                     });
        //                 }
        //             });
        //
        //
        //         }
        //
    }
}
