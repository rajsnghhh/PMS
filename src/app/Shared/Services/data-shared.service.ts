import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataSharedService {

  constructor() { }
  environment = environment
  private sharedData = new BehaviorSubject<any>(null);
  private orderAmount = new BehaviorSubject<any>(0);
  private igstScope = new BehaviorSubject<any>({
    igst: true
  });
  private reload = new BehaviorSubject<string>('');

  private transportBillData = new BehaviorSubject<any>(null);


  setObservableData(data: any) {
    this.sharedData.next(data);
  }

  getObservableData(): Observable<any> {
    return this.sharedData.asObservable();
  }

  setsharedData(data: any) {
    this.transportBillData.next(data);
  }

  getSharedData(): Observable<any> {
    return this.transportBillData.value;
  }

  getObservableData1() {
    return this.sharedData.value;
  }
  
  onReloadHeader(): Observable<any> {
    return this.reload.asObservable();
  }

  headercomponentReload() {
    this.reload.next('reload')
  }


  public saveLocalData(key: string, value: string) {
    localStorage.setItem(environment.env + '_' + key, this.encrypt(value));
  }

  public getLocalData(key: string) {
    let data = localStorage.getItem(environment.env + '_' + key) || 'false';
    return this.decrypt(data);
  }
  public removeLocalData(key: string) {
    localStorage.removeItem(environment.env + '_' + key);
  }

  public clearLocalData() {
    let localData: any = this.allStorage()
    for (var key in localData) {
      if (key.includes(environment.env)) {
        localStorage.removeItem(key)
      }
    }
  }

  sourceState = ''
  setSourceState(stateId: any) {
    this.sourceState = stateId
    if (stateId && this.sourceState == this.destinyState) {
      this.igstScope.next({
        igst: false
      });
    } else {
      this.igstScope.next({
        igst: true
      });
    }
  }

  destinyState = ''
  setDestinyState(stateId: any) {
    this.destinyState = stateId
    if (stateId && this.sourceState == this.destinyState) {
      this.igstScope.next({
        igst: false
      });
    } else {
      this.igstScope.next({
        igst: true
      });
    }
  }


  setMaxOrderAmount(amount:number) {
    this.orderAmount.next(amount);
  }

  getMaxOrderAmount(): Observable<any> {
    return this.orderAmount.asObservable();
  }

  setDirectIGSTScope(scope:boolean) {
    this.igstScope.next({
      igst: scope
    });
  }

  getIGSTscope(): Observable<any> {
    return this.igstScope.asObservable();
  }

  allStorage() {
    var archive: any = {}, // Notice change here
      keys = Object.keys(localStorage),
      i = keys.length;

    while (i--) {
      archive[keys[i]] = localStorage.getItem(keys[i]);
    }

    return archive;
  }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt.toString(), environment.ENC_DYC_KEY).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, environment.ENC_DYC_KEY).toString(CryptoJS.enc.Utf8);
  }


}
