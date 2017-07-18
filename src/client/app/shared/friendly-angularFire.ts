namespace friendlyPix {
    'use strict';

    /**
     * Handles all Firebase interactions.
     * Using as much angularFire features as possible
     */
    angular
        .module('app.shared')
        .factory('friendlyAngularFire', friendlyAngularFireFactory);

        function friendlyAngularFireFactory($firebaseArray, $firebaseObject) {
            
        }

}
