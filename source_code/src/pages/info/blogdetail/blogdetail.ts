import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { SettingsProvider } from '../../../providers/settings/settings';
import { ApiProvider } from '../../../providers/api/api';

/**
 * Generated class for the BlogdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-blogdetail',
  templateUrl: 'blogdetail.html',
})
export class BlogdetailPage {

  public showLoading:boolean = false;
  public networkPresent= true;
  public showRetry=false;
  public settings;
  public article;
  public id=null;
  public basePath;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,public apiService:ApiProvider,public settingService:SettingsProvider,public toastController:ToastController,public network:Network,public navController:NavController) {
  }

  async ngOnInit() {
    this.basePath = await this.settingService.getSetting('base_path');
      this.id = this.navParams.get('id');      
      this.loadData();
  }

  public loadData(){
      this.showLoading = true;
      this.apiService.getPost(this.id).subscribe(resp=>{
          this.showLoading = false;
          this.article = resp;
      },err=>{
        this.showLoading = false;
        this.showRetry = true;
        this.presentToast('Network error! Please check your Internet Connection and try again');
        this.navController.pop();
      });
  }


  async presentToast(message:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad BlogdetailPage');
  }

}
