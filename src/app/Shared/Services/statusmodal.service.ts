import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusmodalService {

  constructor() { }
  private modalData = new BehaviorSubject<any>(null);

  getModalData(): Observable<any> {
    return this.modalData.asObservable();
  }
}
