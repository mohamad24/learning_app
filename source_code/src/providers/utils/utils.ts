import { Injectable } from '@angular/core';
import { ToastController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage'; 

/*
  Generated class for the UtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilsProvider {

  public loading;

  constructor(public loadingController:LoadingController,private toast: ToastController,private alertController:AlertController,private storage: Storage, private plt:Platform ) { }

  async presentToast(message:string) {
    

    let toast = this.toast.create({
      message: message,
      duration: 3000
    });
  
    
  
    toast.present();
    }
  
  async presentAlert(title,message) {
 
    let alert = this.alertController.create({
      title: title,
      message: message, 
      buttons: ['Dismiss']
    });
    alert.present();
  }

  getStored(id,namespace){
    let key = namespace+'_'+id;
    return this.storage.get(key);
  }

  store(id,namespace,value){
    let key = namespace+'_'+id;
    this.storage.set(key,value);
  }

  networkError(){
    this.presentToast('A network error has occured! Please check your internet connection and try again.');
  }

  getFromStorage(key){
    return this.storage.get(key);
  }

  isAndroid(){
      return this.plt.is('android');
  }

  isIOS(){
    return this.plt.is('ios');
  }

  presentLoading() {
    this.loading = this.loadingController.create({
      content: 'Loading. Please wait...',
      duration: 2000000000
    });
     this.loading.present();
  }

  dismissLoading(){
    this.loading.dismiss();
  }

  getLoading(){
    return this.loading;
  }

}
