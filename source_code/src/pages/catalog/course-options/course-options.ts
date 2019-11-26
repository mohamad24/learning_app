import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ViewController } from 'ionic-angular';
import { SettingsProvider } from '../../../providers/settings/settings';
import { SocialSharing } from '@ionic-native/social-sharing';
import { UtilsProvider } from '../../../providers/utils/utils';

/**
 * Generated class for the CourseOptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-course-options',
  templateUrl: 'course-options.html',
})
export class CourseOptionsPage {

  public basePath;
  public course;
  constructor(public view:ViewController,public utils:UtilsProvider,private socialSharing: SocialSharing,public settingService:SettingsProvider,public navCtrl: NavController, public navParams: NavParams,public popoverCtrl: PopoverController) {
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad CourseOptionsPage');
    this.basePath = await this.settingService.getSetting('base_path');
    this.course = this.navParams.get('course');
  }

  share(){
    this.view.dismiss();
    this.utils.presentToast('Preparing to share. Please wait...');
    let url='';
    if(this.course.details.session_type=='c'){
      url = this.basePath+'/course-details/'+this.course.session_id;
    }
    else{
      url = this.basePath+'/session-details/'+this.course.session_id;
    }

    let picture=null;
    if(this.course.details.picture){
   //   picture = this.basePath+'/'+this.course.details.picture;
    }
    this.socialSharing.share(this.course.details.short_description,this.course.details.session_name,picture,url).then(() => {
      // Success!
     // this.utils.presentToast('Share successful');
      
    }).catch(() => {
      // Error!
    });;

  }


}
