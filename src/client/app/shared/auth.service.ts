namespace friendlyPix {

        // spaPages Services (maybe site on re-factor)
        // @ngInject
        // TODO: ngInject in the right place?
        // TODO: is this needed?
        angular
            .module('app.shared')
            .service('AuthService', AuthService);

        function AuthService($firebaseAuth) {

            this.Auth = Auth;

            // Service methods
            function Auth() {
                return $firebaseAuth();
            }
        }
}
