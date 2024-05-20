import { environment } from "src/environments/environment";

export const HRMS_API_CONFIG = {

    HRMS_DETAILS: environment.API_URL + "hrms_details/?organization_id=",
    USER_LOGOUT: environment.API_URL + "logout/",
    SETTING_LIST: environment.API_URL + "settings_group_master_api/?",
    MONTH_LIST: environment.API_URL + "all_month_list/?",
    LEAVE_LIST: environment.API_URL + "EmployeeLeave/",
    ATTENDANCE_LIST: environment.API_URL + "employee_attendence_summary/?",
    FORTNIGHT_LIST: environment.API_URL + "attendence_summary/?",
    LEAVE_SUMMARY: environment.API_URL + "leave_summary/?",
    DEVIATION: environment.API_URL + "attendence_deviations/",
    HOLIDAY_LIST: environment.API_URL + "holidays/?",
    BIRTH_LIST: environment.API_URL + "coming_birthday/?organization_id=",
    NEW_JOINER: environment.API_URL + "new_joiners/?organization_id=",
    EMPLOYEE_LEAVE: environment.API_URL + "employee_monthly_leave/?",
    NOTICE_DATA: environment.API_URL + "noticeboard/?",
    //Notifications
    NOTIFICATION_LIST: environment.API_URL + "notification_master/?",

};

export const Error_Messages = {
    Failed_HTTP: 'Oops Something Went Wrong. Please Try After Sometime!'
};

export const Success_Messages = {
    SuccessAdd: 'Added Successfully!',
    SuccessUpdate: 'Updated Successfully!',
    SuccessDelete: 'Deleted Successfully!'
}


