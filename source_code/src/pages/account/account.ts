import { Component, ViewChild, ɵConsole } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events, PopoverController, App, Content } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ApiProvider } from '../../providers/api/api';
import { SettingsProvider } from '../../providers/settings/settings';
import { AccountPopoverPage } from './acountpages/account-popover/account-popover';


/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  @ViewChild(Content) content: Content;
  public option="login";
  public loggedIn=false;
  public loginModel ={email:'',password:''};  
  private loading;
  public fields;
  public student; 

  constructor(public app:App,public events:Events, public navCtrl: NavController, public navParams: NavParams,private utils:UtilsProvider, private authenticationService: AuthenticationProvider,private apiService:ApiProvider,private loadingController:LoadingController,private settingsService:SettingsProvider,private alertController:AlertController,public popoverCtrl: PopoverController) { }


  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }

  async ngOnInit() {
    this.student={
      'first_name':'',
      'last_name':'',
      'dateofbirth': '',
      'gender': '',
      'nationality': '',
      'email':'',
      'mobile_number':'',
      'password':'',
      'confirm_password':''
    };

    
     this.authenticationService.authenticationState.subscribe(state => {
      this.content.resize();
        this.loggedIn = state;
      });

      //get settings
      this.fields = await this.settingsService.getSetting('registration');

      for(let i=0;i<this.fields.length;i++){
        this.student['custom_'+this.fields[i].registration_field_id] =''; 
      }

      console.log(this.student);

  }

  
  onLogin(){
    console.log('Attempt to login');
    this.presentLoading();
    this.apiService.login(this.loginModel.email,this.loginModel.password).subscribe(res=>{
      this.loading.dismiss();
      let status = res['status'];
      if(status!=true){
        this.presentToast('Invalid login details! Please check your credentials and try again.');
      }
      else{
        
        this.utils.presentToast('Login Successfull');
          this.authenticationService.login({
            'id':res['id'],
            'first_name':res['first_name'],
             'last_name':res['last_name'],
             'token':res['token']   
          }).then(()=>{
            this.content.resize();
          });
          
      }
    },err=>{
      this.loading.dismiss(); 
      this.utils.networkError();
      

    });
  }

  onRegister(registerForm){
    if(registerForm.form.value.password != registerForm.form.value.confirm_password ){
      this.presentAlert('Submission Failed!',' Your two password values do not match');
    }
    else if(registerForm.form.valid){
      this.presentLoading();
      console.log(this.student);
    this.apiService.register(this.student).subscribe(res=>{
      this.loading.dismiss();
      let status = res['status'];
      if(status!=true){
        console.log(res['msg']);
        this.presentAlert('Registration Failed!',res['msg']);
      }
      else{ 
        this.utils.presentToast('Registration Successfull');
          this.authenticationService.login({
            'id':res['id'],
            'first_name':res['first_name'],
             'last_name':res['last_name'],
             'token':res['token']   
          });
          
      }
    },err=>{
      this.loading.dismiss();
      // this.presentToast('Network error! Please try again later');
      this.utils.networkError();

    });

    }
    else{
        this.presentAlert('Submission Failed!',' Please fill all required fields and try again');
    }
  }

  presentAlert(title,message) {
    const alert =  this.alertController.create({
      title: title, 
      message: message,
      buttons: ['OK']
    });

     alert.present();
  }

  presentLoading() {
    this.loading = this.loadingController.create({
      content: 'Loading. Please wait...',
      duration: 2000000000
    });
     this.loading.present();
  }

  forgotPassword(){
    this.navCtrl.push('ResetPasswordPage');
  }
      
  presentToast(message:string) {
    // const toast = await this.toastController.create({
    //   message: message,
    //   duration: 3000,
    //   position:'bottom',
    //   animated:true,
    //   cssClass: 'toast'
    // });
    // toast.present();
    this.utils.presentToast(message);
    

  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create('AccountPopoverPage');
    popover.present({
      ev: myEvent
    });
  }

  open(page){
    this.navCtrl.push(page);
  }

  openPage(page){
    let nav = this.app.getRootNav();
    nav.push(page);
  }

}
