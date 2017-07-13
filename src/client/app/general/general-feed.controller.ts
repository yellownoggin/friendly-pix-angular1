namespace friendlyPix {
    'use strict';


    angular
        .module('app.spaPages')
        .controller('GeneralController', GeneralController);

    function GeneralController(generalFeedData, $filter) {
        console.log('General Controller instantiated.');
        var vm = this;

        // TODO: use initialize? - get clarity -  $onInit as well
        initialize();

        // initialize
        function initialize() {
            makePostsDescending();
        }

        // Controller methods
        function makePostsDescending() {
            vm.generalFeedDataDescending = $filter('reverse')(generalFeedData);
        }
    }
}
