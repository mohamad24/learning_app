import { Injectable } from '@angular/core';

/*
  Generated class for the CartProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CartProvider {

  public sessions=[]; 
  private coupon = null; 
  private paymentMethod;
  private total;
  private invoice;
  constructor() { 
  }

  public addSession(session){
    //check if element exists already
    let index = this.sessions.indexOf(session);
    if(index >= 0){
      return false;
    }

    this.sessions.push(session);
    return true;
  }

  public removeSession(session){
    this.sessions.splice( this.sessions.indexOf(session), 1 );
  }

  public getTotal(){
    this.total=0;
    
    for(let session of this.sessions){
        this.total += session.amount;
    }

    if(this.coupon){
        let discountAmount = this.total * (this.coupon.discount/100);
        this.total = this.total - discountAmount;
    }

    return this.total;

  }

  public getInvoice(){
    return this.invoice;
  }

  public setInvoice(invoice){
    this.invoice = invoice;
  }

  public  setPaymentMethod(method){
    this.paymentMethod = method;
  }

  public getPaymentMethod(){
    return this.paymentMethod;
  }

  public getSessions(){
    return this.sessions;
  }

  public  hasItems(){
    if(!this.sessions){
      return false;
    }

    return (this.sessions.length>0);
  }

  public paymentRequired(){
    let paymentRequired = false;
    for(let session of this.sessions)
    {
      if(session.details.payment_required==1){
        paymentRequired = true;
      }
    }

    return paymentRequired;
  }


  public clearCart(){
      this.sessions = [];
      this.coupon = null,
      this.paymentMethod = null;
      this.invoice = null;
  }

}
