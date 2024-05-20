import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor() { }
  private paginationData = new BehaviorSubject<any>(null);
  private totalItemCount = new BehaviorSubject<any>(null);


  setPaginationData(page: any, pageSize: any) {
    let pagedata = {
      pagevalue: page,
      pagesizeValue: pageSize
    }
    this.paginationData.next(pagedata);
  }

  getPaginationData(): Observable<any> {
    return this.paginationData.asObservable();
  }

  setTotalItemData(totalItem: any) {
    this.totalItemCount.next(totalItem);
  }

  getTotalItemData(): Observable<any> {
    return this.totalItemCount.asObservable();
  }
}
