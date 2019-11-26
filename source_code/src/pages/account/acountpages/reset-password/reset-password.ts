import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../../../providers/api/api';
import { UtilsProvider } from '../../../../providers/utils/utils';

/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  public email; 
  constructor(public api:ApiProvider,public navCtrl: NavController, public navParams: NavParams,public utils:UtilsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

  save(){

     this.utils.presentLoading();
    this.api.resetPassword(this.email).subscribe(resp=>{
      this.utils.dismissLoading();
        if(resp['status']){
          
            this.utils.presentToast(resp['msg']);
            this.navCtrl.pop();
        }
        else{
          this.utils.presentToast(resp['msg']);
        }
    },err=>{
      this.utils.dismissLoading();
        this.utils.networkError();
    });

  }
}
