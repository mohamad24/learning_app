import { Component } from '@angular/core';
import { NavController, ModalController, App, Platform } from 'ionic-angular';
import { SettingsProvider } from '../../providers/settings/settings';
import { ApiProvider } from '../../providers/api/api';
import { InitPage } from '../init/init';
import { BlogdetailPage } from '../info/blogdetail/blogdetail';
import { CoursePage } from '../catalog/course/course';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public settings;
  public widgetArray;
  public currency;
  public exchangeRate;
  public sliderOptions = { pager: true, autoHeight: true };
  constructor (public platform:Platform,public app:App,private apiService:ApiProvider,private settingService: SettingsProvider,private navCtr:NavController,private modalController:ModalController){
    
  }
  
  ngOnInit() {
 console.log('page loaded');
      this.loadSetup();
     
  
  }

  async ionViewWillEnter(){
    this.currency = await this.settingService.getCurrency();
    console.log('Entered browse view');
  }

  loadSetup(){
    this.widgetArray = new Array(10);
    // this.settingService.getSetting('settings').then(res=>{
    //      console.log(res.general_site_name);
    //    });



    this.settingService.getSettings().then(val => {
      // this.settingStatus = true;
       
        if(!val){
          console.log('no exception');
                // this.router.navigateByUrl('/init');
                this.presentModal();
              }
              else{
                this.loadValues(val);
                // this.settingService.storeSettings(false); 
                
              this.apiService.getSettings().subscribe(res => {
                console.log(res);
                  this.settingService.saveSettings(res);
                  if(!(JSON.stringify(res) === JSON.stringify(val) )){
                    this.loadValues(res);
                  }
                  
                
              }, err => {
                  console.log(err.message);
              });

              
              }
       
     

     


  })
  
  
  }

 async loadValues(val){
    this.settings = val;
    // let currency =  val.student_currency;
    // //get exchange rate for currency
    // let currencyList = val.currencies;
    // let currencyObj:any;
    // for(let i=0; i<currencyList.length;i++){
    //     let obj = currencyList[i];
    //     if(obj.currency_id==currency){
    //       currencyObj = obj;
    //     }
    // }
    
  //  this.currency = currencyObj;
    this.currency = await this.settingService.getCurrency();
 
    console.log(this.currency);
  }

  presentModal() {
    const modal =  this.modalController.create(InitPage);

    modal.onDidDismiss(res=>{
        this.loadSetup();
    });

    return  modal.present();
  }

  async getAllSettings(){
    return await this.settingService.getSettings();
  }
 
  goToPost(id){
    // this.navCtr.navigateForward('/blogdetail/'+id);
    this.navCtr.push('BlogdetailPage',{id:id});
  }
  
  goToCourse(id){
    // this.navCtr.navigateForward('/course/'+id);
    let nav = this.app.getRootNav();
    nav.push('CoursePage',{id:id});
    
  }

  backButtonAction(){
    this.platform.exitApp();
  }
}
