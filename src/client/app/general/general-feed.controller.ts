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
            vm.addOne = addOne;
        }

        // Staging/Dev

        function addOne() {
            console.log('message', 2);
            return 1 + 1;
            }

        // Controller methods
        function makePostsDescending() {
            vm.generalFeedDataDescending = $filter('reverse')(generalFeedData);
        }
    }
}
