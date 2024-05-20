import { Injectable } from '@angular/core';
import { DataSharedService } from './data-shared.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  localStorageData :any = null;
  constructor(private datasharedservice :DataSharedService) { 
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
  }
  organisation_id(){
    return this.localStorageData?.organisation_details[0]?.id
  }
}
