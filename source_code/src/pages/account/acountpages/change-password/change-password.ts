import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilsProvider } from '../../../../providers/utils/utils';
import { ApiProvider } from '../../../../providers/api/api';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  public password;
  public confirm;
  constructor(public api:ApiProvider,public navCtrl: NavController, public navParams: NavParams,public utils:UtilsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  save(){

    if(this.password != this.confirm){
      this.utils.presentToast('Your two password values do not match');
      return false;
    }

    this.utils.presentLoading();
    this.api.changePassword(this.password).subscribe(resp=>{
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
