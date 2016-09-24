namespace friendlyPix {
    'use strict';


    /**
     * Helper factory for choosefile(shell) & add-pic state
     * a. previewing image ( & comments) stage  (stores file/image as url for preview use)
     * b. processing ui and pic preparing (scaling, adding thumb, blobing, etc))
     */
    angular
        .module('app.shared')
        .factory('uploadHelper', uploadHelper);

    function uploadHelper($q) {
        var vm = this;
        // TODO:  declare current file figure out if it's an object/string
        var THUMB_IMAGE_SPECS = {
            maxDimension: 640,
            quality: 0.7
        }

        var FULL_IMAGE_SPECS = {
            maxDimension: 1280,
            quality: 0.9
        }

        return {
            getImageUrl: getImageUrl,
            setImageUrl: setImageUrl,
            getCurrenFile: getCurrenFile,
            setCurrenFile: setCurrenFile,
            readPicture: readPicture,
            uploadPic: uploadPic,
            generateImages: generateImages
        };


        // Factory methods

        // Following 4 methods help store file & imgurl when choosing file
        // these able it to be passed to the add pic state & controller
        //  DON T THINK I NEED THESE CAN JUSTOIN this.currentFile
        /**
         * getImageUrl - s
         *  TODO: notes possibly don't need vm maybe just a private variable
         * @returns {string}
         */
        function getImageUrl() {
            return vm.imageUrl;
        }
        function setImageUrl(url) {
            vm.imageUrl = url;

        }

        function getCurrenFile() {
            return vm.currentFile;
        }
        function setCurrenFile(file) {
            vm.currentFile = file;
        }


        // TODO: this is abstracted in the upload service in the demo
        //  Controller methods
        function readPicture(e) {

            // clear stuff TODO: code needed

            var file = e.target.files[0];
            console.log(file, 'file');
            vm.currentFile = file;

            // Ssend/store file in service to be used by uploadPic & generateImagesdon't
            setCurrenFile(file);

            // TODO: Clear the selection in the filepicker
            // code here
            // resource: http://stackoverflow.com/questions/21708689/clear-text-input-on-click-with-angularjs

            // Only process image files
            if (file.type.match('image.*')) {
                var reader = new FileReader();
                //Send (store) image url so can be used by app-pic view/feature (previews & user adds comments then uploads)
                reader.onload = e => {
                    console.log(e.target.result, 'dataurl');
                    setImageUrl(e.target.result);
                }
                // Read in the image file is the data url
                reader.readAsDataURL(file);
                // that.disableUploadUi(false);
            }
        }


        function uploadPic(e) {
            e.preventDefault();
            // TODO: disable upload button method

            generateImages().then(pics => {

            }

            )


        }

        function generateImages() {
            // set up promises
            var fullDeferred = $q.defer();
            var thumbDeferred = $q.defer();

            var resolveFullBlob = blob => fullDeferred.resolve(blob);
            var resolveThumbBlob = blob => fullDeferred.resolve(blob);

            var displayPicture = (url) => {
                var image = new Image();
                image.src = url;

                // Generate thumb
                var maxThumbDimension = THUMB_IMAGE_SPECS.maxDimension;
                var thumbCanvas = _getScaledCanvas(image, maxThumbDimension);
                thumbCanvas.toBlob(resolveThumbBlob, 'image/jpeg', THUMB_IMAGE_SPECS.quality);

                // Generate thumb
                var maxFullDimension = FULL_IMAGE_SPECS.maxDimension;
                var fullCanvas = _getScaledCanvas(image, maxFullDimension);
                fullCanvas.toBlob(resolveFullBlob, 'image/jpeg', FULL_IMAGE_SPECS.quality);
            }

            var reader = new FileReader();
            reader.onload = (e) => {
                displayPicture(e.target.result);
            }
            reader.readAsDataURL(vm.currentFile);

            return $q.all([fullDeferred.promise, thumbDeferred.promise]).then(results => {
                return {
                    full: results[0],
                    thumb: results[1]
                }
            })

        } // generateImages


        function _getScaledCanvas(image, maxDimension) {
            var thumbCanvas = document.createElement('canvas');
            if (image.width > maxDimension ||
                image.height > maxDimension) {
                if (image.width > image.height) {
                    thumbCanvas.width = maxDimension;
                    thumbCanvas.height = image.height * maxDimension / image.width;
                } else {
                    thumbCanvas.width = maxDimension * image.width / image.height;
                    thumbCanvas.height = maxDimension;
                }
            } else {
                thumbCanvas.width = image.width;
                thumbCanvas.height = image.height;
            }
            // Draw image with canvas api
            thumbCanvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height, 0, 0, thumbCanvas.width, thumbCanvas.height);
            return thumbCanvas;



        }

    }
}
