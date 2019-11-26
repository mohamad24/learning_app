import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, InfiniteScroll, Content, ToastController, App } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { SettingsProvider } from '../../../providers/settings/settings';
import { ApiProvider } from '../../../providers/api/api';

/**
 * Generated class for the TestListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test-results',
  templateUrl: 'test-results.html',
})
export class TestResultsPage {
  @ViewChild(InfiniteScroll) infiniteScroll:InfiniteScroll;
  @ViewChild(Content) content: Content;


  public results;
  public error:boolean = false; 
  public basePath;
  public currentPage=1; 
  public showLoading:boolean = false;
  public networkPresent= true;
  public showRetry=false;
  public testId;
  public test;

  constructor(public app:App,public navCtrl: NavController, public navParams: NavParams,private apiService:ApiProvider,public toastController: ToastController,public settingService:SettingsProvider,public network:Network) {
  }

  public status(score){
    let status = (score >= this.test.passmark)? 'Passed':'Failed';
    return status;
  }

  async ionViewDidLoad() {

    this.basePath = await this.settingService.getSetting('base_path');
    this.testId = this.navParams.get('id');
    this.test = this.navParams.get('test');

    this.networkCheck();   
    
    //get courses
    this.showLoading= true;
    this.loadTests(1).subscribe(response=>{
      this.results= response['records'];

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

 

private loadTests(page){
    this.showRetry= false;
     return this.apiService.getStudentTests(this.testId,page);
}

loadData(event){
      
      this.currentPage++;
      console.log('scroll starting: '+this.currentPage); 
      this.loadTests(this.currentPage).subscribe(response=>{
        //console.log(response['records']);
        this.results= this.results.concat(response['records']);
        console.log(this.results);

        event.complete();

        //determine if this was the last page    
        let totalPages = Math.ceil((response['total']/30));
        console.log(totalPages);
        if(this.currentPage >= totalPages){
         // event.disabled =true;
        }  
      }, err => {
        event.complete();

      this.presentToast('Network error! Please check your Internet Connection and try again');
      console.log(err.message);
    })

}


reloadTests(page){
      this.content.scrollToTop();
      this.showLoading=true;
      this.loadTests(page).subscribe(resp=>{
          this.results = resp['records'];
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
