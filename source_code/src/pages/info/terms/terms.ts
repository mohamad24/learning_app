import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsProvider } from '../../../providers/settings/settings';

/**
 * Generated class for the TermsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class TermsPage {

  

  public content;
  constructor(private settingService:SettingsProvider) { }

  async ngOnInit() {
    let settings = await this.settingService.getSetting('settings');
    this.content = settings.info_terms;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsPage');
  }

}
