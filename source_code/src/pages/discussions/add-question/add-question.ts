import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { UtilsProvider } from '../../../providers/utils/utils';
/**
 * Generated class for the AddQuestionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-question',
  templateUrl: 'add-question.html',
})
export class AddQuestionPage {

  public loading;
  public options;
  public discussion={
    'subject':'',
    'question':'',
    'accounts':'',
    'session_id':''
  };
  constructor(public viewController:ViewController,public navCtrl: NavController, public navParams: NavParams,public api:ApiProvider,public utils:UtilsProvider,public loadingController:LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddQuestionPage');
    //get options
    this.utils.presentLoading();
    this.api.getDiscussionOptions().subscribe(resp=>{
      this.utils.dismissLoading();
      this.options= resp;

    },err=>{
      this.utils.dismissLoading();
      this.utils.networkError();
      this.navCtrl.pop();

    });


  }


  save(){
    console.log(this.discussion);
      this.presentLoading();
      this.api.createDiscussion(this.discussion).subscribe(resp=>{
          this.loading.dismiss();
          if(resp['status']){
            this.utils.presentToast('Discussion created successfully');
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
