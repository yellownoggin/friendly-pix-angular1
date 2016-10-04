namespace friendlyPix.app.shared {
    'use strict';

    // resource: https://blogs.msdn.microsoft.com/tess/2015/12/10/
    // 3b-services-getting-started-with-angularjs-typescript-and-asp-net-web-api/

    class SharedDevService {

        constructor(private firebase: any ) {

        }

        startHomeFeedLiveUpdaters() {
            this.firebase
        }

    }

    angular
        .module('app.shared')
        .service('sharedDev', SharedDevService);
}
