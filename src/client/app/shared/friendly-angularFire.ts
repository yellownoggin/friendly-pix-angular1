// namespace friendlyPix {
//     'use strict';
//
//     /**
//      * Handles all Firebase interactions.
//      * Using as much angularFire features as possible
//      */
//     angular
//         .module('app.shared')
//         .factory('friendlyAngularFire', friendlyAngularFireFactory);
//
//     function friendlyAngularFireFactory($firebaseArray, $firebaseObject) {
//
//
//         return {
//             getPostDataNew: getPostDataNew,
//             getPostsNew: getPostsNew,
//             getCommentsNew: getCommentsNew,
//         };
//
//
//             // Factory methods

    ////////// STAGING


    // function _getPaginatedFeedNew(uri, pageSize, earliestEntryId = null, fetchPostDetails = false) {
        // console.log('_getPaginatedFeed is called');
        // let ref = vm.database.ref(uri);

        // ??
        // if (earliestEntryId) {
        //     ref = ref.orderByKey().endAt(earliestEntryId);
        // }



        // Were fetching an additional item as a cheap way to test if there is a next page.

        // let ps = ref.limitToLast(pageSize + 1);
        // return $firebaseArray(ps).$loaded().then(data => {

            // console.log('data in new paginate feed', data);
            // return data;

            // const entries = data.val() || {};

            // Figure out if there is a next page.
            // let nextPage = null;
            // const entryIds = Object.keys(entries);
            // if (entryIds.length > pageSize) {
            //     delete entries[entryIds[0]];
            //     const nextPageStartingId = entryIds.shift();
            //     nextPage = () => vm._getPaginatedFeed(
            //         uri, pageSize, nextPageStartingId, fetchPostDetails
            //     );
            // }

            // if (fetchPostDetails) {
            //     // Fetch details of all posts
            //     // TODO:
            //     // firebase-fp.service.ts#L537
            //     const queries = entryIds.map(postId => vm.getPostDataNew(postId));
            //     // Since all the requests are being done on the same feed it's unlikely that a single 1
            //     // would fail and not the others so using promise.all(q.all)  is not so risky
            //     return vm.$q.all(queries).then(results => {
            //         console.log('postData with $firebaseObject', results);
            //
            //         const deleteOps = [];
            //         results.forEach(result => {
            //             if (result.val()) {
            //                 console.log(result.key, 'result.key');
            //                 entries[result.key] = result.val();
            //             } else {
            //                 //
            //                 delete entries[result.key]; // TODO: why is this here?
            //                 // needs a method
            //                 deleteOps.push(vm.deleteFromFeed(uri, result.key));
            //             }
            //         });
            //         if (deleteOps.length > 0) {
            //             // todo;
            //             return vm._getPaginatedFeed(uri, pageSize, earliestEntryId, fetchPostDetails);
            //         }
            //         return { entries: entries, nextPage: nextPage };
                // });
            // }
            // return { entries: entries, nextPage: nextPage };

    // }


    //
    // function getPostDataNew(postId) {
    //     let ref = this.database.ref(`/posts/${postId}`);
    //     return $firebaseArray(ref);
    // }
    //
    // function getPostsNew() {
    //     return _getPaginatedFeedNew('/posts/', 3);
    // }
    //
    // function getCommentsNew(postId) {
    //     return _getPaginatedFeedNew(`/comments/${postId}`, 5, null, false);
    // }






///////////////////// new stuff end in staging more stagin below

//
//
//     }
//
// }
