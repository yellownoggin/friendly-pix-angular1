var myApp;
(function (myApp) {
    'use strict';
    angular
        .module('myApp', [])
        .controller('MainController', MainController);
    function MainController() {
        var vm = this;
        vm.test = 'Hello World';
    }
})(myApp || (myApp = {}));
