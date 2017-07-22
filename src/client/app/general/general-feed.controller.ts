namespace friendlyPix {
    'use strict';


    angular
        .module('app.spaPages')
        .controller('GeneralController', GeneralController);

    function GeneralController(generalFeedData, $filter, friendlyFire, $scope, AuthService, feeds, firebase) {
        console.log('General Controller instantiated.');
        var vm = this;
        vm.currentUser = AuthService.Auth().$getAuth();

        // TODO: use initialize? - get clarity -  $onInit as well
        initialize();

        // initialize
        function initialize() {
            vm.currentUser = AuthService.Auth().$getAuth();
            vm.entries = convertToArray(generalFeedData.entries);
            vm.nextPage = generalFeedData.nextPage;
            vm.busy = false;
            vm.concatNextPage = concatNextPage;

            // Currently used
            vm.generalFeedData = generalFeedData;


            ///// Staging in init
            let latestPostId = vm.entries[0].key;
            vm.database = firebase.database();
            let feedRef = vm.database.ref('posts').orderByKey().startAt(latestPostId);
            getNewPostsCount(feedRef, latestPostId);
            vm.displayAllPosts = displayAllPosts;


        }


        ///// Staging

        // New Posts Queue
        let entriesCopy = vm.entries;
        // notifyOfNewPosts(entriesCopy);

        // console.log('latestPostId', latestPostId.key);
        vm.newPostsCountArray = [];

        function displayAllPosts() {
            vm.entries = null;
            vm.nextPage = null; 

            console.log('displayAllPosts Called');
            friendlyFire.getPostsTest()
                .then((data) => {
                    console.log('displayAllPosts data', data.nextPage);
                    vm.entries = convertToArray(data.entries);
                    vm.nextPage = data.nextPage;
                    vm.newPostsCountArray = [];
                    $scope.$apply();
                })
                .catch((e) => {
                    console.log('e in generalFeedData resolve: ', e);
                });
        }

        function getNewPostsCount(feedReference, lPostId) {
            feedReference.on('child_added', (feedData) => {
                // Take out the latestEntryId post (already in feed)
                console.log('latestPostId', lPostId);
                if (feedData.key !== lPostId) {

                    console.log('feedData in feederRef call back', feedData);
                    console.log('feedData key', feedData.key);
                    console.log('feedData value', feedData.val());


                    // No posts details use what's there (? key, value(?postId only))
                    // if (!fetchPostDetails) {
                    //  Won't need callback - will return as a promise(already built into this)
                    // addPostCallback(feedData.key, feedData.value)
                    // var feedDataIds = Object.keys(feedData);
                    console.log('feedDataIds', feedData.key);

                    vm.newPostsCountArray.push(feedData.key);

                    console.log('vm.newPostsCount', vm.newPostsCountArray);
                    console.log('vm.newPostsCount.length', vm.newPostsCountArray.length);
                    $scope.$apply();

                }

            });
        }






        function notifyOfNewPosts(currentEntries) {
            let latestPostId = currentEntries[0];
            console.log('latestPostId', latestPostId);
            return feeds.subscribeToGeneralFeed(latestPostId);
        }

        ///// End Of Staging


        // Controller methods

        function concatNextPage() {
            if (vm.busy === true) {
                console.log('Busy inifinite scroll ');
                return;
            } else if (typeof vm.nextPage !== 'function') {
                console.log('No more posts');
                return;
            }
            vm.busy = true;
            vm.nextPage().then((data) => {
                var newData = [];
                newData = convertToArray(data.entries);
                vm.nextPage = data.nextPage;
                vm.entries = vm.entries.concat(newData);
                vm.busy = false;
                $scope.$apply();
            });
        }

        function convertToArray(data) {
            // TODO: save for firebase object to usable angular array
            var reversedPostData = [];
            let p = Object.keys(data);

            for (let i = p.length - 1; i >= 0; i--) {
                // TODO: abstraction and docs;;
                // convert to an array and add the key
                var myObject = {};
                myObject['value'] = data[p[i]];
                myObject['key'] = p[i];
                reversedPostData.push(myObject);

            }
            return reversedPostData;
        }








    }
}
