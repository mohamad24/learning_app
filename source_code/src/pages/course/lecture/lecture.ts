import { Component, ViewChild, ElementRef } from '@angular/core';
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
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Slides } from 'ionic-angular';
import { ScrollHideConfig } from '../../../directives/scroll-hide/scroll-hide';
//import * as $ from 'jquery';
declare var jQuery: any;
import videojs from 'video.js';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';

/**
 * Generated class for the ClassPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lecture',
  templateUrl: 'lecture.html',
})
export class LecturePage {

  footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
  headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 100 };

  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  //@ViewChild('slickQuiz') slickQuiz: ElementRef;

  public course; 
  public basePath;
  public option = 'lecture';
  public showLoading:boolean; 
  public namespace = 'lecture';
  public lectureData;
  public lectureId;
  public showProgress= false;
  public progress:any=0;
  public filesPath ;
  public loading;
  public token;
  public quality= 360;

  constructor(private streamingMedia: StreamingMedia,private domSanitizer: DomSanitizer,private filePath: FilePath,public alertCtrl: AlertController,private fileOpener: FileOpener,private androidPermissions: AndroidPermissions,public auth:AuthenticationProvider,private transfer: FileTransfer, private file: File,public navCtrl: NavController, public navParams: NavParams,public courseProvider:CourseProvider,public utils:UtilsProvider,public api:ApiProvider,public loadingController:LoadingController,public settingService:SettingsProvider) {
  }

  async ionViewDidLoad() {
    this.lectureId= this.navParams.get('id');
    this.basePath = await this.settingService.getSetting('base_path');
    this.course = this.courseProvider.getCourse();
    this.token = this.auth.getToken();
    this.lectureData = await this.utils.getStored(this.lectureId,this.namespace); 

    let sessionID= this.course.details.session_id;
    if(!this.lectureData){
      this.showLoading=true;
    }
    else{
      this.loadQuizes();
    }

    this.api.getLecture(this.lectureId,sessionID).subscribe(resp=>{
      this.showLoading=false;

        if(resp['status']==false && resp['next']){
              this.utils.presentToast(resp['error']);
              this.navCtrl.pop().then(()=>{
                  this.navCtrl.push('LecturePage',{id:resp['next']});
              });
        }


        this.lectureData = resp;
        this.utils.store(this.lectureId,this.namespace,this.lectureData);
        this.loadQuizes();
    },err=>{
      this.showLoading=false;
      if(!this.lectureData){
        this.utils.networkError();
        this.navCtrl.pop();
      }
    });

 
  }

  async ionViewWillEnter(){

    //store video qaulity
    let storedQuality = await this.utils.getStored(1,'video_quality');
    if(storedQuality){
      console.log('stored is : '+storedQuality);
      this.quality=storedQuality;
    }
    else{
      console.log('no stored quality: '+storedQuality);
    }

  }

  qualityChanged(quality){ 
    this.quality = quality;
    this.utils.store(1,'video_quality',quality);     
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

  loadQuizes(){

    try{
        for(let page of this.lectureData.pages){
          if(page.type=='q'){ 
          // console.log(page.content);
            jQuery('#quiz-'+page.lecture_page_id).slickQuiz(page.content);
        
          }
        }
    }
    catch{

    }
          
 
    
  }

  openLecture(id){
    this.navCtrl.push('LecturePage',{id:id});
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

  safeUrl(url){
    let trustedVideoUrl: SafeResourceUrl;

    trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    return trustedVideoUrl;
  }

  next(){
    
    this.slides.slideNext();
    this.loadQuizes();
    try{
      this.content.scrollToTop();
  }
  catch(err){
      try{
        this.content.scrollToTop();
    }
    catch(err){

    }
  }
    
  }

  prev(){
     
    this.slides.slidePrev();
    this.loadQuizes();
    try{
      this.content.scrollToTop();
  }
  catch(err){

  }
  }
  slideChanged() {
    this.loadQuizes();
  }

  isEnd(){
    if(this.slides){
    return this.slides.isEnd();
    }
  }

  isBeginning(){
    if(this.slides){
      return this.slides.isBeginning();
    }
    
  }

  save(){
    this.presentLoading();
    this.api.logLecture(this.lectureId,this.course.details.session_id).subscribe(resp=>{
      this.loading.dismiss(); 
      if(resp['status']){
        let type = resp['redirect_type'];
        if(type=='lecture')
          {
              let id = resp['lecture_id'];
              this.navCtrl.push('LecturePage',{id:id});
          }
          else if(type=='test'){
            let id  = resp['test_id'];
            this.navCtrl.push('TestPage',{
                    'id':id,
                    'lecture_id':this.lectureId,
                    'lesson_id':resp['lesson_id'],
                    'session_id':resp['session_id'], 
            }).then(()=>{
              this.utils.presentAlert('Required Test',resp['message']);
            });
          }
          else if (type=='class'){
            this.navCtrl.push('ClassPage',{
              'id':resp['class_id']
            });
          }
          else if (type =='course'){
                  this.navCtrl.setRoot('IntroPage').then(()=>{
                          this.utils.presentToast(resp['message']);
                  });
          }
      }
      else{
        this.utils.presentToast(resp['msg']);
      }
      

    },err=>{
      this.loading.dismiss(); 
      this.utils.networkError();
    });
      
  }


  presentLoading() {
    this.loading = this.loadingController.create({
      content: 'Loading. Please wait...',
      duration: 2000000000
    });
     this.loading.present();
  }

  initVideo(){
   
      try {
        // setup the player via the unique element ID
        var element = document.getElementById('videoPlayer');
        if (element == null) {
            throw "no video element found";
        }
        // if we get here, all good!
       // videojs(element, {}, () => { });
    }
    catch (e) {
      console.log(e);
    }
    
  }

  playVideo(id){
    let url = this.basePath+'/api/v1/videos/'+id+'/index.m3u8?api_token='+this.token+'&quality='+this.quality;
   // url = 'http://192.168.0.100/videos/index.m3u8';
    console.log(url);
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming')
      console.log(e);
      this.utils.presentToast('Video could not be played. Please check your internet connection');
    }, 
      shouldAutoClose: true,
      controls: true
    };

    this.streamingMedia.playVideo(url, options);
  }
}
