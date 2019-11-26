import { Component, ViewChild } from '@angular/core';
 
import { HomePage } from '../home/home';
import { BrowsePage } from '../catalog/browse/browse';
import { CoursesPage } from '../courses/courses';
import { InformationPage } from '../info/information/information';
import { AccountPage } from '../account/account';
import { CartProvider } from '../../providers/cart/cart';
import { Events, Tabs, NavController, ViewController } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { CheckoutPage } from '../order/checkout/checkout';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ApiProvider } from '../../providers/api/api';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild("rootTabs") rootTabs: Tabs;
  tab1Root = HomePage;
  tab2Root = BrowsePage;
  tab3Root = CoursesPage;
  tab4Root = InformationPage;
  tab5Root = AccountPage;
  tab1BadgeCount : number = 0; // default 0

  constructor(private api:ApiProvider,public auth:AuthenticationProvider,public cartProvider:CartProvider,public events:Events,public utils:UtilsProvider,public navCtr:NavController,public view:ViewController) {

  }

  incrementBadgeCount(){
    // this.tab1BadgeCount = this.tab1BadgeCount+1;
    // this.publishBadgeCountUpdate();
}


decrementBadgeCount(){
  // this.tab1BadgeCount = this.tab1BadgeCount-1;
  // this.publishBadgeCountUpdate();
}

public refreshBadgeCount(){

  
}

ionViewDidLoad(){
  this.subscribeToBadgeCountChange();
  this.subscribeToLogin();
  this.subscribeToLoggedIn();
  this.validateToken();
}



ionViewWillEnter() {

}

validateToken(){
  this.auth.getStoredToken().then(res=>{
    // console.log('token is:');
    // console.log(res);
    if(res){
      this.api.getToken(res).subscribe(resp=>{
        let status = resp['status'];
        if(!status){
          this.auth.logout();
          console.log('token is invalid');
        }
        else{
          console.log('token is valid');
        }
       });
    }
     
  });
}

subscribeToBadgeCountChange(){
  // Method to run when tab count changes
    this.events.subscribe("tabs-page:badge-update", ()=>{
      if(this.cartProvider.hasItems()){
        this.tab1BadgeCount = this.cartProvider.getSessions().length;
      }else{
        this.tab1BadgeCount = 0;
      }
        

        this.rootTabs.select(2);
  });

}

subscribeToLogin(){
  
    this.events.subscribe("tabs-page:login", ()=>{ 
      this.utils.presentToast('Please login or register');
        this.rootTabs.select(4);
  });

}

subscribeToLoggedIn(){
  this.events.subscribe("auth:logged-in", ()=>{ 
    console.log('login subscription recieved');
    if(this.cartProvider.hasItems()){
      this.rootTabs.select(2);
      this.navCtr.push('CheckoutPage');  
      
    }
    
});

}


}
