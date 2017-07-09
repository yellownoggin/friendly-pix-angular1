namespace friendlyPix {
    'use strict';

    angular
        .module('app.addPicture')
        .controller('AddPicController', AddPicController);


        // @Inject
        function AddPicController(uploadHelper) {
            console.log('Add Pic Controller Instantiated');
            var vm = this;
            vm.imageUrl = uploadHelper.getImageUrl();
            vm.uploadPic = uploadHelper.uploadPic;

        }
}
