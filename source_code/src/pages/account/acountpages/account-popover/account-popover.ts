import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { AuthenticationProvider } from '../../../../providers/authentication/authentication';

/**
 * Generated class for the AccountPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account-popover',
  templateUrl: 'account-popover.html',
})
export class AccountPopoverPage {

  constructor(public app:App,public auth:AuthenticationProvider,public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPopoverPage');
  }

  close(){
    this.viewCtrl.dismiss();
  }

  logout(){
    this.auth.logout();
    this.viewCtrl.dismiss();
  }

  openPage(page){
    let nav = this.app.getRootNav();
    nav.push(page);
    this.viewCtrl.dismiss();
  }

}
