namespace friendlyPix {
    'use strict';

    angular
        .module('app.spaPages')
        .controller('HomeController', HomeController);

    function HomeController(FbOarService, feeds, $firebaseAuth, currentAuth,
         _pixData, sharedDev, firebase) {

        console.log('Home Controller initialized');

        var vm = this;

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
        }



        // TODO: notes
        function showHomeFeed() {
            // Clear existing posts TODO: is that all?
            vm.pixData = _pixData[0];
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

        function watchNewPosts() {

        }


        /// Real time home subscription/updates methods


        // this is firebase.js method
        function subscribeToHomeFeed(latestEntryId, cb) {
            console.log('shared development sto home feed was this called');
            return _subscribeToFeed(`/feed/${vm.currentAuth.uid}`, cb, latestEntryId, true);
        }



        // get and store the location/query filtered & sorted by lastPostId
        // this is firebase.js method
        function _subscribeToFeed(uri, cb, latestEntryId = null, fetchPostDetails = false) {
            console.log('shared development _sto home feed was this called');
            let feedRef = vm.database.ref(uri);
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
                    vm.database.ref(`/posts/${feedData.key}`).once('value').then((postData) => {
                        // console.log(postData, 'r inside subscribe to homefeed');
                        cb(postData.key, postData.val());
                    });
                }
            });

            vm.firebaseRefs.push(feedRef);
        }

    }
}
