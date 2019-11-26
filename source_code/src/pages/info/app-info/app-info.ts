import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';

/**
 * Generated class for the AppInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-app-info',
  templateUrl: 'app-info.html',
})
export class AppInfoPage {

  public appName;
  public versionNumber;
  constructor(private appVersion: AppVersion,public navCtrl: NavController, public navParams: NavParams) {
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad AppInfoPage');
    this.appName = await this.appVersion.getAppName();
    this.versionNumber = await this.appVersion.getVersionNumber();
  }

}
