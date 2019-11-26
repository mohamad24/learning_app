import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { SettingsProvider } from '../../../providers/settings/settings';
import { Network } from '@ionic-native/network';
import { PrivacyPage } from '../privacy/privacy';
import { TermsPage } from '../terms/terms';
import { BlogPage } from '../blog/blog';

/**
 * Generated class for the InformationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage {

 

  public showLoading:boolean = false;
  public networkPresent= true;
  public showRetry=false;
  public settings;
  public articles;
  public privacy=PrivacyPage;
  public terms=TermsPage;
  public blog = BlogPage;

  constructor(public navCtrl: NavController, public navParams: NavParams,private apiService:ApiProvider,public toastController: ToastController,public settingService:SettingsProvider,public network:Network) { }

  openPage(page,params=null){
    this.navCtrl.push(page,params);
  }

  ngOnInit() {
    this.networkCheck();
    this.loadInfo();
  }

  loadInfo(){
    this.showRetry =false;
      this.showLoading=true;
      this.apiService.getArticles().subscribe(resp=>{
          this.articles = resp;
          this.showLoading = false;
      },err=>{
        this.showLoading = false;
        this.showRetry = true;
        this.presentToast('Network Error! Please try again');
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
  this.networkPresent= true;
  // We just got a connection but we need to wait briefly
   // before we determine the connection type. Might need to wait.
  // prior to doing any api requests as well.
  setTimeout(() => {
    if (this.network.type === 'wifi') {
      console.log('we got a wifi connection, woohoo!');
      
    }
  }, 3000);
});


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InformationPage');
  }

  openArticle(id){
    this.navCtrl.push('ArticlePage',{
      id:id
    });
  }

}
