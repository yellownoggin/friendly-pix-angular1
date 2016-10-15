namespace friendlyPix {
    'use strict';


    angular
        .module('app.spaPages')
        .controller('GeneralController', GeneralController);

    function GeneralController(firebase, $q) {
        console.log('General Controller instantiated.');
        var POSTS_PAGE_SIZE = 5;
        var vm = this;
        vm.$q = $q;
        vm.database = firebase.database();
        vm.something = 'something';

        showGeneralFeed();
        initialize();


        // initialize
        function initialize() {
            clear();
        }



        function clear() {
            vm.something = 'another';
        }
        // Feed & Friendly Fire methods
        function showGeneralFeed() {
            // clear

            getPosts();

        }

        function getPosts() {
            return _getPaginatedFeed('/posts/', 5);
        }


        // function getPosts() {
        //     return _getPaginatedFeed('/posts/', POSTS_PAGE_SIZE,  )
        // }

        function _getPaginatedFeed(uri, pageSize, earliestEntryId = null, fetchDetails = false) {
            console.log('Fetching entries from', uri, 'start at', earliestEntryId, 'page size', pageSize);
            var ref = vm.database.ref(uri);
            // ref.once('value').then((snapshot) => {
            //     console.log(snapshot.val());
            // });
            // if (earliestEntryId) {
            //     ref = ref.orderedByKey().endAt(earliestEntryId);
            // }
            ref.orderByKey().startAt('-KTvfnaJPQDyQ7JLjcgX').once('value').then((snapshot) => {
                console.log('orderByKey', snapshot.val());
            });

            ref.orderByKey().endAt('-KTvfnaJPQDyQ7JLjcgX').limitToLast(3).once('value').then((snapshot) => {
                console.log('orderByKey limit', snapshot.val());
            });
            // return
            // ref.limitedToLast(pageSize + 1).once('value').then((data) => {
            //     var entries = data.val() || {};
            //
            //     // Figure out if there's a next page
            //     var nextPage = null;
            //     var entryIds = Object.keys(entries);
            //     if (entryIds > pageSize) {
            //         delete entries[entryIds[0]];
            //         var nextPageStartingId = entryIds.shift();
            //         nextPage = () => {
            //             vm._getPaginatedFeed(uri, pageSize, nextPageStartingId, fetchDetails);
            //         }
            //     }
            // });
        }

    }
}
