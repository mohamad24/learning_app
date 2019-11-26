import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController, Events, PopoverController } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { SettingsProvider } from '../../../providers/settings/settings';
import { UtilsProvider } from '../../../providers/utils/utils';
import { CartProvider } from '../../../providers/cart/cart';

/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  public loading;
  public paymentMethods;
  public coupon;
  public method;
  public currencyId;
  public settings;
  public currency;


  constructor(public events:Events,public cartService:CartProvider,public utils:UtilsProvider,public settingsProvider:SettingsProvider,public loadingController:LoadingController,public app:App,public navCtrl: NavController, public navParams: NavParams,public api:ApiProvider, public popoverCtrl: PopoverController) {

  }

  ionViewDidLoad() {
  //  this.subscribeToCurrencyChange();
     
  }

 async ionViewWillEnter(){
    //get payment methods
    this.load();


  }

 async load(){
    this.presentLoading();
    this.currencyId = await this.settingsProvider.getCurrencyId();
    console.log('Currency id: '+this.currencyId);
    this.api.getPaymentMethods(this.currencyId).subscribe(resp=>{
      console.log(resp);
       this.paymentMethods = resp;
      this.loading.dismiss();
    },err=>{
        this.utils.networkError();
        this.loading.dismiss();
        this.navCtrl.pop();
    });

    // let currency = await this.settingsProvider.getCurrencyId();
    this.currency = await this.settingsProvider.getCurrency();
    //set currency
   this.settingsProvider.getSettings().then(val => { 
      console.log(val);
      this.settings = val;
      
    
    });
  }

  subscribeToCurrencyChange(){
    this.events.subscribe('checkout:currency-change',()=>{
      console.log('currency change event recieved');
        this.load();
    });
  }

  presentLoading() {
    this.loading = this.loadingController.create({
      content: 'Loading. Please wait...',
      duration: 2000000000
    });
     this.loading.present();
  }


  payment(){
    console.log('Method: '+this.method);
    console.log('Code: '+this.coupon);
    let sessions = this.cartService.getSessions();
    console.log('Sessions: '+sessions);

    let sessionArray=[];

    for(let session of sessions){
      sessionArray.push(session['session_id']);
    }

    //now create invoice
    this.presentLoading();
    this.api.storeInvoice(sessionArray,this.method,this.currencyId,this.coupon).subscribe(resp=>{
        let status = resp['status'];
         this.loading.dismiss();
        if(status){
            if(resp['payment_required']){
              console.log('Opening Summary page');
              this.cartService.setInvoice(resp);
                 //navigate to payment page 
                this.navCtrl.push('SummaryPage');

            }
            else{
              this.utils.presentToast('Your enrollment is complete!');
              this.cartService.clearCart();
              this.navCtrl.popToRoot();
              this.events.publish('tabs-page:badge-update');
            }


        }
        else{
          this.utils.presentAlert('Checkout Error',resp['message']);
        }

    },err=>{
      this.utils.networkError();
      this.loading.dismiss();
    });

  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create('CurrencyPage');
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(()=>{
        this.method = null;
        this.load();
    });
  }

}
