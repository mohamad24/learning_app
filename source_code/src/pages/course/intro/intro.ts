import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { CourseProvider } from '../../../providers/course/course';
import { SettingsProvider } from '../../../providers/settings/settings';
import { ApiProvider } from '../../../providers/api/api';
import { UtilsProvider } from '../../../providers/utils/utils'; 


import { ModalController } from 'ionic-angular';


/**
 * Generated class for the IntroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

 
  public course;
  public option = 'intro';
  public basePath;
  public showLoading:boolean;
  public introData;
  public namespace = 'intros';

  constructor(public modalCtrl: ModalController,public utils:UtilsProvider,public api:ApiProvider,public loadingController:LoadingController,public settingService:SettingsProvider,public navCtrl: NavController, public navParams: NavParams,public courseProvider:CourseProvider) {
  }

 async ionViewDidLoad() {
    this.basePath = await this.settingService.getSetting('base_path');
    console.log('ionViewDidLoad IntroPage');
    this.course = this.courseProvider.getCourse();
    
   
     

    this.introData = await this.utils.getStored(this.course.details.session_id,this.namespace);   

    if(!this.introData){
      this.showLoading = true;
    }

    this.api.getIntro(this.course.details.session_id).subscribe(resp=>{
        this.introData= resp;
        this.utils.store(this.course.details.session_id,this.namespace,resp);
        this.showLoading = false;
    },err=>{
        this.showLoading = false;
        
        if(!this.introData){
          this.utils.networkError();
          this.navCtrl.pop();
        }
        
    });


  }
 
  download(data){
    console.log(data);
    //open modal
    const modal = this.modalCtrl.create('DownloadfilesPage',data);
    modal.present();
  }

  openClass(id){
    this.navCtrl.push('ClassPage',{
      id:id
    });
  }

  start(){
    if(this.introData.classes.length>0){
        let classInfo = this.introData.classes[0];
        this.openClass(classInfo.lesson_id);
    }
    else{
        this.utils.presentAlert('No Content','The course does not have any content yet');
    }
  }

  toInt(number:string){
    return parseInt(number);
  }

  backButtonAction(){
    this.navCtrl.pop();
  }

  openLecture(id){
    this.navCtrl.push('LecturePage',{id:id});
  }

}
