import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private sharedDataSubject = new BehaviorSubject<any>(null);
  sharedData$ = this.sharedDataSubject.asObservable();

  private totalNetAmtSubject = new BehaviorSubject<any>(null);
  totalNetAmt$ = this.totalNetAmtSubject.asObservable();


  private totalItemAmtSubject = new BehaviorSubject<any>(null);
  totalItemAmt$ = this.totalItemAmtSubject.asObservable();


  private totalTaxAmtSubject = new BehaviorSubject<any>(null);
  totalTaxAmt$ = this.totalTaxAmtSubject.asObservable();

  constructor() { }

  updateSharedData(data: any) {
    this.sharedDataSubject.next(data);
  }

  updateTotalNetAmt(totalNetAmt: number) {
    this.totalNetAmtSubject.next(totalNetAmt);
  }

  updateTotalItemAmt(totalItemAmt: number) {
    this.totalItemAmtSubject.next(totalItemAmt);
  }

  updateTotalTaxAmt(totalTaxAmt: number) {
    this.totalTaxAmtSubject.next(totalTaxAmt);
  }
}
