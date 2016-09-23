namespace friendlyPix {
    'use strict';

    angular
        .module('app.shell')
        .directive('chooseFile', chooseFileDirective)
        .controller('ChooseFileController', ChooseFileController);


    function chooseFileDirective($state) {
        return {
            controller: ChooseFileController,
            link: (scope, element, attributes, controller) => {
                var ac = controller;
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
                    console.log('before read picture in directive');
                    ac.readPicture(e);
                    $state.go('home.addPicture')

                })
            }
        }
    } // chooseFileDirective


    // @ngInject
    function ChooseFileController($state, addPicture) {

        //  TODO:  add onInit
        this.currentFile = '';
        this.readPicture = readPicture;
        this.state = $state;
        this.addPicture = addPicture;

        //  Controller methods
        function readPicture(e) {
            // TODO:  qq is this that needed
            var that = this;
            // clear stuff TODO: code needed

            var file = e.target.files[0];
            console.log(file, 'file');
            that.currentFile = file;

            // Ssend/store file in service to be used by uploadPic & generateImagesdon't
            this.addPicture.setCurrenFile(file);

            // TODO: Clear the selection in the filepicker
            // code here
            // resource: http://stackoverflow.com/questions/21708689/clear-text-input-on-click-with-angularjs

            // Only process image files
            if (file.type.match('image.*')) {
                var reader = new FileReader();
                //Send (store) image url so can be used by app-pic view/feature (previews & user adds comments then uploads)
                reader.onload = e => {
                    console.log(e.target.result, 'dataurl');
                    that.addPicture.setImageUrl(e.target.result);
                }
                // Read in the image file is the data url
                reader.readAsDataURL(file);
                // that.disableUploadUi(false);
            }
        }
    }


}
