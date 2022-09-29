export function initFacebookSdk() {
    return new Promise(resolve => {
        // wait for facebook sdk to initialize before starting the vue app
        window.fbAsyncInit = function () {
            const FB = window.FB;
            FB.init({
                appId: process.env.VUE_APP_FACEBOOK_APP_ID,
                cookie: true,
                xfbml: true,
                version: 'v11.0'
            });

            // FB.AppEvents.logPageView();

            // FB.getLoginStatus(function(response) {
            //     statusChangeCallback(response);
            // });

            // {
            //     status: 'connected',
            //         authResponse: {
            //     accessToken: '...',
            //         expiresIn:'...',
            //         signedRequest:'...',
            //         userID:'...'
            // }
            // }

            // auto authenticate with the api if already logged in with facebook
            FB.getLoginStatus(({ authResponse }) => {
                // console.log('authResponse', authResponse);
                if (authResponse) {
                    console.log('authResponse', authResponse);
                    // accountService.apiAuthenticate(authResponse.accessToken).then(resolve);
                } else {
                    resolve();
                }
            });
        };

        // load facebook sdk script
        (function (d, s, id) {
            let js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    });
}
