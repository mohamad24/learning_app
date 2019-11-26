import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, InfiniteScroll, Content, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { UtilsProvider } from '../../providers/utils/utils';
import { SettingsProvider } from '../../providers/settings/settings';
import { Network } from '@ionic-native/network';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File, FileEntry } from '@ionic-native/file';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { FileOpener } from '@ionic-native/file-opener'; 
import { FilePath } from '@ionic-native/file-path';

/**
 * Generated class for the CertificatesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-certificates',
  templateUrl: 'certificates.html',
})
export class CertificatesPage {

  @ViewChild(InfiniteScroll) infiniteScroll:InfiniteScroll;
  @ViewChild(Content) content: Content;

  public posts;
  public error:boolean = false; 
  public basePath;
  public currentPage=1; 
  public showLoading:boolean = false;
  public networkPresent= true;
  public showRetry=false;
  public isOn: boolean = false;
   
  public name; 
  public showProgress= false;
  public download;
  public filesPath ;
  public progress:any=0;

  public loading;


  constructor(private filePath: FilePath,private fileOpener: FileOpener,private androidPermissions: AndroidPermissions,public auth:AuthenticationProvider,private transfer: FileTransfer, private file: File,public alertCtrl:AlertController,public loadingControler:LoadingController,public utils:UtilsProvider,public modalCtrl:ModalController,public navCtrl: NavController, public navParams: NavParams,public apiService:ApiProvider,public toastController: ToastController,public settingService:SettingsProvider,public network:Network, public navCtr:NavController) {
  }


  async ngOnInit() {

    this.basePath = await this.settingService.getSetting('base_path');
    
 

    this.networkCheck();   
    
    //get courses
    this.showLoading= true;
    this.loadPosts(1).subscribe(response=>{
      this.posts= response['records'];
      console.log(response);
      this.currentPage = 1;
      this.showLoading = false;
    }, err => {
      this.showRetry = true;
      this.showLoading= false;
    this.presentToast('Network error! Please check your Internet connection');
    console.log(err.message);
  });

  }

  downloadFile(certificate){

    if(this.utils.isAndroid()){
              this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
        .then(status => {
          if (status.hasPermission) {
            this.startDownload(certificate);
          } else {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
            .then(status =>{
              if(status.hasPermission) this.startDownload(certificate);
            });
          }
        });
    }
    else{
      this.startDownload(certificate);
    }



  }

  startDownload(certificate){
    let id = certificate.certificate_id
    let filename = certificate.certificate_name+'.pdf';
    console.log(filename);
      let path = this.apiService.getCertificateFilePath(id);
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


loadPosts(page){
    this.showRetry= false;
     return this.apiService.getCertificates(page);
}

loadData(event){
      
      this.currentPage++;
      console.log('scroll starting: '+this.currentPage); 
      this.loadPosts(this.currentPage).subscribe(response=>{
        //console.log(response['records']);
        this.posts= this.posts.concat(response['records']);
        console.log(this.posts);

        event.complete();

        //determine if this was the last page    
        let totalPages = Math.ceil((response['total']/response['rows_per_page']));
        console.log(totalPages);
        if(this.currentPage >= totalPages){
         // event.disabled =true;
         this.currentPage--;
        }  
      }, err => {
        event.complete();

      this.presentToast('Network error! Please check your Internet Connection and try again');
      console.log(err.message);
    })

}

 


presentLoading() {
  this.loading = this.loadingControler.create({
    content: 'Loading. Please wait...',
    duration: 2000000000
  });
   this.loading.present();
}


reloadPosts(page){
      this.content.scrollToTop();
      this.showLoading=true;
      this.loadPosts(page).subscribe(resp=>{
          this.posts = resp['records'];
          this.showLoading=false;
      }, err => {
        this.showRetry = true;
        this.showLoading= false;
      this.presentToast('Network error! Please check your Internet connection');
      console.log(err.message);
    });

}

async presentToast(message:string) {
      const toast = await this.toastController.create({
        message: message,
        duration: 3000
      });
      toast.present();
}

networkCheck(){
    // watch network for a disconnection
let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
  console.log('network was disconnected :-(');
  this.networkPresent= false;
});

// stop disconnect watch
disconnectSubscription.unsubscribe();


// watch network for a connection
let connectSubscription = this.network.onConnect().subscribe(() => {
  console.log('network connected!');
  // We just got a connection but we need to wait briefly
   // before we determine the connection type. Might need to wait.
  // prior to doing any api requests as well.
  setTimeout(() => {
    if (this.network.type === 'wifi') {
      console.log('we got a wifi connection, woohoo!');
      this.networkPresent= true;
    }
  }, 3000);
});


}

 

}
