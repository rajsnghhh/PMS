import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../Shared/Services/http.service';
import { HRMS_API_CONFIG } from '../Config/hrms.const';

@Injectable({
  providedIn: 'root'
})
export class HRMSAPIService {

  constructor(
    private HTTP: HttpService
  ) { }

  userLogout(): Observable<any> {
    const url = HRMS_API_CONFIG.USER_LOGOUT;
    return this.HTTP.get(url);
  }

  getSettingList(req: any): Observable<any> {
    const url = HRMS_API_CONFIG.SETTING_LIST + req.toString();
    return this.HTTP.get(url);
  }

  getmonthList(orgId: any): Observable<any> {
    const url = HRMS_API_CONFIG.MONTH_LIST + orgId.toString();
    return this.HTTP.get(url);
  }

  getattendenceList(orgId: any): Observable<any> {
    const url = HRMS_API_CONFIG.ATTENDANCE_LIST + orgId.toString();
    return this.HTTP.get(url);
  }

  getfortnitProgress(orgId: any): Observable<any> {
    const url = HRMS_API_CONFIG.FORTNIGHT_LIST + orgId.toString();
    return this.HTTP.get(url);
  }

  getNotificationList(data: any): Observable<any> {
    const url = HRMS_API_CONFIG.NOTIFICATION_LIST + data.toString();
    return this.HTTP.get(url);
  }

  getLeaveSummery(req: any): Observable<any> {
    const url = HRMS_API_CONFIG.LEAVE_SUMMARY + req.toString();
    return this.HTTP.get(url);
  }

  adddeviation(req: any): Observable<any> {
    const url = HRMS_API_CONFIG.DEVIATION;
    return this.HTTP.post(url, req);
  }

  getholidayList(orgId: any): Observable<any> {
    const url = HRMS_API_CONFIG.HOLIDAY_LIST + orgId.toString();
    return this.HTTP.get(url);
  }
  
  getUpCmingBday(req: any): Observable<any> {
    const url = HRMS_API_CONFIG.BIRTH_LIST + req.toString();
    return this.HTTP.get(url);
  }
  
  getNewJoinerList(req: any): Observable<any> {
    const url = HRMS_API_CONFIG.NEW_JOINER + req.toString();
    return this.HTTP.get(url);
  }
  
  getEmployeeLeaveList(req: any): Observable<any> {
    const url = HRMS_API_CONFIG.EMPLOYEE_LEAVE + req.toString();
    return this.HTTP.get(url);
  }

  getNoticeData(req: any): Observable<any> {
    const url = HRMS_API_CONFIG.NOTICE_DATA + req.toString();
    return this.HTTP.get(url);
  }

  getLeaveDetails(data: any): Observable<any> {
    const url = HRMS_API_CONFIG.LEAVE_LIST + data;
    return this.HTTP.get(url);
  }

  getHRMSDetails(req: any): Observable<any> {
    const url = HRMS_API_CONFIG.HRMS_DETAILS + req.toString();
    return this.HTTP.get(url);
  }

  addLeave(req: any): Observable<any> {
    const url = HRMS_API_CONFIG.LEAVE_LIST;
    return this.HTTP.post(url, req);
  }

}
