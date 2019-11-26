import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { UtilsProvider } from '../../../providers/utils/utils';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File, FileEntry } from '@ionic-native/file';
import { AuthenticationProvider } from '../../../providers/authentication/authentication';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { FileOpener } from '@ionic-native/file-opener';
import { AlertController } from 'ionic-angular';
import { FilePath } from '@ionic-native/file-path';

/**
 * Generated class for the DownloadfilesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-downloadfiles',
  templateUrl: 'downloadfiles.html',
})
export class DownloadfilesPage {

  @ViewChild(Content) content: Content;
  public name;
  public showLoading = false;
  public showProgress= false;
  public download;
  public filesPath ;
  public progress:any=0;
  constructor(private filePath: FilePath,public alertCtrl: AlertController,private fileOpener: FileOpener,private androidPermissions: AndroidPermissions,public auth:AuthenticationProvider,private transfer: FileTransfer, private file: File,public utils:UtilsProvider,public navCtrl: NavController, public navParams: NavParams,public apiProvider:ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DownloadfilesPage');
    this.name = this.navParams.get('download_name');
    let id = this.navParams.get('download_id');
    //get file list
    this.showLoading=true;
    this.apiProvider.getDonwload(id).subscribe(resp=>{
        this.showLoading=false;
        this.download = resp;
        if(resp['status']==false){
          this.utils.presentToast('You do not have access to this download');
          this.navCtrl.pop();
        }
    },err=>{
      this.showLoading=false;
      this.utils.networkError();
      this.navCtrl.pop();
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
      let path = this.apiProvider.getDownlodFilePath(id);
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

}
