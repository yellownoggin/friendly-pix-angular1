namespace friendlyPix {

        // spaPages Services (maybe site on re-factor)
        // @ngInject
        // TODO: ngInject in the right place?
        // TODO: is this needed?
        angular
            .module('app.shared')
            .service('Auth', AuthService);

        function AuthService($firebaseAuth) {
                return $firebaseAuth();
        }
}
