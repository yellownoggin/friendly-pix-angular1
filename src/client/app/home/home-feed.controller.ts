namespace friendlyPix {
    'use strict';

    angular
        .module('app.spaPages')
        .controller('HomeController', HomeController);

    function HomeController(currentAuth, feeds, $firebaseAuth, firebase, _pixData, $scope, $q, sharedDev) {

        console.log('Home Controller initialized');

        var vm = this;
        vm.$q = $q;
        vm.next = next;
        vm.currentAuth = currentAuth;
        vm.updateNewPosts = updateNewPosts;

        // vm.showNoPostsMessage = true;

        // Data binding from router resolve
        // vm.pixData = _pixData[0];
        // vm.latestEntryId = _pixData[1];


        vm.firebaseRefs = [];

        // firebase sdk
        vm.database = firebase.database();


        // var scope = $scope;
        // scope.newPosts = [];
        // scope.np = ['a'];
        // vm.$timeout = $timeout;



        // Init controller - reason: John Papa init pattern & reveal-like technique

        init();


        function init() {
            showHomeFeed();
            $scope.$watch('vm.pixData', (n, o) => {
                console.log(n, 'n');
                console.log(o, 'o');
            });
            // console.log('home controller');
        }



        // TODO: notes
        function showHomeFeed() {
            // Clear existing posts TODO: is that all?

            if (Object.keys(_pixData[0]).length > 0) {
                vm.showNoPostsMessage = false;
                var pixDataArray = [];
                vm.pixDataArray1 = [];

                // Converting to an array in order to concat with next page data
                pixDataArray = convertToArrayAndReverse(_pixData[0]);
                vm.pixData = pixDataArray;
                vm.nextPage = _pixData[1];
                vm.newData = {};
                console.log(vm.nextPage, 'vm.nextPage');
                vm.lastSyncedPostId = _pixData[2];

                subscribeToHomeFeed(vm.lastSyncedPostId, (postData) => {
                    vm.newData = postData.val();
                    $scope.$apply(() => {
                        // update the nextPage to call with proper nextPageStartingId
                        vm.pixDataArray1.unshift(vm.newData);
                        console.log(vm.pixDataArray1, 'vm.pixDataArray1');
                    });

                });

                sharedDev.startHomeFeedLiveUpdaters();

            } else {
                vm.showNoPostsMessage = true;
            }

        }


        function next() {
            // TODO:
            // https://material.angularjs.org/latest/demo/virtualRepeat
            // also for ref:
            // https://github.com/firebase/friendlypix/blob/master/web/scripts/feed.js#L91
            vm.nextPage().then((data) => {
                console.log(data.entries);
                var arr = convertToArray(data.entries);
                $scope.$apply(() => {
                    // update the nextPage to call with proper nextPageStartingId
                    vm.nextPage = data.nextPage;
                    vm.pixData = vm.pixData.concat(arr);
                    console.log(vm.pixData, 'pixdata after next');
                });

            });
        }


        function convertToArray(obj) {
            var entries = Object.keys(obj);
            var arr = [];
            for (let i = 0; i < entries.length; i++) {
                arr.push(obj[entries[i]]);
            }
            return arr;
        }


        function convertToArrayAndReverse(obj) {
            var entries = Object.keys(obj);
            var arr = [];
            for (let i = 0; i < entries.length; i++) {
                arr.push(obj[entries[i]]);
            }
            arr.reverse();
            return arr;
        }



        // Subscribe to home feed real-time updates(user & following)

        // watchNewPosts();

        // scope.$watchCollection('np', function(newValue, oldValue) {
        // console.log(scope.newPosts, 'watch scope.newPosts');
        // console.log('watch called');
        // console.log(newValue, 'n');
        // console.log(oldValue, 'o');
        //         vm.newPostDataLength = newValue.length;
        // });

        // subscribeToHomeFeed(vm.latestEntryId, (postId, postVal) => {
        // console.log(postVal, 'post value');
        // var a = postId;
        // var b = postVal;
        // scope.np.push(a);


        // console.log(scope.np, 'scope.np');

        // });

        //
        // function addNewPost() {
        //     vm.pixData = vm.np.concat(vm.pixData);
        // }



        // .then((postData) => {
        //     console.log(postData.key, 'post key');
        //     console.log(postData.val(), 'post value');
        //     var a = postData.key;
        //     var b = postData.val();
        //     vm.newPosts.push({ 'post key': a, 'post value': b });
        // });
        // vm.showNoPostsMessageContainer = undefined;



        // Controller methods declarations

        if ($firebaseAuth().$getAuth()) {
            console.log($firebaseAuth().$getAuth().uid, 'current user');
        }


        function hideNoPostsContainer() {
            console.log('hideNoPostsContainer called');
            vm.showNoPostsMessageContainer = false;
        }

        function updateNewPosts() {
            console.log(vm.pixData, 'vm.pixData in updateNewPosts');
            vm.pixData = vm.pixDataArray1.concat(vm.pixData);
            vm.pixDataArray1 = [];
            // $scope.$apply(() => {
            //     vm.pixData = vm.pixDataArray1.concat(vm.pixData);
            // });
        }


        /// Real time home subscription/updates methods


        // this is firebase.js method
        function subscribeToHomeFeed(latestEntryId, cb) {
            console.log('shared development sto home feed was this called');
            return _subscribeToFeed(`/feed/${vm.currentAuth.uid}`, latestEntryId, true, cb);
        }



        // get and store the location/query filtered & sorted by lastPostId
        // this is firebase.js method
        function _subscribeToFeed(uri, latestEntryId = null, fetchPostDetails = false, cb) {
            console.log('shared development _sto home feed was this called');
            // var deferred = vm.$q.defer();
            let feedRef = vm.database.ref(uri);
            if (latestEntryId) {
                feedRef = feedRef.orderByKey().startAt(latestEntryId);
            }
            // vm.firebaseRefs.push(feedRef);

            feedRef.on('child_added', feedData => {
                // weed out the latestEntryId
                console.log('feed  subscription child added called');

                if (feedData.key !== latestEntryId) {
                    console.log('feed subscription child added called inside if');
                    // need to set up if for the if no fetchPostDetails
                    // but main is do pass the postData to the callback

                    // Get the postDetails using the feedData.key
                    vm.database.ref(`/posts/${feedData.key}`).once('value').then((postData) => {
                        console.log(postData.key, 'r inside subscribe to homefeed');

                        cb(postData);
                    });
                }
            });


        }

    }
}
