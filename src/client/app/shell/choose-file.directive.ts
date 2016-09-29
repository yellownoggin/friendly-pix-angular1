namespace friendlyPix {


    'use strict';

    angular
        .module('app.shell')
        .directive('chooseFile', chooseFileDirective);



    function chooseFileDirective($state, uploadHelper) {
        return {
            link: (scope, element, attributes, controller) => {

                /**
                 * 1. bind button click to listener that triggers input file click
                 * 2. send  whole file tp be processes on upload (addPicService)
                 * 3. Use reader object to read file as data url to be used in upload preview(add pic feature/view)
                 */                  // TODO: QQ
                // why wrap input & not button both querying or finding something(return something)
                // how to use controllerAs in link function(how does it relate)
                // for example if parameter says controller how do you use the vm or ac in this case
                var button = element.find('button');
                var input = angular.element(element[0].querySelector('input#fileInput'));

                button.bind('click', () => {
                    input[0].click();
                });

                input.bind('change', (e) => {
                    // TODO:  got error duplicate $apply
                    // scope.$apply(() => {
                        console.log('before read picture in directive');
                        uploadHelper.readPicture(e);
                        input.value = null;
                        $state.go('home.addPicture');
                    // });
                });

            }
        };
    } // chooseFileDirective


}
