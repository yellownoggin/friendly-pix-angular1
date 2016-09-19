var friendlyPix;
(function (friendlyPix) {
    'use strict';
    angular
        .module('friendlyPix', ['app.core'])
        .controller('ShellController', ShellController);
    function ShellController() {
        var vm = this;
        vm.test = 'Shell Controller World!';
    }
})(friendlyPix || (friendlyPix = {}));
