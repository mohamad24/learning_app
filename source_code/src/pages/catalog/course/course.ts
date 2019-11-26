import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,  Events, Nav, PopoverController } from 'ionic-angular';
import { UtilsProvider } from '../../../providers/utils/utils';
import { CartProvider } from '../../../providers/cart/cart';
import { Network } from '@ionic-native/network';
import { SettingsProvider } from '../../../providers/settings/settings';
import { ApiProvider } from '../../../providers/api/api';
import { CourseProvider } from '../../../providers/course/course';

/**
 * Generated class for the CoursePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-course',
  templateUrl: 'course.html',
})
export class CoursePage {


  public showLoading:boolean = false;
  public networkPresent= true;
  public showRetry=false;
  public settings;
  public course;
  public id=null;
  public basePath;
  public namespace = 'sessions';
  public option="details"; 
  public currency;
  public exchangeRate;
  @ViewChild(Nav) nav:Nav;

  constructor(private courseProvider:CourseProvider,public events:Events, public navCtrl: NavController, public navParams: NavParams,public apiService:ApiProvider,public settingService:SettingsProvider,public toastController:ToastController,public network:Network,public navController:NavController,public utils:UtilsProvider,public cartService:CartProvider,public utilsService:UtilsProvider,public popoverCtrl: PopoverController) {
  }


  async ngOnInit() {
    this.basePath = await this.settingService.getSetting('base_path');
    this.id = this.navParams.get('id');  
    this.course = await this.utils.getStored(this.id,this.namespace);    
    this.loadData();
    this.currency = await this.settingService.getCurrency(); 
    console.log('showing currency');
    console.log(this.currency);

    this.settingService.getSettings().then(val => { 
      this.settings = val;
      //  let currency =  val.student_currency;
      // //get exchange rate for currency
      // let currencyList = val.currencies;
      // let currencyObj:any;
      // for(let i=0; i<currencyList.length;i++){
      //     let obj = currencyList[i];
      //     if(obj.currency_id==currency){
      //       currencyObj = obj;
      //     }
      // }
      
      // this.currency = currencyObj;
    });
    
  }


  
  public loadData(){
    if(!this.course){
      this.showLoading = true;
    }
    
    this.apiService.getSession(this.id).subscribe(resp=>{
        this.utils.store(this.id,this.namespace,resp);
        this.showLoading = false;
        this.course = resp;
        console.log('fresh data');
        console.log(resp);
    },err=>{
      this.utils.presentToast('Network error! Please check your Internet Connection and try again');
      this.showLoading = false;
      if(!this.course){
      this.showRetry = true; 
      this.navCtrl.pop();
      }
      
      
      //this.navController.navigateBack('/blog');
    });
}

retry(){
  this.loadData();
}


async presentToast(message:string) {
  const toast = await this.toastController.create({
    message: message,
    duration: 3000
  });
  toast.present();
}

public addToCart(){
  this.cartService.addSession(this.course);
  this.utilsService.presentToast('Added to cart!');
  this.events.publish("tabs-page:badge-update");
  this.navCtrl.popToRoot();
  console.log('Added to cart');
 // this.navController.navigateForward('/app/tabs/(courses:courses)');

}

public resume(){

  //set current course 
   this.courseProvider.setCourse(this.course);
   //get resume 
   console.log(this.course); 

   let resumeData = this.course['resumeData'];
   let page = 'IntroPage';


   let items = [];
   //items.push({ page: 'CoursemenuPage', params: { page: 'IntroPage' } });
   
   if(resumeData.type=='class'){
    items.push({ page: 'ClassPage', params: { id: resumeData.class_id } });

    this.navCtrl.push('CoursemenuPage',{open:true,pages:items});
      // page = 'ClassPage';
   }
   else if(resumeData.type=='lecture'){
      page = 'LecturePage';
      items.push({ page: 'ClassPage', params: { id: resumeData.class_id } });
      items.push({ page: 'LecturePage', params: { id: resumeData.lecture_id,class_id:resumeData.class_id } });
      this.navCtrl.push('CoursemenuPage',{open:true,pages:items});
    }
   else{
     this.navCtrl.push('CoursemenuPage');
   }
 
   //this.navCtrl.setPages(items);
   

}

presentPopover(myEvent) {
  let popover = this.popoverCtrl.create('CourseOptionsPage',{
    course:this.course
  });
  popover.present({
    ev: myEvent
  });
}

ionViewDidLoad() {
    console.log('ionViewDidLoad CoursePage');
}

  
}
