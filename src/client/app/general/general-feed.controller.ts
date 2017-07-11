namespace friendlyPix {
    'use strict';


    angular
        .module('app.spaPages')
        .controller('GeneralController', GeneralController);

    function GeneralController(firebase, $q, generalDataDescending, AuthService) {
        console.log('General Controller instantiated.');
        var POSTS_PAGE_SIZE = 5;
        var vm = this;
        vm.$q = $q;
        vm.database = firebase.database();
        vm.something = 'something';
        vm.currentUser = AuthService.Auth().$getAuth();
        // vm.generalDataEntries = generalData.entries;
        vm.generalDataDescending = generalDataDescending;



        // Social Comments on the pics
        // vm.picComment = '';
        // vm.commentsList = [];

        vm.submitComment = (postId, commentObject) => {
            if (!vm.picComment || vm.picComment.length === 0) {
                return;
            }
            const commentText = commentObject[postId];
            console.log(commentText, 'commentText');
            addComment(postId, commentText);
            vm.picComment = {};

            function addComment(postId, commentText) {
                console.log(postId, 'Message');
                console.log(commentText, 'commentText');
                const commentObj = {
                    text: commentText,
                    timestamp: Date.now(),
                    author: {
                        uid: vm.currentUser.uid,
                        full_name: vm.currentUser.displayName,
                        profile_picture: vm.currentUser.photoURL
                    }
                };
                return vm.database.ref(`comments/${postId}`).push(commentObj);

            }

        };

        // vm.commentsList.push(vm.picComment);
        // vm.picComment = '';






        // vm.postData = {};

        //
        // let p = Object.keys(vm.generalDataEntries);
        //
        // for (let i = p.length - 1; i >= 0; i--) {
        // console.log(p, 'p');
        // console.log(vm.postData[p[i]], 'keys');
        // console.log(vm.generalDataEntries[p[i]], 'vm.postData');

        // vm.postData[p[i]] = vm.generalDataEntries[p[i]];

        // if (generalData.entries[p[i]] === undefined) {
        //     generalData.entries[p[i]] = {1:1};
        //
        // } else {
        //     vm.postData[p[i]] = generalData.entries[p[i]];
        // }


    }

    // console.log(vm.postData, 'data');








    initialize();


    // initialize
    function initialize() {
        clear();
    }



    function clear() {
        // vm.something = 'another';
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
