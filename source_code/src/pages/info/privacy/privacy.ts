import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsProvider } from '../../../providers/settings/settings';



@IonicPage()
@Component({
  selector: 'page-privacy',
  templateUrl: 'privacy.html',
})
export class PrivacyPage {

  public content;
  constructor(private settingService:SettingsProvider) { }

  async ngOnInit() {
    let settings = await this.settingService.getSetting('settings');
    this.content = settings.info_privacy;
    
  

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivacyPage');
  }

}
