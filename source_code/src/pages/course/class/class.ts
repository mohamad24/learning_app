import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Content } from 'ionic-angular';
import { CourseProvider } from '../../../providers/course/course';
import { UtilsProvider } from '../../../providers/utils/utils';
import { ApiProvider } from '../../../providers/api/api';
import { SettingsProvider } from '../../../providers/settings/settings';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File, FileEntry } from '@ionic-native/file';
import { AuthenticationProvider } from '../../../providers/authentication/authentication';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { FileOpener } from '@ionic-native/file-opener';
import { AlertController } from 'ionic-angular';
import { FilePath } from '@ionic-native/file-path';

/**
 * Generated class for the ClassPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-class',
  templateUrl: 'class.html',
})
export class ClassPage {

  @ViewChild(Content) content: Content;
  public course; 
  public basePath;
  public option = 'intro';
  public showLoading:boolean; 
  public namespace = 'class';
  public classData;
  public classId;
  public showProgress= false;
  public progress:any=0;
  public filesPath ;

  constructor(private filePath: FilePath,public alertCtrl: AlertController,private fileOpener: FileOpener,private androidPermissions: AndroidPermissions,public auth:AuthenticationProvider,private transfer: FileTransfer, private file: File,public navCtrl: NavController, public navParams: NavParams,public courseProvider:CourseProvider,public utils:UtilsProvider,public api:ApiProvider,public loadingController:LoadingController,public settingService:SettingsProvider) {
  }

  async ionViewDidLoad() {
    this.classId= this.navParams.get('id');
    this.basePath = await this.settingService.getSetting('base_path');
    this.course = this.courseProvider.getCourse();
    this.classData = await this.utils.getStored(this.classId,this.namespace); 

    let sessionID= this.course.details.session_id;
    if(!this.classData){
      this.showLoading=true;
    }

    this.api.getClass(this.classId,sessionID).subscribe(resp=>{
      this.showLoading=false;
        if(resp['status']==false){
            console.log('false response');
            this.utils.presentToast(resp['error']);
            let path = resp['path'];
            let id = resp['param'];
            switch(path){
              case 'submit-assignment':
                this.navCtrl.push('HomeworkPage',{id:id});
                console.log(path);
                break;
              case 'course-intro':
              console.log(path);
                this.navCtrl.pop();
                break;
              case 'class':
              console.log(path);
                this.navCtrl.pop().then(()=>{
                    this.navCtrl.push('ClassPage',{id:id});
                });
                break;
                default:
                console.log(path);
                  this.navCtrl.pop();
                break;

            }

        }
        else{
          this.classData = resp;
          this.utils.store(this.classId,this.namespace,this.classData);
        }
        
    },err=>{
      this.showLoading=false;
      if(!this.classData){
        this.utils.networkError();
        this.navCtrl.pop();
      }
    });

  }

  downloadFile(id,filename){

    if(this.utils.isAndroid()){
      this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      .then(status => {
        if (status.hasPermission) {
          this.startDownload(id,filename);
        } else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
          .then(status =>{
            if(status.hasPermission) this.startDownload(id,filename);
          });
        }
      });

    }
    else{
      this.startDownload(id,filename);
    }





  }


  startDownload(id,filename){

    console.log(filename);
    let sessionID= this.course.details.session_id;
      let path = this.api.getClassFilePath(id,sessionID);
      let token = this.auth.getToken();
      console.log('TOken is: '+token);
      console.log('Path is: '+path);
     // let filename = path.substring(path.lastIndexOf('/')+1);
      this.content.scrollToTop();
      this.showProgress=true;
      this.utils.presentToast('Download has started');


      const fileTransfer: FileTransferObject = this.transfer.create();

      let options = {
        headers : {
             'Authorization': token
        }
      };

      fileTransfer.download(path, this.file.externalRootDirectory+'/Download/'+filename,true,options).then((entry) => {
        this.showProgress=false;
        this.progress=0;

        const confirm = this.alertCtrl.create({
          title: 'Download Complete',
          message: 'File was saved in your Downloads folder. Would you like to view the file now?',
          buttons: [
            {
              text: 'No',
              handler: () => {
                console.log('No Clicked');
              }
            },
            {
              text: 'Yes',
              handler: () => {

                let path=entry.toURL();
                this.filePath.resolveNativePath(path)
                .then(filePath => {
                  this.filesPath = filePath;
                  this.file.resolveLocalFilesystemUrl(filePath).then(fileInfo =>
                    {
                      let files = fileInfo as FileEntry;
                      files.file(success =>
                        {
                          let fileType   = success.type;
                          let filesName  = success.name;


                          this.fileOpener.open(filePath,fileType)
                          .then(() => console.log('File is opened'))
                          .catch(e => console.log('Error opening file', e));
                                                  });
                    },err =>
                    {
                      console.log(err);
                      throw err;
                    }); 

                })
                .catch(err => console.log(err));
              }
            }
          ]
        });
        confirm.present();

       // this.utils.presentToast('Download Complete. Open your \'Download\' folder to view it');



        console.log('download complete: ' + entry.toURL());
      }, (error) => {
        // handle error
        console.log(error);
        this.showProgress=false;
        this.progress=0;
        this.utils.presentToast('An error has occured');
      });

      fileTransfer.onProgress(progressEvent=>{
        
        let perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
        this.progress = perc;
      });


  }

 

  close(){
    this.navCtrl.pop();
  }

  getFileName(path){
    return path.substring(path.lastIndexOf('/')+1);
  }

  openLecture(id){
    this.navCtrl.push('LecturePage',{id:id});
  }

  start(){

      if(this.classData.lectures.length>0){
        let lectureInfo = this.classData.lectures[0];
        this.openLecture(lectureInfo.lecture_id);
    }
    else{
        this.utils.presentAlert('No Content','The class does not have any content yet');
    }

  }

}
