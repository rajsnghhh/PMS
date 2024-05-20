import { Component } from '@angular/core';
import { NotificationService } from '../Shared/Services/notification.service';
import { DataSharedService } from '../Shared/Services/data-shared.service';
import { APIService } from '../Shared/Services/api.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  notificationData: any;
  userData: any;
  lastWeekNotify: Array<any> = [];

  constructor(
    private notificationService: NotificationService, private datasharedservice: DataSharedService,
    private apiservice: APIService
  ) { }

  ngOnInit(): void {
    this.getNotificationList();
    this.getLastWeekNotification();
  }

  getNotificationList() {
    this.notificationService.getNotificationData().subscribe(data => {
      this.notificationData = data;
    });
  }

  getLastWeekNotification() {
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'))

    let params = new URLSearchParams();
    params.set('organization_id', this.userData.organisation_details[0].id);
    params.set('data_filter', 'last_week');
    this.apiservice.getNotificationList(params).subscribe((data: any) => {
      this.lastWeekNotify = data.results;
    })
  }
}
