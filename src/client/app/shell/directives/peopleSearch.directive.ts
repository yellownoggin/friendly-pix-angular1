namespace friendlyPix {
    'use strict';

    angular
        .module('app.shell')
        .directive('peopleSearch', peopleSearch)
        .controller('PeopleSearchController', PeopleSearchController);

    /**
     * PeopleSearchController
     */
    function PeopleSearchController() {
        console.log('people search control instantiated');
        this.searchResults = [];
    }

    /**
     * peopleSearch Directive
     */
    function peopleSearch(friendlyFire, feeds, $document) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/shell/peopleSearch.html',
            scope: {
            },
            link: linkFunc,
            controller: 'PeopleSearchController',
            controllerAs: 'ct',
            bindToController: true
        };

        return directive;
        // TODO: ct.searchResults = []; not working completely: multiple same results flash on events
        function linkFunc(scope, element, attr, ct) {
            let input = element[0].querySelector('#mfp-searchField');
            const MINIMUM_INPUT = 3;
            const RESULTS_LIMIT = 10;
            ct.searchResults = [];
            // wrap in a jquerylite
            input = angular.element(input);

            // event listeners:
            // focus and click included due to hide when click on document hides results
            input.on('keyup', displaySearchResults);
            input.on('focus', displaySearchResults);
            input.on('click', displaySearchResults);


            function displaySearchResults(e) {
                console.log('event listener called');
                ct.searchResults = [];
                if (ct.searchQuery) {
                    const searchString = ct.searchQuery.toLowerCase().trim();
                    if (searchString.length >= MINIMUM_INPUT) {
                        ct.searchResults = [];
                        friendlyFire.searchUsers(searchString, RESULTS_LIMIT).then((data) => {
                            ct.searchResults = [];
                            ct.showSearchResults = false;
                            let searchResults = feeds.convertToArray(data);
                            if (searchResults.length > 0) {
                                $document.on('click', () => {
                                    $document.unbind('click');
                                    ct.searchResults = [];
                                    ct.showSearchResults = false;
                                    scope.$apply();
                                });
                                ct.showSearchResults = true;
                                ct.searchResults = searchResults;
                            } else {
                                ct.showSearchResults = false;
                            }
                        });
                    } else {
                        ct.searchResults = [];
                    }
                } else {
                    ct.searchResults = [];
                    return;
                }
            }


        }

    }



}
