namespace friendlyPix {
    'use strict';

    angular
        .module('app.shared')
        .service('feeds', feedsService);

    function feedsService($firebaseAuth, friendlyFire) {
        var vm = this;
        this.user  = $firebaseAuth().$getAuth();
        var a = friendlyFire.updateHomeFeeds();


        /**
        * Shows the feed showing all followed users.
        */

        function showHomeFeed() {
            // Clear previously displayed posts if any
            // this.clear()

            if (vm.user) {
                // Make sure the home feed is updated with followed users new posts
                // friendlyFire.updateHomeFeeds().then()



            }
        }
    }
}
