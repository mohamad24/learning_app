import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { SettingsProvider } from '../../../providers/settings/settings';
import { UtilsProvider } from '../../../providers/utils/utils';

/**
 * Generated class for the CurrencyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-currency',
  templateUrl: 'currency.html',
})
export class CurrencyPage {

  public settings;
  public currencies;
  public currency;
  constructor(public events:Events,public utils:UtilsProvider,public navCtrl: NavController, public navParams: NavParams,public settingsProvider:SettingsProvider,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
        //set currency
        this.settingsProvider.getSettings().then(val => { 
          console.log(val);
          this.settings = val; 
          //get exchange rate for currency
          let currencyList = val.currencies;
          
          this.currencies = currencyList;
           
        });
  }

  public setCurrency(currency){
    this.settingsProvider.setCurrency(currency.currency_id);
    this.viewCtrl.dismiss();
    this.events.publish('checkout:currency-change');

  }
}
