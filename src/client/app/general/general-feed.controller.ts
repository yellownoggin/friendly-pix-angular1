namespace friendlyPix {
    'use strict';


    angular
        .module('app.general')
        .controller('GeneralController', GeneralController);

    function GeneralController(generalFeedData, $filter, friendlyFire,
        $scope, feeds, firebase) {
        console.log('General Controller instantiated.');
        var vm = this;

        // TODO: use initialize? - get clarity -  $onInit as well
        initialize();

        // initialize
        function initialize() {

            // general display
            vm.entries = feeds.convertToArray(generalFeedData.entries);

            // inifinite scroll and pagination
            vm.nextPage = generalFeedData.nextPage;
            vm.busy = false;
            vm.concatNextPage = concatNextPage;

            // New posts queue notify and display
            let latestPostId = vm.entries[0].key;
            vm.database = firebase.database();
            let feedRef = vm.database.ref('posts').orderByKey().startAt(latestPostId);
            vm.length = null;
            vm.newPostsCountArray = [];

            vm.displayAllPosts = displayAllPosts;
            feeds.getNewPostsCount(feedRef, latestPostId, vm.length, vm.newPostsCountArray);

        }


        ///// Staging Controller Logic

        ///// End Of Staging

        // Controller methods

        function concatNextPage() {

            // 1. Prevents from multiple calls of same nextPage on scroll
            // 2. Returns at the end of posts
            if (vm.busy === true) {
                return;
            } else if (typeof vm.nextPage !== 'function') {
                console.log('No more posts');
                return;
            }

            // Sets pagination to busy state preventint multiple calls
            vm.busy = true;
            vm.nextPage().then((data) => {
                var newData = [];
                newData = feeds.convertToArray(data.entries);
                vm.nextPage = data.nextPage;
                vm.entries = vm.entries.concat(newData);
                vm.busy = false;
                $scope.$apply();
            });
        }


        /**
         * Displays new posts in new post queue
         * TODO: change to showGeneralFeed?. And add clear()
         */
        function displayAllPosts() {
            vm.entries = null;
            vm.nextPage = null;

            friendlyFire.getPostsTest()
                .then((data) => {
                    vm.entries = feeds.convertToArray(data.entries);
                    vm.nextPage = data.nextPage;
                    vm.newPostsCountArray = [];
                    $scope.$apply();
                })
                .catch((e) => {
                    console.log('e in generalFeedData resolve: ', e);
                });
        }

    } // controller
}
