namespace friendlyPix {
    'use strict';


    angular
        .module('app.spaPages')
        .controller('GeneralController', GeneralController);

    function GeneralController(generalFeedData, $filter, friendlyFire, $scope, AuthService, feeds, firebase, $q) {
        console.log('General Controller instantiated.');
        var vm = this;
        vm.currentUser = AuthService.Auth().$getAuth();
        vm.$q = $q;

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


            // New posts notify logic
            vm.length = null;
            vm.newPostsCountArray = [];
            getNewPostsCount(feedRef, latestPostId);
            vm.displayAllPosts = displayAllPosts;

        }

        // TODO:
        // clean and test (multiple button clicks/ meaning: click upload click)


        ///// Staging Controller Logic

        function getNewPostsCount(feedReference, lPostId) {
                feedReference.on('child_added', (feedData) => {

                   // Take out the latestEntryId post (already in feed)
                   if (feedData.key !== lPostId) {

                      // Just need the keys to get a count for button
                      // displayAllPosts/getpostsTest doing feed update
                      // on click
                       vm.newPostsCountArray.push(feedData.key);
                       vm.length = vm.newPostsCountArray.length;
                       $scope.$apply();
                   }
               });
}

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
