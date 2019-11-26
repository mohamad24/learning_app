import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { UtilsProvider } from '../../../providers/utils/utils';

/**
 * Generated class for the AddForumTopicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-forum-topic',
  templateUrl: 'add-forum-topic.html',
})
export class AddForumTopicPage {

 
  public loading;
  
  public topic={
    'topic_title':'',
    'message':'',
    'session_id':null,
    'lecture_id':null
  };
  constructor(public viewController:ViewController,public navCtrl: NavController, public navParams: NavParams,public api:ApiProvider,public utils:UtilsProvider,public loadingController:LoadingController) {
  }

  ionViewDidLoad() {
    
    this.topic.session_id=this.navParams.get('sessionId'); 
    this.topic.lecture_id=this.navParams.get('lectureId');
    
  }

  save(){
    console.log(this.topic);
      this.presentLoading();
      this.api.createForumTopic(this.topic).subscribe(resp=>{
          this.loading.dismiss();
          if(resp['status']){
            this.utils.presentToast('Topic created successfully');
            this.viewController.dismiss();

          }
          else{
            this.utils.presentToast(resp['msg']);
          }
      },err=>{
        this.loading.dismiss();
          this.utils.networkError();
      });
  }

  close(){
    this.viewController.dismiss();
  }

  presentLoading() {
    this.loading = this.loadingController.create({
      content: 'Loading. Please wait...',
      duration: 2000000000
    });
     this.loading.present();
  }

  



}
