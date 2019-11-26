import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Content, Slides } from 'ionic-angular';
import { UtilsProvider } from '../../../providers/utils/utils';
import { ApiProvider } from '../../../providers/api/api';
import { SettingsProvider } from '../../../providers/settings/settings';

/**
 * Generated class for the TestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {

  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides; 

  public basePath;
  public namespace = 'test';
  public showLoading:boolean; 
  public showProgress= false;
  public progress:any=0;
  public loading;
  public id;
  public test;
  public studentTestId;
  public questions;
  public totalQuestions;
  public interval;
  public countdown;
  public answers={};
  public result;
  public start = false;
  public time=0;
  public config={leftTime:10,demand:true};
  public userCanLeave= true;
  public classId;
  public lectureId;
  public sessionId;
 
  

  constructor(public navCtrl: NavController, public navParams: NavParams,public utils:UtilsProvider,public api:ApiProvider,public settingService:SettingsProvider,public loadingController:LoadingController,public alertController:AlertController) {
  }

  async ionViewDidLoad() {

    console.log('ionViewDidLoad TestPage');
    this.id = this.navParams.get('id');
    this.classId = this.navParams.get('lesson_id');
    this.sessionId = this.navParams.get('session_id');
    this.lectureId = this.navParams.get('lecture_id');
    this.test = await this.utils.getStored(this.id,this.namespace);
    
    if(!this.test){
      this.showLoading=true;
    }
    
    //get the test record
    this.api.getTest(this.id).subscribe(resp=>{
        this.test= resp; 
        this.utils.store(this.id,this.namespace,this.test);
        this.showLoading=false;
    },err=>{
        this.showLoading=false;
        this.utils.networkError();
        this.navCtrl.pop();
    });


  }



  startTest(){
    this.presentLoading();
    this.api.addStudentTest(this.id).subscribe(resp=>{
      this.loading.dismiss();
      if(resp['status']){
        this.start = true;
        this.userCanLeave = false;
        this.studentTestId = resp['id'];
        this.questions = resp['questions'];
        this.totalQuestions = resp['total_questions'];
        this.initTimer();
      }
      else{
        this.utils.presentToast(resp['msg']);
      }
      

    },err=>{
        this.loading.dismiss();
        this.utils.networkError();      
      });

  }
  
  initTimer(){
    
    if(this.test.minutes > 0){ 
   
       
      this.time = this.test.minutes * 60; 

      this.startTimer(this.time);
    }
    

  }

  onFinished(){
    this.utils.presentToast('Time is up!');
    this.submitTest(); 
  }

  presentLoading() {
    this.loading = this.loadingController.create({
      content: 'Loading. Please wait...',
      duration: 2000000000
    });
     this.loading.present();
  }
 
 

 startTimer(duration) {
    let start = Date.now();
    let   diff;
     let minutes;
     let  seconds;
   
    this.interval = setInterval(() => {
          // get the number of seconds that have elapsed since
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        this.countdown = minutes + ":" + seconds;

        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
           // start = Date.now() + 1000;
            console.log('time is up!');
            
            this.utils.presentToast('Time is up!');


            this.submitTest();
            // $('#testform').submit();
            clearInterval(this.interval);
        }
    },1000)
 
}

 submitTest(pop=true){
  
  console.log(this.answers);

  this.presentLoading();
   this.userCanLeave = true;
   clearInterval(this.interval);
   this.countdown='';
   

  this.api.updateStudentTest(this.studentTestId,this.answers).subscribe(resp=>{
      this.loading.dismiss();
       
        this.result = resp;
     

  },err=>{
    this.loading.dismiss();
    let alert = this.alertController.create({
      title: 'Network Error',
      message: 'There has been an error submitting your test. Please check your internet connection and try again. Please note that if you cancel, you will not be able to submit this attempt anymore!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.utils.presentToast('Test cancelled!');
             if(pop){
              this.navCtrl.pop();
             }
              
            
            
          }
        },
        {
          text: 'Submit Again',
          handler: () => {
            this.submitTest();
          }
        }
      ]
    });
    alert.present();


  });


 }


 next(){
    
  this.slides.slideNext();
  
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
  
  try{
    this.content.scrollToTop();
}
catch(err){

}

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


 ionViewCanLeave() {
  // here you can use other vars to see if there are reasons we want to keep user in this page:
    if (!this.userCanLeave && this.start) {
        return new Promise((resolve, reject) => {
          let alert = this.alertController.create({
            title: 'Are you sure?',
            message: 'You are about to cancel this test attempt. Are you sure?',
            buttons: [
              {
                text: 'Stay',
                role: 'cancel',
                handler: () => {
                  console.log('User stayed');
                  this.userCanLeave = false;
                  reject();
                }
              },
              {
                text: 'Leave',
                handler: () => {
                  console.log('User leaves');
                  this.userCanLeave = true;
                  resolve();
                }
              },
              {
                text: 'Submit Test',
                handler: () => {
                  console.log('User saved data');
                  // do saving logic
                  this.submitTest(false);
                  this.userCanLeave = true;
                  resolve();
                }
              }
            ]
          });
          alert.present();
        });
      } else { return true }
    }

 

    continueCourse(){
      this.presentLoading();
      this.api.logLecture(this.lectureId,this.sessionId).subscribe(resp=>{
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
                      'lesson_id':resp['lesson_id'],
                      'session_id':resp['session_id'], 
              }).then(()=>{
                this.utils.presentToast(resp['message']);
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

}
