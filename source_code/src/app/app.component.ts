import { Component } from '@angular/core';
import { Platform, App, ViewController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { AuthenticationProvider } from '../providers/authentication/authentication';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(app:App,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,auth:AuthenticationProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      auth.isAuthenticated();
    });


    // platform.registerBackButtonAction(() => {
    //   let nav = app.getActiveNav();
    //   let activeView: ViewController = nav.getActive();
  
    //   if(activeView != null){
    //     if(nav.canGoBack()) {
    //       nav.pop();
    //     }else if (typeof activeView.instance.backButtonAction === 'function'){
    //       activeView.instance.backButtonAction();
    //     }
    //     else{
    //       nav.pop();
    //     }
           
    //   }
    // });

  }
}
