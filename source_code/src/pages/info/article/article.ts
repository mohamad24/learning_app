import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { SettingsProvider } from '../../../providers/settings/settings';
import { Network } from '@ionic-native/network';

/**
 * Generated class for the ArticlePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-article',
  templateUrl: 'article.html',
})
export class ArticlePage {

  public showLoading:boolean = false;
  public networkPresent= true;
  public showRetry=false;
  public settings;
  public article;
  public id=null;

  constructor(public navParams: NavParams,public apiService:ApiProvider,public settingsServce:SettingsProvider,public toastController:ToastController,public network:Network,public navController:NavController) {
  }

  ionViewDidLoad() {
    
  }


  ngOnInit() {
    this.id = this.navParams.get('id');      
    this.loadData();
  }


  public loadData(){
    this.showLoading = true;
    this.apiService.getArticle(this.id).subscribe(resp=>{
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



}
