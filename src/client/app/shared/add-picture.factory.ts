namespace friendlyPix {
    'use strict';

    /**
     * Helper factory allows for data from choosefile to be accessed during
     *  add picture(preview) & upload phase
     *  TODO: QQ : 1. explore another way or shell controller plays apart and
     *  maybe can  simplify the process
     *  2. readpic can also be abstracted(I think would be best practice)
     */

    angular
        .module('app.shared')
        .factory('addPicture', addPictureFactory);

    function addPictureFactory() {
        return {
            getImageUrl: getImageUrl,
            setImageUrl: setImageUrl,
            getCurrenFile: getCurrenFile,
            setCurrenFile: setCurrenFile
        };

        // Factory methods
        function getImageUrl() {
            return this.imageUrl;
        }
        function setImageUrl(url) {
            this.imageUrl = url;
            console.log(this.imageUrl, 'this.imageUrl');
        }

        function getCurrenFile() {
            return this.currentFile;
        }
        function setCurrenFile(file) {
            this.currentFile = file;
        }

    }
}
