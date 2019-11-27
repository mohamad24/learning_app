import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApiProvider } from '../api/api';
import { ModalController, LoadingController } from 'ionic-angular';
const STORAGE_KEY = 'settings';
/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SettingsProvider {
  private settingStatus: boolean = false;
  public modal;

  constructor(public http: HttpClient, private storage: Storage, private apiService: ApiProvider, public modalController: ModalController, public loadingController: LoadingController) {
    console.log('Hello SettingsProvider Provider');
  }

  checkSettings() {

    return this.storage.get(STORAGE_KEY).then(val => {
      // this.settingStatus = true;
      return val !== null;

    });

  }

  getSettings() {
    return this.storage.get(STORAGE_KEY);
  }

  async getSetting(key) {

    //   let result;
    //   await this.storage.get(STORAGE_KEY).then( val => {
    //       // this.settingStatus = true;
    //       let resp = val[key];
    //       result = val;
    //   });
    //  return result;
    let result = await this.storage.get(STORAGE_KEY);
    return await result[key];

  }




  hasSettings(): boolean {
    return this.settingStatus;
  }



  storeSettings() {

    this.apiService.getSettings().subscribe(res => {
      console.log(res);
      this.storage.set(STORAGE_KEY, res);
      //store currency id
      // this.storage.set('currency_id',res.student_currency);

    }, err => {
      console.log(err.message);
    });
  }






  public getKey() {
    return STORAGE_KEY;
  }

  public async saveSettings(data) {
    this.storage.set(STORAGE_KEY, data);
    let currencyId = await this.getCurrencyId();
    console.log('Currency id (settings provider):');
    console.log(currencyId);
    if (!currencyId) {
      this.storage.set('currency_id', data.student_currency);
    }

  }

  setCurrency(currency) {
    this.storage.set('currency_id', currency);
  }

  async getCurrencyId() {
    return await this.storage.get('currency_id');
  }

  async getCurrency() {
    let currencyId = await this.getCurrencyId();
    let settings = await this.getSettings();
    if (settings) {
      console.log(settings);
      let currencyList = settings.currencies;
      let currencyObj: any;
      for (let i = 0; i < currencyList.length; i++) {
        let obj = currencyList[i];
        if (obj.currency_id == currencyId) {
          currencyObj = obj;
        }
      }
      return currencyObj;
    }

  }


}
