import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { CartProvider } from '../../../providers/cart/cart';
import { SettingsProvider } from '../../../providers/settings/settings';
import { AuthenticationProvider } from '../../../providers/authentication/authentication';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ApiProvider } from '../../../providers/api/api';
import { UtilsProvider } from '../../../providers/utils/utils';

/**
 * Generated class for the SummaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
})
export class SummaryPage {

  public invoice;
  public currency;
  public loading;
  constructor(public events:Events,public loadingController:LoadingController,private api:ApiProvider,private iab: InAppBrowser,public settingService:SettingsProvider,public navCtrl: NavController, public navParams: NavParams, public cartProvider:CartProvider,public authProvider:AuthenticationProvider,private utils:UtilsProvider) {
  }

 async ionViewWillEnter() {
    this.currency = await this.settingService.getCurrency();

    this.invoice = this.cartProvider.getInvoice();


    console.log(this.invoice);
  }

  async payment(){
    //get url for opening
    let basePath = await this.settingService.getSetting('base_path');
    let token =  this.authProvider.getToken();
    let url = basePath+'/mobile/pay?token='+token+'&invoice='+this.invoice.invoice.invoice_id;
    let closeUrl = basePath+'/mobile/close';
    console.log(url);
    const browser = this.iab.create(url);
    browser.show();
 
    try {
      browser.on('loadstart').subscribe((e) => { 
        console.log(e.url);
        if (e.url == closeUrl) {
          browser.close();
          //get invoice
            this.presentLoading();
            this.api.getInvoice(this.invoice.invoice.invoice_id).subscribe(resp=>{
                  this.loading.dismiss();
                  let invoice = resp['invoice'];
                  console.log(invoice);
                  if(invoice.paid==1){
                    this.utils.presentToast('Order complete');
                    this.cartProvider.clearCart();
                    this.events.publish('tabs-page:badge-update');
                    this.navCtrl.popToRoot();
                  }else{
                    this.utils.presentToast('Your order is pending payment');
                  }
            },err=>{
              this.loading.dismiss();
              this.utils.networkError();
            });
        }
      });
    }
    catch(e) {
      console.log(e);
    }
  

  }

  presentLoading() {
    this.loading = this.loadingController.create({
      content: 'Loading. Please wait...',
      duration: 2000000000
    });
     this.loading.present();
  }

}
