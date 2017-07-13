namespace  friendlyPix {
    'use strict';


    angular
        .module('app.core', [
            'ngMaterial',
            'ui.router',
            'ngAnimate',
            'firebase',
            'app.spaPages',
            'app.shell',
            'app.shared',
            'app.addPicture',
            'app.user',
            'angular.filter'
        ]);

}
