import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, InfiniteScroll, Content, ModalController } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { UtilsProvider } from '../../../providers/utils/utils';
import { SettingsProvider } from '../../../providers/settings/settings';
import { Network } from '@ionic-native/network';

/**
 * Generated class for the DownloadListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-download-list',
  templateUrl: 'download-list.html',
})
export class DownloadListPage {

  @ViewChild(InfiniteScroll) infiniteScroll:InfiniteScroll;
  @ViewChild(Content) content: Content;

  public posts;
  public error:boolean = false; 
  public basePath;
  public currentPage=1; 
  public showLoading:boolean = false;
  public networkPresent= true;
  public showRetry=false;
  public isOn: boolean = false;
  public filter='';
 
  constructor(public modalController:ModalController,public navCtrl: NavController, public navParams: NavParams,private apiService:ApiProvider,public toastController: ToastController,public settingService:SettingsProvider,public network:Network, public navCtr:NavController) {
  }


  async ngOnInit() {

    this.basePath = await this.settingService.getSetting('base_path');
     

    this.networkCheck();   
    
    //get courses
    this.showLoading= true;
    this.loadPosts(1).subscribe(response=>{
      this.posts= response['data'];
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

  goToPost(id,name){
    let modal =this.modalController.create('DownloadfilesPage',{
      download_id:id,
      download_name:name
    })
    modal.present();
  }

private loadPosts(page){
    this.showRetry= false;
     return this.apiService.getDownloads(page);
}

loadData(event){
      
      this.currentPage++;
      console.log('scroll starting: '+this.currentPage); 
      this.loadPosts(this.currentPage).subscribe(response=>{
        //console.log(response['records']);
        this.posts= this.posts.concat(response['data']);
        console.log(this.posts);

        event.complete();

        //determine if this was the last page    
        let totalPages = Math.ceil((response['total']/response['per_page']));
        console.log(totalPages);
        if(this.currentPage >= totalPages){
         // event.disabled =true;
         this.currentPage--;
        }  
      }, err => {
        event.complete();

      this.presentToast('Network error! Please check your Internet Connection and try again');
      console.log(err.message);
    })

}


reloadPosts(page){
      this.content.scrollToTop();
      this.showLoading=true;
      this.loadPosts(page).subscribe(resp=>{
          this.posts = resp['data'];
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
