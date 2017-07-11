// TODO:
goal: list cat & group efficiency,  execute later

1. black images: adding some images are coming up black in app. Ironview.png
    - happens in the main friendly pix as well

2. angular material and theme, design optimization(finishing phase*)
    md-whiteframe works as an element not as a attribute
    - development work around 4 now (css with div )
3. user html
    - how to vert align a row component
    - so Display name is higher



// done  

1. fp-user-container
    - uses the auth service getAuth to get data for pic and name
2. fp-user page posts feature

    : update - getPaginatedFeed already created. But the question still lies why can't you use $firebaseArray here.
    - _getPaginatedFeed
        - https://github.com/firebase/friendlypix/blob/master/web/public/scripts/firebase.js#L206
    - getPostData
        - https://github.com/firebase/friendlypix/blob/master/web/public/scripts/firebase.js#L382
    - firebase.getUserFeedPost
    https://github.com/firebase/friendlypix/blob/master/web/public/scripts/firebase.js#L158
        - firebase.subscribeToUserFeed

    - the diff between angularfire and firebase sdk
        - https://stackoverflow.com/questions/40996305/how-to-get-values-and-id-from-firebasearray-in-angularjs
        -


    failed
    return $firebaseArray(ref).$loaded()
        .then((data) => {
            // console.log(data[0], 'message');
            const entries = data || {};
            const entryIds = Object.keys(entries);
            // console.log(entryIds, 'entryIds');
            //
            // TODO: this is printing out prototype methods as
            // well(not just relevant values)
            const queries = entryIds.map((postId) => {
                console.log(postId, 'postId');
            });


        });    
