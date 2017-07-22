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
            vm.currentUser = AuthService.Auth().$getAuth();
            vm.entries = convertToArray(generalFeedData.entries);
            vm.nextPage = generalFeedData.nextPage;
            vm.busy = false;
            vm.concatNextPage = concatNextPage;

            // Currently used
            vm.generalFeedData = generalFeedData;

        }


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
