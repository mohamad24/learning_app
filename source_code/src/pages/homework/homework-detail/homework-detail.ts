import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { UtilsProvider } from '../../../providers/utils/utils';

/**
 * Generated class for the HomeworkDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-homework-detail',
  templateUrl: 'homework-detail.html',
})
export class HomeworkDetailPage {

  public post;
  public option="question";
  private loading;
  constructor(public utils:UtilsProvider,public loadingController:LoadingController,public navCtrl: NavController, public navParams: NavParams,public modal:ModalController,public api:ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeworkDetailPage');
    this.post = this.navParams.get('post');
    console.log(this.post);
    this.loadPost();
  }

  loadPost(){
    this.presentLoading();
    this.api.getAssignment(this.post.assignment_id).subscribe(resp=>{
      this.loading.dismiss();
          this.post = resp;             
      },err=>{
        this.loading.dismiss();
        this.utils.networkError();
        this.navCtrl.pop();
      });
  }

  submit(){
    let modal= this.modal.create('HomeworkSubmissionPage',{
      'post':this.post
    })
    modal.onDidDismiss(status => {
          
      if(status){
        this.loadPost();
      }
          

      });
    modal.present();
    // this.navCtrl.push('HomeworkSubmissionPage',{
    //   'post':this.post
    // });
  }

  presentLoading() {
    this.loading = this.loadingController.create({
      content: 'Loading. Please wait...',
      duration: 2000000000
    });
     this.loading.present();
  }

  edit(){
    this.navCtrl.push('HomeworkEditPage',{
      post:this.post
    });
  }

  delete(){
    this.presentLoading();
    this.api.deleteAssignmentSubmission(this.post.submission.assignment_submission_id).subscribe(resp=>{
       this.loading.dismiss();
       if(resp['status']){
        this.utils.presentToast('Submission removed');
        this.post = resp['assignment'];
       }
       else{
        this.utils.presentToast(resp['msg']);
       }
       
      
    },err=>{
      this.loading.dismiss();
      this.utils.networkError();
    });
  }


}
