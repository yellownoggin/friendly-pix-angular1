namespace friendlyPix {
     'use strict';

     angular
         .module('app.shell')
         .controller('ShellController', ShellController);

         function ShellController() {
             var vm = this;
             vm.test = 'Shell Controller World!';
         }

}
