namespace friendlyPix {
    'use strict';


    angular
        .module('app.spaPages')
        .controller('GeneralController', GeneralController);

    function GeneralController(generalFeedData, $filter, friendlyFire, $scope, AuthService) {
        console.log('General Controller instantiated.');
        var vm = this;
        vm.currentUser = AuthService.Auth().$getAuth();

        // TODO: use initialize? - get clarity -  $onInit as well
        initialize();

        // initialize
        function initialize() {
            // Currently used
            vm.generalFeedData = generalFeedData;


            // In development

            // TODO: Used for angular fire approach
            // makePostsDescending();

            // TODO: Used for testing infinite scroll
            vm.addOne = addOne;

            // TODO: don't think I need this as far as syncing data from a service
            // $scope.$watchCollection(vm.gA, (n, o) => {
            //     console.log('new', n);
            //     console.log('old', o);
            // });
        }

        // Staging/Dev Methods

        function addOne() {
            console.log('message', 2);
            return 1 + 1;
        }
        // Staging End


        // Controller methods
        // function makePostsDescending() {
        //     vm.generalFeedDataDescending = $filter('reverse')(generalFeedData);
        //     $filter('reverse')(generalFeedData)
        // }
    }
}
