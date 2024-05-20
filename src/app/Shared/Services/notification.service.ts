import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataSharedService } from './data-shared.service';
import { APIService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    userData: any;

    constructor(private datasharedservice: DataSharedService, private apiservice: APIService) { }
    private sharedNotifyData = new BehaviorSubject<any>(null);

    setNotificationData() {
        this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'))

        let params = new URLSearchParams();
        params.set('organization_id', this.userData.organisation_details[0].id);
        params.set('page_size', '6');
        params.set('page', '1');
        this.apiservice.getNotificationList(params).subscribe((data: any) => {

            this.sharedNotifyData.next(data.results);
        })
    }

    getNotificationData(): Observable<any> {
        return this.sharedNotifyData.asObservable();
    }
}