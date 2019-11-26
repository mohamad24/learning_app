import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, App, LoadingController} from 'ionic-angular';
import { CartProvider } from '../../providers/cart/cart';
import { UtilsProvider } from '../../providers/utils/utils';
import { SettingsProvider } from '../../providers/settings/settings';
import { ApiProvider } from '../../providers/api/api';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { CourseProvider } from '../../providers/course/course';

/**
 * Generated class for the CoursesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-courses',
  templateUrl: 'courses.html',
})
export class CoursesPage {

  public courses=[];
  public cartCourses=[];
  public settings;
  public basePath;
  public currency;
  public exchangeRate;
  public authenticated= false;
  public showLoading:boolean = false;
  public loading;
  public namespace = 'my_courses';
  constructor(public courseProvider:CourseProvider,public loadingController:LoadingController,public app:App,public events:Events, private alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams,private apiService:ApiProvider,private settingsService:SettingsProvider,private utilsService:UtilsProvider,private cartService:CartProvider,private auth:AuthenticationProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CoursesPage');
    this.events.subscribe("tabs-page:badge-update", ()=>{
      this.getCourses();
      this.reloadCart();
    });

  }


  async ngOnInit() {
    this.basePath = await this.settingsService.getSetting('base_path');
    if(this.cartService.hasItems()){
      console.log('has items');
      console.log(this.cartService.sessions);
      this.cartCourses = this.cartService.sessions;
    }
    else{
      this.cartCourses=[];
      console.log('No items');
    }



   }

   public async ionViewWillEnter(){
      if(this.cartService.hasItems()){
        this.reloadCart();
      }
      this.currency = await this.settingsService.getCurrency();
      console.log('showing currency of courses page');
      console.log(this.currency);

      this.settingsService.getSettings().then(val => { 
        console.log(val);
        this.settings = val;
       
      });

      if(this.auth.isAuthenticated()){
        this.authenticated = true;
        this.getCourses();
      }
      else{
        this.authenticated = false;
        this.courses = [];
      }

      
    }


  
   reloadCart(){
     if(this.cartService.hasItems()){
      this.cartCourses = this.cartService.getSessions();
     }
     else{
      this.cartCourses =[];
     }
    
  }

  removeFromCart(session){
     let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Do you want to remove this item from your cart?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Remove',
          handler: () => {
            this.cartService.removeSession(session);
            this.reloadCart();
            if(this.cartCourses.length==0){
              this.cartCourses=[];
            }
            this.events.publish("tabs-page:badge-update");
          }
        }
      ]
    });
    alert.present();

  }

 async getCourses(){

    this.courses = await this.utilsService.getStored(1,this.namespace);

    if(!this.courses){
      this.showLoading=true;
    }
    
    this.apiService.getStudentCourses().subscribe(resp=>{
    this.showLoading=false;
    console.log(resp);
      this.courses = resp['sessions'];
      this.utilsService.store(1,this.namespace,this.courses);
    },err=>{
      this.showLoading=false;
      this.utilsService.networkError();
    });

  }

  goToLogin(){ 
    this.events.publish("tabs-page:login"); 
  }

  goToCourse(id){ 
    let nav = this.app.getRootNav();
    nav.push('CoursePage',{id:id});
    
  }

  startResume(course){
    let nav = this.app.getRootNav();
    this.courseProvider.setCourse(course); 
     //get resume 
     console.log(course); 
  
     let resumeData = course['resume'];
     let page = 'IntroPage';
  
  
     let items = [];
     //items.push({ page: 'CoursemenuPage', params: { page: 'IntroPage' } });
     
     if(resumeData.type=='class'){
      items.push({ page: 'ClassPage', params: { id: resumeData.class_id } });
  
      nav.push('CoursemenuPage',{open:true,pages:items});
        // page = 'ClassPage';
     }
     else if(resumeData.type=='lecture'){
        page = 'LecturePage';
        items.push({ page: 'ClassPage', params: { id: resumeData.class_id } });
        items.push({ page: 'LecturePage', params: { id: resumeData.lecture_id,class_id:resumeData.class_id } });
        nav.push('CoursemenuPage',{open:true,pages:items});
      }
     else{
       nav.push('CoursemenuPage');
     }
   
  }


  async resume(course){

    let dbCourse = await this.utilsService.getStored(course.session_id,'sessions');
    if(dbCourse){
     
      this.startResume(dbCourse);
    }
    else{
      this.utilsService.presentLoading();
      this.apiService.getSession(course.session_id).subscribe(resp=>{
        this.utilsService.dismissLoading();
        this.utilsService.store(course.session_id,'sessions',resp);
          this.startResume(resp);
          
      },err=>{
        this.utilsService.dismissLoading();
        this.utilsService.networkError();
        
        return false;
      });
    }
    //set current course 
   
     //this.navCtrl.setPages(items);
     
  
  }
  
 async order(){
    if(this.auth.isAuthenticated()){
      if(this.cartService.paymentRequired()){
        let nav = this.app.getRootNav();
        nav.push('CheckoutPage');
      }
      else{
        let sessions = this.cartService.getSessions();
   
    
        let sessionArray=[];
    
        for(let session of sessions){
          sessionArray.push(session['session_id']);
        }
    
        
        this.presentLoading();
        let currencyId = await this.settingsService.getSetting('student_currency');
        this.apiService.storeInvoice(sessionArray,0,currencyId).subscribe(resp=>{
            let status = resp['status'];
             this.loading.dismiss();
            if(status){
                if(resp['payment_required']){ 
                     //navigate to payment page 
                     let nav = this.app.getRootNav();
                     nav.push('CheckoutPage');
    
                }
                else{
                  this.utilsService.presentToast('Your enrollment is complete!');
                  this.cartService.clearCart();
                  this.navCtrl.popToRoot();
                  this.events.publish('tabs-page:badge-update');
                }
    
    
            }
            else{
              this.utilsService.presentAlert('Checkout Error',resp['message']);
            }
    
        },err=>{
          this.utilsService.networkError();
          this.loading.dismiss();
        });
      }
      

    }
    else{
      this.goToLogin();
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
