// https://github.com/firebase/firebaseui-web
// q's
// see below


// start was not recognized




function HomeController($firebaseAuth, firebaseUi, firebase) {
    console.log('home controller initialized')
    var uiConfig  = {
        'signInFlow': 'popup',
        'signInOptions': [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ]
    };

    var firebaseUiFred = firebaseUi($firebaseAuth());
    // console.log(firebaseUiFred.start('#home', uiConfig));


}



in the core.config file

.constant('firebaseUi', firebaseui.auth.AuthUI)
// .constant('uiConfig', uiConfig)
//         .run(uiConfig)



// in the run phase

// start was recognized but how to use in directive or a controller.
// preferably a directive since there is dom manipulation

function uiConfig(firebase, firebaseUi) {
    // var uiConfig  = {
    //     'signInFlow': 'popup',
    //     'signInOptions': [
    //         firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //         firebase.auth.FacebookAuthProvider.PROVIDER_ID
    //     ]
    // };
    //
    // var firebaseUiWith = firebaseUi(firebase.auth());
    // console.log(firebaseUiWith.start, 'firebaseUiWith.start');

}
