namespace  friendlyPix {
    'use strict';


    angular
        .module('app.core', [
            'ngMaterial',
            'ui.router',
            'ngAnimate',
            'firebase',
            'app.splash',
            'app.home',
            'app.general',
            'app.shell',
            'app.shared',
            'app.addPicture',
            'app.user',
            'app.post',
            'angular.filter',
            'infinite-scroll'
        ]);

}
