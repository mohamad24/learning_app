import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import {Autosize} from 'ionic2-autosize'; 
import { ApiProvider } from '../../../providers/api/api';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File, FileEntry } from '@ionic-native/file';
import { UtilsProvider } from '../../../providers/utils/utils';
import { AuthenticationProvider } from '../../../providers/authentication/authentication';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { FileChooser } from '@ionic-native/file-chooser';
import { AndroidPermissions } from '@ionic-native/android-permissions';

/**
 * Generated class for the HomeworkEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-homework-edit',
  templateUrl: 'homework-edit.html',
})
export class HomeworkEditPage {


  public option="answer";
  public post;
  public answer ={
    'content':'',
    'student_comment':'', 
    'submitted':1,
    'assignment_submission_id':''
  };
  public loading;
  public file;
  constructor( private androidPermissions: AndroidPermissions,private fileChooser: FileChooser, private filePicker: IOSFilePicker,public auth:AuthenticationProvider,public utils:UtilsProvider,private transfer: FileTransfer,public loadingController:LoadingController,public api:ApiProvider,public navCtrl: NavController, public navParams: NavParams,public view:ViewController) {
  }

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad HomeworkSubmissionPage');
    this.post = this.navParams.get('post');
    this.answer['assignment_id'] = this.post.assignment_id;
    this.answer['content'] = this.post.submission.content;
    this.answer['student_comment'] = this.post.submission.student_comment;
    this.answer['submitted']  = this.post.submission.submitted;
    this.answer['assignment_submission_id']= this.post.submission.assignment_submission_id;
  }

  changeListener($event) : void {
    this.file = $event.target.files[0];
  }

  selectFile(){

    if(this.utils.isIOS()){
      
         this.filePicker.pickFile().then(uri => {
        this.file = uri;
      })
      .catch(err => {
        console.log(err);
        this.utils.presentToast('An error has occured');
      });

    }
    else if(this.utils.isAndroid()){
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(status => {
           
        // this.androidFileChooser();
        this.androidFileChooser();
      
    },err=>{
      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      .then(status => {
        if (status.hasPermission) this.androidFileChooser();
      });
    });
    }

  }

  androidFileChooser() {
    this.fileChooser.open().then(uri => {
      this.file = uri;
    })
      .catch(e => {
        console.log(e);
        this.utils.presentToast('An error has occured');
      });

  }

  close(){
    this.view.dismiss(true);
  }

  submit(){
this.presentLoading();
    if(this.file){

      let uploadOptions = {
        fileKey: "file_path", // change fileKey
        httpMethod: 'PUT',
        chunkedMode: false, // add chunkedMode  
      //  mimeType: "multipart/form-data", // add mimeType
        fileName: this.file,
        params : this.answer,      
      //  headers: {'Authorization':this.auth.getToken(), 'Content-Type': 'application/x-www-form-urlencoded'}
        headers: {'Authorization':this.auth.getToken()}
  
      };

      const fileTransfer: FileTransferObject = this.transfer.create();

      fileTransfer.upload(this.file,this.api.getAssignmentSubmissionPath(),uploadOptions).then((resp)=>{
        console.log(resp['response']);
        this.loading.dismiss(); 
        let jsonResponse = JSON.parse(resp['response']);
        this.postAssignmentSubmit(jsonResponse);
      }, (error) => {
        // handle error
        console.log(error);
        this.loading.dismiss(); 
        this.utils.presentToast('An error has occured');
      });

    }
    else{
      this.api.updateAssignmentSubmission(this.post.submission.assignment_submission_id,this.answer).subscribe(resp=>{
        this.loading.dismiss();
          this.postAssignmentSubmit(resp);
      },err=>{
        this.loading.dismiss();
        console.log(err);
          this.utils.networkError();
      });
    }

    console.log(this.answer);
    console.log(this.file);
  }

  postAssignmentSubmit(resp){
    if(resp['status']){
      this.utils.presentToast('Changes saved!');
      this.navCtrl.pop().then(()=>{
        this.navCtrl.pop();
      });
    }
    else{
      this.utils.presentToast(resp['msg']);
      if(resp['redirect']){
        //TODO: open editing modal

      }
    }
  }

  presentLoading() {
    this.loading = this.loadingController.create({
      content: 'Loading. Please wait...',
      duration: 2000000000
    });
     this.loading.present();
  }

}
