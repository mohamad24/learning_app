import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ViewController } from 'ionic-angular';
import { SettingsProvider } from '../../providers/settings/settings';
import { ApiProvider } from '../../providers/api/api';

/**
 * Generated class for the InitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-init',
  templateUrl: 'init.html',
})
export class InitPage {



  
  public error:boolean = false;
  private loading;
  constructor(private nav:NavController , private settingService:SettingsProvider ,public loadingController: LoadingController,private apiService:ApiProvider,public toastController: ToastController,public viewController:ViewController) { }


  ionViewDidLoad() {
    console.log('ionViewDidLoad InitPage');
  }
 
  ngOnInit() {

    //this.nav.navigateRoot('/app/tabs/(home:home)');
    
      this.settingService.checkSettings().then(res => {
          if(!res){
           this.reload();
          }
          else{ 
              //refresh the settings
              this.settingService.storeSettings();  
              // this.nav.navigateRoot('/app/tabs/(home:home)');
              // this.router.navigateByUrl('/app/tabs/(home:home)');
          }
      });


  }

  close(){
    this.viewController.dismiss();
  }

  reload(){
    this.presentLoading();
    this.apiService.getSettings().subscribe(res => {
      console.log(res);
        // this.storage.set(this.settingService.getKey(),res);
        this.settingService.saveSettings(res);
        if(this.loading){
          this.loading.dismiss();
        }
         //redirect to home 
         //this.router.navigateByUrl('/app/tabs/(home:home)');
         console.log('dismissing modal');
         this.viewController.dismiss();
    }, err => {
        this.error = true;
        if(this.loading){
          this.loading.dismiss();
        }
      this.presentToast('Network error! Please check your Internet connection');
      console.log(err.message);
    });
  }


  async presentLoading() {
    this.loading = await this.loadingController.create({
      content: 'Initializing. Please wait...',
      duration: 2000000000
    });
    return await this.loading.present();
  }

  async presentToast(message:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
