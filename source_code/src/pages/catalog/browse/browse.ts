import { Component, OnInit, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, ToastController, InfiniteScroll, ActionSheetController, Content, App, IonicApp, PopoverController } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { SettingsProvider } from '../../../providers/settings/settings';
import { Network } from '@ionic-native/network';
import { CoursePage } from '../course/course';


/**
 * Generated class for the BrowsePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-browse',
  templateUrl: 'browse.html',
})
export class BrowsePage {

  @ViewChild(InfiniteScroll) infiniteScroll:InfiniteScroll;
  @ViewChild(Content) content: Content;
  
  public isOn: boolean = false;
  public isCategory: boolean = false;
  public courses;
 

  public error:boolean = false;
  private loading;
  public settings;
  public currency;
  public exchangeRate;
  public params= {
    filter:'',
    sort:'',
    group:'',
    type:'' 
};
  public currentPage=1; 
  public showLoading:boolean = false;
  public sortLib ={
    asc : "Alphabetical (asc)",
    desc: "Alphabetical (desc)",
    recent : "Most Recent",
    priceAsc : "Price (Lowest)",
    priceDesc : "Price (Highest)",
    c : "Online Courses",
    "s-b" : "Training Sessions"

  };
  public catLib = {};
  public networkPresent= true;
  public showRetry=false;

  constructor(public popoverCtrl: PopoverController,public app:App,public navCtrl: NavController, public navParams: NavParams, private apiService:ApiProvider,public loadingController: LoadingController,public toastController: ToastController,public settingService:SettingsProvider,public actionSheetController: ActionSheetController,public network:Network) { 

    // this.params = {
    //     filter:'',
    //     sort:'',
    //     group:'',
    //     type:'' 
    // };



   

  }

  private clearParams(){
    this.params = {
      filter:'',
      sort:'',
      group:'',
      type:'', 
  };
  }

  async ionViewWillEnter(){
    this.currency = await this.settingService.getCurrency();
    console.log('Entered browse view');
  }



  async ngOnInit() {

    this.params = {
      filter:'',
      sort:'',
      group:'',
      type:'' 
  };

  this.sortLib = {
    asc : "Alphabetical (asc)",
    desc: "Alphabetical (desc)",
    recent : "Most Recent",
    priceAsc : "Price (Lowest)",
    priceDesc : "Price (Highest)",
    c : "Online Courses",
    "s-b" : "Training Sessions"

  };

  console.log(this.params);
  console.log(this.sortLib);


    // let data = await this.settingService.getSetting('widgets');
    this.networkCheck();   
    
    //get courses
    this.showLoading= true;
    this.loadCourses(1).subscribe(response=>{
      this.courses= response['records'];
      console.log(response);
      this.currentPage = 1;
      this.showLoading = false;
    }, err => {
      this.showRetry = true;
      this.showLoading= false;
    this.presentToast('Network error! Please check your Internet connection');
    console.log(err.message);
  });

  this.currency = await this.settingService.getCurrency();
 

    this.settingService.getSettings().then(val => { 
      this.settings = val;

      //load category library
      for(let i=0; i < this.settings.categories.length; i++){
          this.catLib[this.settings.categories[i].session_category_id] = this.settings.categories[i].category_name;
      }
      console.log('showing cat lib');
      console.log(this.catLib);

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
      
      // this.currency = currencyObj;
    });

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


  search(){
    this.showLoading = true;
    this.loadCourses(1).subscribe(resp=>{ 
      this.courses = resp['records'];
      this.showLoading = false;
    }, err => {
      this.showRetry = true;
      this.showLoading= false;
    this.presentToast('Network error! Please check your Internet connection');
    console.log(err.message);
  });
  }

 

 private  loadCourses(page){
  this.showRetry= false; 
  
 // this.currentPage = page; 
  //this.infiniteScroll.enable(true);
   return this.apiService.getSessions(page,30,this.params.group,this.params.filter,this.params.sort,this.params.type);
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      content: 'Loading. Please wait...',
      duration: 2000000000
    });
    return await this.loading.present();
  }


  getButtonText(): string {
    return `Switch ${ this.isOn ? 'Off' : 'On' }`;
  }
  setState(): void {
    this.isOn = !this.isOn;
  }

  toggleCategory(){
    this.content.scrollToTop();
    this.isCategory = !this.isCategory;
  }

  toggleDetails() {
      this.isOn = !this.isOn;
      if(!this.isOn && this.params.filter != ""){
        this.params.filter = "";
        this.showLoading= true;
        this.loadCourses(1).subscribe(resp=>{
          this.courses = resp['records'];
          this.showLoading= false;
        });
        
        
      }
      
    }

    clearSearch(){
      console.log('clear clicked');
    }


    loadData(event){
      
        this.currentPage++;
        console.log('scroll starting: '+this.currentPage); 
        this.loadCourses(this.currentPage).subscribe(response=>{
          //console.log(response['records']);
          this.courses= this.courses.concat(response['records']);
          console.log(this.courses);

          event.complete();

          //determine if this was the last page    
          let totalPages = Math.ceil((response['total']/response['rows_per_page']));
          console.log(totalPages);
          if(this.currentPage >= totalPages){
           // this.currentPage--;
           // event.enable(false);
          }  
        }, err => {
          event.complete();

        this.presentToast('Network error! Please check your Internet Connection and try again');
        console.log(err.message);
      })

    }

    reloadCourses(page){
      this.content.scrollToTop();
      this.showLoading=true;
      this.currentPage=page;
      this.loadCourses(page).subscribe(resp=>{
          this.courses = resp['records'];
          this.showLoading=false;
      }, err => {
        this.showRetry = true;
        this.showLoading= false;
      this.presentToast('Network error! Please check your Internet connection');
      console.log(err.message);
    });

    }

    async presentActionSheet() {
      const actionSheet = await this.actionSheetController.create({
        title: 'Sort By',
        buttons: [{
          text: 'Alphabetical (asc)', 
          icon: 'arrow-round-up',
          handler: () => {
            this.params.sort = "asc";
            this.reloadCourses(1);
          }
        }, {
          text: 'Alphabetical (desc)',
          icon: 'arrow-round-down',
          handler: () => {
            this.params.sort = "desc";
            this.reloadCourses(1);
          }
        }, {
          text: 'Most Recent',
          icon: 'time',
          handler: () => {
            this.params.sort = "recent";
            this.reloadCourses(1);
          }
        }, {
          text: 'Price (Lowest)',
          icon: 'cash',
          handler: () => {
            this.params.sort = "priceAsc";
            this.reloadCourses(1);
          }
        },{
          text: 'Price (Highest)',
          icon: 'cash',
          handler: () => {
            this.params.sort = "priceDesc";
            this.reloadCourses(1);
          }
        },
        {
          text: 'Online Courses',
          icon: 'globe',
          handler: () => {
            this.params.type = "c";
            this.reloadCourses(1);
          }
        },{
          text: 'Training Sessions',
          icon: 'people',
          handler: () => {
            this.params.type = "s-b";
            this.reloadCourses(1);
          }
        }, {
          text: 'Reset',
          icon: 'refresh', 
          handler: () => {
            this.params.type = "";
            this.params.sort = "";
            this.reloadCourses(1);
          }
        }]
      });
      await actionSheet.present();
    }

    loadCategory(category){
      this.params.group= category;
      this.isCategory = false;
      this.reloadCourses(1);
    }

    
  async presentToast(message:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  loadCourse(id){
   
   // this.app.getRootNav.pu('CoursePage',{id:id});
    let nav = this.app.getRootNav();
    nav.push('CoursePage',{id:id});
  }
 
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create('CurrencyPage');
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(()=>{ 
     
      this.settingService.getCurrency().then(resp=>{
        this.currency = resp;
     //   this.reloadCourses(1);
      });
        //this.reloadCourses(1);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrowsePage');
   
  }

}
