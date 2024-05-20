import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../Config/config.const';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  constructor(private HTTP: HttpService) { }

  getCountryList(): Observable<any> {
    const url = API_CONFIG.COUNTRY_LIST;
    return this.HTTP.get(url);
  }

  getCurrencyList(req: any): Observable<any> {
    const url = API_CONFIG.CURRENCY_LIST + req.toString();
    return this.HTTP.get(url);
  }

  getStateList(req: any): Observable<any> {
    const url = API_CONFIG.STATE_LIST + req.toString();
    return this.HTTP.get(url);
  }
  getCityList(req: any): Observable<any> {
    const url = API_CONFIG.CITY_LIST + req.toString();
    return this.HTTP.get(url);
  }
  getZoneList(req: any): Observable<any> {
    const url = API_CONFIG.ZONE_LIST + req.toString();
    return this.HTTP.get(url);
  }
  addZone(req: any): Observable<any> {
    const url = API_CONFIG.ZONE_LIST;
    return this.HTTP.post(url, req);
  }
  editZone(req: any, editId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.ZONE_LIST +
      'method=edit&id=' +
      editId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url, req);
  }
  deleteZone(delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.ZONE_LIST +
      'method=delete&id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url);
  }

  getEmailTag(req: any): Observable<any> {
    const url = API_CONFIG.EMAIL_TAG + req.toString();
    return this.HTTP.get(url);
  }

  getTemplateList(req: any): Observable<any> {
    const url = API_CONFIG.EMAIL_TEMPLATE + req.toString();
    return this.HTTP.get(url);
  }

  getEmailList(req: any): Observable<any> {
    const url = API_CONFIG.EMAIL_LIST + req.toString();
    return this.HTTP.get(url);
  }

  getEmailListDetails(orgId: any, deptId: any): Observable<any> {
    const url =
      API_CONFIG.EMAIL_LIST +
      '&organization_id=' +
      orgId +
      '&template_id=' +
      deptId;
    return this.HTTP.get(url);
  }

  addEmail(body: any, orgId: any): Observable<any> {
    const url = API_CONFIG.EMAIL_LIST + 'organization_id=' + orgId;
    return this.HTTP.post(url, body);
  }

  editEmail(body: any, delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.EMAIL_LIST +
      'template_id=' +
      delId +
      '&method=edit' +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url, body);
  }

  editEmailStatus(request: any, userId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.EMAIL_LIST +
      'method=status&template_id=' +
      userId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url, request);
  }

  deleteemail(delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.EMAIL_LIST +
      'method=delete&template_id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url);
  }

  getSmsList(req: any): Observable<any> {
    const url = API_CONFIG.SMS_LIST + req.toString();
    return this.HTTP.get(url);
  }

  getSmsTag(req: any): Observable<any> {
    const url = API_CONFIG.SMS_TAG + req.toString();
    return this.HTTP.get(url);
  }

  getFormulaTag(req: any): Observable<any> {
    const url = API_CONFIG.FORMULLA_TAG + req.toString();
    return this.HTTP.get(url);
  }
  getReferenceValue(req: any): Observable<any> {
    const url = API_CONFIG.REFERENCE_VALUE + req.toString();
    return this.HTTP.get(url);
  }

  getsmsTemplateList(req: any): Observable<any> {
    const url = API_CONFIG.SMS_TEMPLATE + req.toString();
    return this.HTTP.get(url);
  }

  getsmsDetails(orgId: any, deptId: any): Observable<any> {
    const url =
      API_CONFIG.SMS_LIST +
      '&organization_id=' +
      orgId +
      '&template_id=' +
      deptId;
    return this.HTTP.get(url);
  }

  addSms(body: any, orgId: any): Observable<any> {
    const url = API_CONFIG.SMS_LIST + 'organization_id=' + orgId;
    return this.HTTP.post(url, body);
  }

  deleteSms(delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.SMS_LIST +
      'method=delete&template_id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url);
  }

  editSms(body: any, delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.SMS_LIST +
      'method=edit&template_id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url, body);
  }

  userLogin(request: any): Observable<any> {
    const url = API_CONFIG.USER_LOGIN;
    return this.HTTP.LoginPost(url, request);
  }

  verifyresetURL(request: string) {
    const url = API_CONFIG.VERIFY_RESET_URL + request;
    return this.HTTP.loginget(url);
  }

  forgetUpdatePassword(request: any): Observable<any> {
    const url = API_CONFIG.FORGET_RESET_PASSWORD;
    return this.HTTP.LoginPatch(url, request);
  }

  profileUpdatePassword(request: any): Observable<any> {
    const url = API_CONFIG.PROFILE_RESET_PASSWORD;
    return this.HTTP.put(url, request);
  }

  userLogout(): Observable<any> {
    const url = API_CONFIG.USER_LOGOUT;
    return this.HTTP.get(url);
  }

  passResetRequest(request: any): Observable<any> {
    const url = API_CONFIG.RESET_PASSWORD;
    return this.HTTP.LoginPost(url, request);
  }

  addcompany(request: any): Observable<any> {
    const url = API_CONFIG.ADD_COMPANY;
    return this.HTTP.post(url, request);
  }

  getCompanyList(orgId: any): Observable<any> {
    const url = API_CONFIG.ADD_COMPANY + orgId.toString();
    return this.HTTP.get(url);
  }

  getCompanyDetails(orgId: any, compId: any): Observable<any> {
    const url =
      API_CONFIG.ADD_COMPANY +
      '&organization_id=' +
      orgId +
      '&comp_id=' +
      compId;
    return this.HTTP.get(url);
  }

  deleteCompany(delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.ADD_COMPANY +
      'method=delete&id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url);
  }

  editCompany(body: any, delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.ADD_COMPANY +
      'method=edit&id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url, body);
  }

  adddepartment(request: any): Observable<any> {
    const url = API_CONFIG.ADD_DEPARTMENT;
    return this.HTTP.post(url, request);
  }

  getDepartmentList(query: any): Observable<any> {
    const url = API_CONFIG.ADD_DEPARTMENT + query.toString();
    return this.HTTP.get(url);
  }

  getDepartmentDetails(orgId: any, deptId: any): Observable<any> {
    const url =
      API_CONFIG.ADD_DEPARTMENT +
      '&organization_id=' +
      orgId +
      '&dept_id=' +
      deptId;
    return this.HTTP.get(url);
  }

  deleteDepartment(delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.ADD_DEPARTMENT +
      'method=delete&id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url);
  }

  editDepartment(body: any, delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.ADD_DEPARTMENT +
      'method=edit&id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url, body);
  }

  adddesignation(request: any): Observable<any> {
    const url = API_CONFIG.ADD_DESIGNATION;
    return this.HTTP.post(url, request);
  }

  getDesignationDetails(data: any): Observable<any> {
    const url = API_CONFIG.ADD_DESIGNATION + data;
    return this.HTTP.get(url);
  }

  getreportingList(data: any): Observable<any> {
    const url = API_CONFIG.ADD_REPORTING + data;
    return this.HTTP.get(url);
  }

  deleteDesignation(delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.ADD_DESIGNATION +
      'method=delete&id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url);
  }

  editDesignation(
    body: any,
    delId: any,
    orgId: any,
    companyId: any
  ): Observable<any> {
    const url =
      API_CONFIG.ADD_DESIGNATION +
      'method=edit&id=' +
      delId +
      '&organization_id=' +
      orgId +
      '&company_id=' +
      companyId;
    return this.HTTP.put(url, body);
  }

  addemployee(request: any): Observable<any> {
    const url = API_CONFIG.ADD_EMPLOYEE;
    return this.HTTP.post(url, request);
  }

  getEmployeeList(orgId: any): Observable<any> {
    const url = API_CONFIG.ADD_EMPLOYEE + orgId.toString();
    return this.HTTP.get(url);
  }

  getEmployeeDetails(orgId: any, empId: any): Observable<any> {
    const url =
      API_CONFIG.ADD_EMPLOYEE +
      '&organization_id=' +
      orgId +
      '&desg_id=' +
      empId;
    return this.HTTP.get(url);
  }

  deleteEmployee(delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.ADD_EMPLOYEE +
      'method=delete&id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url);
  }

  editEmployee(body: any, delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.ADD_EMPLOYEE +
      'method=edit&id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url, body);
  }

  importUserData(body: any): Observable<any> {
    const url = API_CONFIG.IMPORT_USER;
    return this.HTTP.post(url, body);
  }

  mapUser(body: any, orgId: any): Observable<any> {
    const url = API_CONFIG.MAP_USER + 'organization_id=' + orgId;
    return this.HTTP.post(url, body);
  }

  mapMaterialIssue(body: any, orgId: any): Observable<any> {
    const url = API_CONFIG.MAP_ISSUE + 'organization_id=' + orgId;
    return this.HTTP.post(url, body);
  }

  mapMaterialGRN(body: any, orgId: any): Observable<any> {
    const url = API_CONFIG.IMPORT_GRN + 'organization_id=' + orgId;
    return this.HTTP.post(url, body);
  }

  getRoleList(request: string): Observable<any> {
    const url = API_CONFIG.ROLE_PERMISSION_CRUD + '?' + request;
    return this.HTTP.get(url);
  }

  addRole(request: any): Observable<any> {
    const url = API_CONFIG.ROLE_PERMISSION_CRUD;
    return this.HTTP.post(url, request);
  }

  deleteRole(request: string): Observable<any> {
    const url = API_CONFIG.ROLE_PERMISSION_CRUD + '?' + request;
    return this.HTTP.put(url);
  }
  createPermissions(request: any): Observable<any> {
    const url = API_CONFIG.CREATE_PERMISSIONS;
    return this.HTTP.post(url, request);
  }

  updateRolePermissions(request: any): Observable<any> {
    const url = API_CONFIG.CREATE_PERMISSIONS;
    return this.HTTP.put(url, request);
  }

  updateUserPermissions(request: any): Observable<any> {
    const url = API_CONFIG.CREATE_USER_PERMISSIONS;
    return this.HTTP.put(url, request);
  }

  updateRoleName(requesturl: string, reqData: any): Observable<any> {
    const url = API_CONFIG.ROLE_PERMISSION_CRUD + '?' + requesturl;
    return this.HTTP.put(url, reqData);
  }

  getpermissionMenuLIST(): Observable<any> {
    const url = API_CONFIG.ROLE_PERMISSION_MENU;
    return this.HTTP.get(url);
  }

  getAdministrativMenuLIST(): Observable<any> {
    const url = API_CONFIG.ROLE_PERMISSION_ADMIS_MENU;
    return this.HTTP.get(url);
  }

  getSettingsMenuLIST(): Observable<any> {
    const url = API_CONFIG.SETTINGS_PERMISSION_MENU;
    return this.HTTP.get(url);
  }

  getModulePermissionMenuLIST(): Observable<any> {
    const url = API_CONFIG.MODULE_PERMISSION_LIST;
    return this.HTTP.get(url);
  }

  getroleDetails(request: any): Observable<any> {
    const url = API_CONFIG.ROLE_PERMISSION_CRUD + '?' + request;
    return this.HTTP.get(url);
  }

  getUserList(request: string): Observable<any> {
    const url = API_CONFIG.USER_LIST + '?' + request;
    return this.HTTP.get(url);
  }

  getDeletedUserList(request: string): Observable<any> {
    const url = API_CONFIG.DELETED_USER_LIST + '?' + request;
    return this.HTTP.get(url);
  }

  RetriveUser(delId: any): Observable<any> {
    const url = API_CONFIG.DELETE_USER + 'method=undelete&id=' + delId;
    return this.HTTP.put(url);
  }

  searchUserList(
    request: string,
    department: any,
    designation: any,
    zone: any,
    role: any,
    emptype: any,
    state: any,
    city: any,
    company: any
  ): Observable<any> {
    const url =
      API_CONFIG.USER_LIST +
      '?' +
      request +
      '&' +
      department +
      '&' +
      designation +
      '&' +
      zone +
      '&' +
      role +
      '&' +
      emptype +
      '&' +
      state +
      '&' +
      city +
      '&company_id=' +
      company;
    return this.HTTP.get(url);
  }

  deleteTheUser(delId: any): Observable<any> {
    const url = API_CONFIG.DELETE_USER + 'method=delete&id=' + delId;
    return this.HTTP.put(url);
  }

  addUser(request: any): Observable<any> {
    const url = API_CONFIG.ADD_USER;
    return this.HTTP.post(url, request);
  }
  updateUser(request: any, userId: any): Observable<any> {
    const url = API_CONFIG.UPDATE_USER + userId + '/';
    return this.HTTP.put(url, request);
  }

  getRestrictDataList(id: any): Observable<any> {
    const url = API_CONFIG.RESTRICT_ITEM + id.toString();
    return this.HTTP.get(url);
  }

  addRestrictItem(param: any, request: any): Observable<any> {
    const url = API_CONFIG.RESTRICT_ITEM + param.toString();
    return this.HTTP.post(url, request);
  }

  addBulkItem(request: any): Observable<any> {
    const url = API_CONFIG.BULK_ITEM_MASTER;
    return this.HTTP.post(url, request);
  }

  deleteRestrictGroup(request: any): Observable<any> {
    const url = API_CONFIG.RESTRICT_ITEM + request;
    return this.HTTP.put(url);
  }

  getGroupList(request: any): Observable<any> {
    const url = API_CONFIG.GROUP_LIST + '?' + request.toString();
    return this.HTTP.get(url);
  }
  addGroupList(request: any): Observable<any> {
    const url = API_CONFIG.GROUP_LIST;
    return this.HTTP.post(url, request);
  }
  updateGroupList(req: any, editId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.GROUP_LIST +
      '?' +
      'method=edit&id=' +
      editId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url, req);
  }
  deleteGroup(delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.GROUP_LIST +
      '?' +
      'method=delete&id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url);
  }
  userActivityList(userId: any): Observable<any> {
    const url = API_CONFIG.USER_ACTIVITY_LIST + '?' + userId.toString();
    return this.HTTP.get(url);
  }

  getActivityTracker(userId: any): Observable<any> {
    const url = API_CONFIG.ACTIVITY_TRACKER + '?' + userId.toString();
    return this.HTTP.get(url);
  }

  getRoleTreeData(orgId: any): Observable<any> {
    const url = API_CONFIG.ROLE_TREE_DATA + orgId.toString();
    return this.HTTP.get(url);
  }
  getMenuList(req: any): Observable<any> {
    const url = API_CONFIG.MENU_LIST + req.toString();
    return this.HTTP.get(url);
  }
  getMenuFormList(req: any): Observable<any> {
    const url = API_CONFIG.MENU_FORM_LIST + req.toString();
    return this.HTTP.get(url);
  }
  getPlanningMenuFormList(req: any): Observable<any> {
    const url = API_CONFIG.PLANNING_MENU_FORM_LIST + req.toString();
    return this.HTTP.get(url);
  }
  getDynamicForm(req: any): Observable<any> {
    const url = API_CONFIG.DYNAMIC_FORM_GROUP + req.toString();
    return this.HTTP.get(url);
  }

  getRiskDetails(query: any, selectedTab: any): Observable<any> {
    if (selectedTab == 'Tender') {
      const url = API_CONFIG.TENDER_RISK + query.toString();
      return this.HTTP.get(url);
    } else {
      const url = API_CONFIG.PLANNING_RISK + query.toString();
      return this.HTTP.get(url);
    }
  }

  getOpportunityDetails(query: any, selectedTab: any): Observable<any> {
    if (selectedTab == 'Tender') {
      const url = API_CONFIG.TENDER_OPPORTUNITY + query.toString();
      return this.HTTP.get(url);
    } else {
      const url = API_CONFIG.PLANNING_OPPORTUNITY + query.toString();
      return this.HTTP.get(url);
    }
  }

  getComplianceDetails(query: any, selectedTab: any): Observable<any> {
    if (selectedTab == 'Tender') {
      const url = API_CONFIG.TENDER_DERIVATIVE + query.toString();
      return this.HTTP.get(url);
    } else {
      const url = API_CONFIG.PLANNING_DERIVATIVE + query.toString();
      return this.HTTP.get(url);
    }
  }

  postDynamicForm(req: any): Observable<any> {
    const url = API_CONFIG.DYNAMIC_FORM_GROUP;
    return this.HTTP.post(url, req);
  }
  deleteGroupData(delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.DYNAMIC_FORM_GROUP +
      'method=delete&id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url);
  }
  putDynamicForm(request: any, editId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.DYNAMIC_FORM_GROUP +
      'method=edit&id=' +
      editId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url, request);
  }
  getDetailsForm(req: any): Observable<any> {
    const url = API_CONFIG.DYNAMIC_FORM + req.toString() + '&is_config=true';
    return this.HTTP.get(url);
  }
  addNewDynamicForm(request: any): Observable<any> {
    const url = API_CONFIG.DYNAMIC_FORM + 'is_config=true';
    return this.HTTP.post(url, request);
  }
  updateDynamicForm(
    request: any,
    editId: any,
    orgId: any,
    groupId: any
  ): Observable<any> {
    const url =
      API_CONFIG.DYNAMIC_FORM +
      'method=edit&id=' +
      editId +
      '&organization_id=' +
      orgId +
      '&form_group_id=' +
      groupId +
      '&is_config=true';
    return this.HTTP.put(url, request);
  }
  deleteTheFormField(delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.DYNAMIC_FORM +
      'method=delete&id=' +
      delId +
      '&organization_id=' +
      orgId +
      '&is_config=true';
    return this.HTTP.put(url);
  }
  checkUncheck(
    request: any,
    formId: any,
    orgId: any,
    groupId: any
  ): Observable<any> {
    const url =
      API_CONFIG.DYNAMIC_FORM +
      'method=update&id=' +
      formId +
      '&organization_id=' +
      orgId +
      '&form_group_id=' +
      groupId +
      '&is_config=true';
    return this.HTTP.put(url, request);
  }

  getWorkFlowData(request: any): Observable<any> {
    const url = API_CONFIG.WORK_FLOW + request;
    return this.HTTP.get(url);
  }

  getAllUserList(request: any): Observable<any> {
    const url = API_CONFIG.NOTIFICATION_USER_LIST + request;
    return this.HTTP.get(url);
  }

  getFilterUserList(request: any): Observable<any> {
    const url = API_CONFIG.USER_FILTER_LIST + request;
    return this.HTTP.get(url);
  }

  addNewNotification(request: any): Observable<any> {
    const url = API_CONFIG.ADD_NOTIFICATION;
    return this.HTTP.post(url, request);
  }

  updateNotification(request: any): Observable<any> {
    const url = API_CONFIG.ADD_NOTIFICATION + '?' + request;
    return this.HTTP.put(url);
  }

  editNotification(paramap: any, request: any): Observable<any> {
    const url = API_CONFIG.ADD_NOTIFICATION + '?' + paramap;
    return this.HTTP.put(url, request);
  }

  getNotificationData(request: any): Observable<any> {
    const url = API_CONFIG.ADD_NOTIFICATION + '?' + request;
    return this.HTTP.get(url);
  }

  postTenderEvents(request: any): Observable<any> {
    const url = API_CONFIG.TENDER_EVENT;
    return this.HTTP.post(url, request);
  }
  deleteEvent(request: any): Observable<any> {
    const url = API_CONFIG.TENDER_EVENT + '?' + request;
    return this.HTTP.put(url);
  }
  updateEvent(request: any, body: any): Observable<any> {
    const url = API_CONFIG.TENDER_EVENT + '?' + request;
    return this.HTTP.put(url, body);
  }
  getTenderEvent(request: any): Observable<any> {
    const url = API_CONFIG.TENDER_EVENT + '?' + request.toString();
    return this.HTTP.get(url);
  }

  updateFromInputOrder(request: any): Observable<any> {
    const url = API_CONFIG.FROMS_CONFIG_CHANGE_ORDER;
    return this.HTTP.post(url, request);
  }

  saveProjectData(query: string, request: any): Observable<any> {
    const url = API_CONFIG.PROJECT_MASTER + query;
    return this.HTTP.put(url, request);
  }

  getProjectData(query: string): Observable<any> {
    const url = API_CONFIG.PROJECT_MASTER + query;
    return this.HTTP.get(url);
  }

  saveJVIncorpData(query: string, request: any): Observable<any> {
    const url = API_CONFIG.PROJECT_MASTER + query;
    return this.HTTP.put(url, request);
  }

  getJVIncorpData(query: string): Observable<any> {
    const url = API_CONFIG.PROJECT_MASTER + query;
    return this.HTTP.get(url);
  }

  saveTenderData(query: string, request: any): Observable<any> {
    const url = API_CONFIG.TENDER_DATA + query;
    return this.HTTP.put(url, request);
  }

  getTenderData(query: string): Observable<any> {
    const url = API_CONFIG.TENDER_DATA + query;
    return this.HTTP.get(url);
  }

  getTenderList(orgId: any): Observable<any> {
    const url = API_CONFIG.TENDER_DATA + orgId.toString();
    return this.HTTP.get(url);
  }

  getTenderSurveyList(orgId: any): Observable<any> {
    const url = API_CONFIG.TENDER_SURVEY_DATA + orgId.toString();
    return this.HTTP.get(url);
  }

  getTenderJVList(orgId: any): Observable<any> {
    const url = API_CONFIG.TENDER_JV_DATA + orgId.toString();
    return this.HTTP.get(url);
  }

  getWbsList(param: any): Observable<any> {
    const url = API_CONFIG.WBS_DATA + param.toString();
    return this.HTTP.get(url);
  }

  addWBSData(query: any, request: any): Observable<any> {
    const url = API_CONFIG.WBS_DATA + query;
    return this.HTTP.post(url, request);
  }

  editWBSData(param: any, request: any): Observable<any> {
    const url = API_CONFIG.WBS_DATA + param;
    return this.HTTP.put(url, request);
  }

  deleteWbs(request: any): Observable<any> {
    const url = API_CONFIG.WBS_DATA + request;
    return this.HTTP.put(url);
  }

  getExecutiveSummaryList(param: any): Observable<any> {
    const url = API_CONFIG.EXECUTIVE_SUMMERY + param.toString();
    return this.HTTP.get(url);
  }

  getExecutiveSummaryListNew(param: any): Observable<any> {
    const url = API_CONFIG.EXECUTIVE_SUMMERY_NEW + param.toString();
    return this.HTTP.get(url);
  }

  editExecutiveSummaryList(param: any, request: any): Observable<any> {
    const url = API_CONFIG.EXECUTIVE_SUMMERY + param;
    return this.HTTP.put(url, request);
  }

  editChainageExecutiveSummaryList(request: any): Observable<any> {
    const url = API_CONFIG.CHAINAGE_EXECUTIVE_SUMMERY;
    return this.HTTP.put(url, request);
  }
  getChainageExecutiveSummaryList(param: any): Observable<any> {
    const url = API_CONFIG.CHAINAGE_EXECUTIVE_SUMMERY + param.toString();
    return this.HTTP.get(url);
  }


  // editSummaryList(request: any): Observable<any> {
  //   const url = API_CONFIG.SUMMERY_LIST;
  //   return this.HTTP.put(url, request);
  // }

  editSummaryList(request: any, table: any, selectedTab: any): Observable<any> {
    if (selectedTab == 'Tender') {
      if (table == 'Risk Details') {
        const url = API_CONFIG.TENDER_RISK;
        return this.HTTP.put(url, request);
      } else if (table == 'Opportunity Details') {
        const url = API_CONFIG.TENDER_OPPORTUNITY;
        return this.HTTP.put(url, request);
      } else if (table == 'Time & Compliance Derivitives') {
        const url = API_CONFIG.TENDER_DERIVATIVE;
        return this.HTTP.put(url, request);
      } else {
        const url = API_CONFIG.SUMMERY_LIST;
        return this.HTTP.put(url, request);
      }
    } else {
      if (table == 'Risk Details') {
        const url = API_CONFIG.EXICUTIVE_COMMITEE;
        return this.HTTP.put(url, request);
      } else if (table == 'Opportunity Details') {
        const url = API_CONFIG.PLANNING_OPPORTUNITY;
        return this.HTTP.put(url, request);
      } else if (table == 'Time & Compliance Derivitives') {
        const url = API_CONFIG.PLANNING_DERIVATIVE;
        return this.HTTP.put(url, request);
      } else {
        const url = API_CONFIG.EXICUTIVE_COMMITEE_FINAL;
        return this.HTTP.put(url, request);
      }
    }
  }

  getSummaryList(param: any): Observable<any> {
    const url = API_CONFIG.SUMMERY_LIST + param.toString();
    return this.HTTP.get(url);
  }
  getSettingList(data: any): Observable<any> {
    const url = API_CONFIG.SETTING_LIST + data.toString();
    return this.HTTP.get(url);
  }
  getNotificationList(data: any): Observable<any> {
    const url = API_CONFIG.NOTIFICATION_LIST + data.toString();
    return this.HTTP.get(url);
  }
  getQualificationList(): Observable<any> {
    const url = API_CONFIG.QUALIFICATION_LIST;
    return this.HTTP.get(url);
  }
  getProfileList(data: any): Observable<any> {
    const url = API_CONFIG.PROFILE_LIST + data.toString();
    return this.HTTP.get(url);
  }
  editProfile(data: any, request: any): Observable<any> {
    const url = API_CONFIG.PROFILE_EDIT + data.toString();
    return this.HTTP.put(url, request);
  }
  addAcademicProfile(data: any, request: any): Observable<any> {
    const url = API_CONFIG.ACADEMIC_ADD + data.toString();
    return this.HTTP.put(url, request);
  }
  addProfessionalProfile(data: any, request: any): Observable<any> {
    const url = API_CONFIG.PROFESSIONAL_ADD + data.toString();
    return this.HTTP.put(url, request);
  }
  addLicenseProfile(data: any, request: any): Observable<any> {
    const url = API_CONFIG.LICENSE_ADD + data.toString();
    return this.HTTP.put(url, request);
  }
  addOtherProfile(data: any, request: any): Observable<any> {
    const url = API_CONFIG.OTHER_ADD + data.toString();
    return this.HTTP.put(url, request);
  }
  getSurveyList(query: string): Observable<any> {
    const url = API_CONFIG.SURVEY_DATA + query;
    return this.HTTP.get(url);
  }

  gettenderUserDetails(tenderID: any): Observable<any> {
    const url = API_CONFIG.TENDER_USER_DETAILS + tenderID.toString();
    return this.HTTP.get(url);
  }

  getEmployeeMasterList(orgId: any): Observable<any> {
    const url = API_CONFIG.EMPLOYEE_MASTER + orgId.toString();
    return this.HTTP.get(url);
  }

  getEmployeeMasterDetailList(orgId: any, compId: any): Observable<any> {
    const url =
      API_CONFIG.EMPLOYEE_MASTER +
      '&organization_id=' +
      orgId +
      '&comp_id=' +
      compId;
    return this.HTTP.get(url);
  }

  deleteEmployeeMaster(delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.EMPLOYEE_MASTER +
      'method=delete&id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url);
  }

  editEmployeeMaster(body: any, delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.EMPLOYEE_MASTER +
      'method=edit&id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url, body);
  }

  addEmployeeMaster(request: any): Observable<any> {
    const url = API_CONFIG.EMPLOYEE_MASTER;
    return this.HTTP.post(url, request);
  }

  getStandaloneMasterList(orgId: any): Observable<any> {
    const url = API_CONFIG.STANDALONE_MASTER + orgId.toString();
    return this.HTTP.get(url);
  }

  getStandaloneMasterDetailList(orgId: any, compId: any): Observable<any> {
    const url =
      API_CONFIG.STANDALONE_MASTER +
      '&organization_id=' +
      orgId +
      '&comp_id=' +
      compId;
    return this.HTTP.get(url);
  }

  deleteStandaloneMaster(delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.STANDALONE_MASTER +
      'method=delete&id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url);
  }

  editStandaloneMaster(body: any, delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.STANDALONE_MASTER +
      'method=edit&id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url, body);
  }

  addStandaloneMaster(request: any): Observable<any> {
    const url = API_CONFIG.STANDALONE_MASTER;
    return this.HTTP.post(url, request);
  }

  getJVMasterList(orgId: any): Observable<any> {
    const url = API_CONFIG.JV_MASTER + orgId.toString();
    return this.HTTP.get(url);
  }

  getJVMasterDetailList(orgId: any, compId: any): Observable<any> {
    const url =
      API_CONFIG.JV_MASTER + '&organization_id=' + orgId + '&comp_id=' + compId;
    return this.HTTP.get(url);
  }

  deleteJVMaster(delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.JV_MASTER +
      'method=delete&id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url);
  }

  editJVMaster(body: any, delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.JV_MASTER +
      'method=edit&id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url, body);
  }

  addJVMaster(request: any): Observable<any> {
    const url = API_CONFIG.JV_MASTER;
    return this.HTTP.post(url, request);
  }

  gettenderUserpermission(): Observable<any> {
    const url = API_CONFIG.TENDER_USER_PERMISSION_DETAILS;
    return this.HTTP.get(url);
  }

  rejectTender(data: any): Observable<any> {
    const url = API_CONFIG.REJECT_TENDER + data.toString();
    return this.HTTP.put(url);
  }

  approveProcurement(data: any, paramap: any): Observable<any> {
    const url = API_CONFIG.PROCUREMENT_APPROVE + paramap.toString();
    return this.HTTP.put(url, data);
  }

  approveIndent(data: any, paramap: any): Observable<any> {
    const url = API_CONFIG.INDENT_APPROVE + paramap.toString();
    return this.HTTP.put(url, data);
  }

  sendbackFromEx(data: any, paramap: any): Observable<any> {
    const url = API_CONFIG.TENDER_REVERSED_EXC + paramap.toString();
    return this.HTTP.put(url, data);
  }

  updateStatus(Requrl: any, method: any): Observable<any> {
    const url = Requrl;
    if (method == 'PUT') {
      return this.HTTP.put(url);
    } else if (method == 'GET') {
      return this.HTTP.get(url);
    } else if (method == 'POST') {
      return this.HTTP.post(url);
    } else if (method == 'GET') {
      return this.HTTP.get(url);
    } else {
      return this.HTTP.put(url);
    }
  }

  savePlantMachineryData(query: string, request: any): Observable<any> {
    const url = API_CONFIG.PLANTMACHINARY_DATA + query;
    return this.HTTP.put(url, request);
  }

  getPlantMachineryList(orgId: any): Observable<any> {
    const url = API_CONFIG.PLANTMACHINARY_DATA + orgId.toString();
    return this.HTTP.get(url);
  }

  delPlantMachinery(delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.PLANTMACHINARY_DATA +
      'method=delete&plant_machinery_id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url);
  }

  getItemWiseVendorList(orgId: any): Observable<any> {
    const url = API_CONFIG.ITEM_WISE_VENDOR + orgId.toString();
    return this.HTTP.get(url);
  }

  saveVendorData(query: string, request: any): Observable<any> {
    const url = API_CONFIG.VENDOR_DATA + query;
    return this.HTTP.put(url, request);
  }

  getVendorList(orgId: any): Observable<any> {
    const url = API_CONFIG.VENDOR_DATA + orgId.toString();
    return this.HTTP.get(url);
  }

  getVendorListNew(orgId: any): Observable<any> {
    const url = API_CONFIG.VENDOE_LIST_NEW + orgId.toString();
    return this.HTTP.get(url);
  }

  venderMerge(request: any, orgId: any): Observable<any> {
    const url = API_CONFIG.VENDOR_MERGE + orgId.toString();
    return this.HTTP.post(url, request);
  }

  delVendor(delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.VENDOR_DATA +
      'method=delete&vendor_id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url);
  }

  getItemType(): Observable<any> {
    const url = API_CONFIG.ITEM_TYPE;
    return this.HTTP.get(url);
  }
  getProductionType(): Observable<any> {
    const url = API_CONFIG.PRODUCTION_TYPE;
    return this.HTTP.get(url);
  }

  getExicutiveCommitee(query: string, selectedTab: any): Observable<any> {
    if (selectedTab == 'tender_executive_commitee') {
      const url = API_CONFIG.EXICUTIVE_COMMITEE + query.toString();
      return this.HTTP.get(url);
    } else {
      const url = API_CONFIG.EXICUTIVE_COMMITEE_FINAL + query.toString();
      return this.HTTP.get(url);
    }
  }

  saveExicutiveCommitee(
    query: string,
    request: any,
    selectedTab: any
  ): Observable<any> {
    if (selectedTab == 'tender_executive_commitee') {
      const url = API_CONFIG.EXICUTIVE_COMMITEE + query.toString();
      return this.HTTP.put(url, request);
    } else {
      const url = API_CONFIG.EXICUTIVE_COMMITEE_FINAL + query.toString();
      return this.HTTP.put(url, request);
    }
  }

  getExicutiveCommiteeApprovar(query: any, selectedTab: any): Observable<any> {
    if (selectedTab == 'tender_executive_commitee') {
      const url = API_CONFIG.EXICUTIVE_COMMITEE_APPROVAR + query.toString();
      return this.HTTP.get(url);
    } else {
      const url =
        API_CONFIG.EXICUTIVE_COMMITEE_APPROVAR_FINAL + query.toString();
      return this.HTTP.get(url);
    }
  }

  saveExicutiveCommiteeApproval(
    query: any,
    request: any,
    selectedTab: any
  ): Observable<any> {
    if (selectedTab == 'tender_executive_commitee') {
      const url = API_CONFIG.EXICUTIVE_COMMITEE_APPROVAR + query.toString();
      return this.HTTP.put(url, request);
    } else {
      const url =
        API_CONFIG.EXICUTIVE_COMMITEE_APPROVAR_FINAL + query.toString();
      return this.HTTP.put(url, request);
    }
  }

  resendForApploval(query: any): Observable<any> {
    const url = API_CONFIG.RE_SEND_FOR_APPROVAL + query.toString();
    return this.HTTP.put(url);
  }

  addOtherEmployeeName(otherApiUrl: any, request: any): Observable<any> {
    const url = environment.API_URL + otherApiUrl + '/?';
    return this.HTTP.post(url, request);
  }

  getListofKeyScope(query: any) {
    const url = API_CONFIG.LIST_OF_KEY_SCOPE + query.toString();
    return this.HTTP.get(url);
  }

  getTopSheetData(sheetType: any, query: any): Observable<any> {
    if (sheetType == 'Sale') {
      const url = API_CONFIG.TOP_SHEET_SALES_GET + query.toString();
      return this.HTTP.get(url);
    } else {
      const url = API_CONFIG.TOP_SHEET_EXPEND_GET + query.toString();
      return this.HTTP.get(url);
    }
  }

  getTopsheetTotal(query: any) {
    const url = API_CONFIG.TOP_SHEET_TOTAL + query.toString();
    return this.HTTP.get(url);
  }

  topsheetSubmit(req: any): Observable<any> {
    const url = API_CONFIG.TOP_SHEET_SUBMIT;
    return this.HTTP.put(url, req);
  }

  uploadTopSheet(sheetType: any, payload: any): Observable<any> {
    if (sheetType == 'Sale') {
      const url = API_CONFIG.TOP_SHEET_SALES_UPLOAD;
      return this.HTTP.put(url, payload);
    } else {
      const url = API_CONFIG.TOP_SHEET_EXPEND_UPLOAD;
      return this.HTTP.put(url, payload);
    }
  }

  getProjectList(orgId: any): Observable<any> {
    const url = API_CONFIG.PROJECT_DATA + orgId.toString();
    return this.HTTP.get(url);
  }

  getTenderSearchForm(req: any): Observable<any> {
    const url = API_CONFIG.DYNAMIC_FORM + req.toString();
    return this.HTTP.get(url);
  }

  getUseDetails(req: any): Observable<any> {
    const url = API_CONFIG.USED_DETAILS + req.toString();
    return this.HTTP.get(url);
  }

  mergeUOMData(request: any): Observable<any> {
    const url = API_CONFIG.MERGE_DATA;
    return this.HTTP.post(url, request);
  }

  getUOMList(orgId: any): Observable<any> {
    const url = API_CONFIG.UOM_MASTER + orgId.toString();
    return this.HTTP.get(url);
  }

  addUOMData(request: any): Observable<any> {
    const url = API_CONFIG.UOM_MASTER;
    return this.HTTP.post(url, request);
  }

  editUOMData(param: any, request: any): Observable<any> {
    const url = API_CONFIG.UOM_MASTER + param;
    return this.HTTP.put(url, request);
  }

  deleteUOMData(request: any): Observable<any> {
    const url = API_CONFIG.UOM_MASTER + request;
    return this.HTTP.put(url);
  }

  getFinancialYearLockDetails(query: any): Observable<any> {
    const url = API_CONFIG.FINANCIAL_YEAR_LOCK + query.toString();
    return this.HTTP.get(url);
  }

  addEditFinancialYearLockDetails(query: any, request: any): Observable<any> {
    const url = API_CONFIG.FINANCIAL_YEAR_LOCK + query.toString();
    return this.HTTP.post(url, request);
  }

  deleteFinancialYearLockDetails(query: any, request: any): Observable<any> {
    const url = API_CONFIG.FINANCIAL_YEAR_LOCK + query.toString();
    return this.HTTP.put(url, request);
  }

  getMaterialTypeList(id: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_TYPE + id.toString();
    return this.HTTP.get(url);
  }

  getMaterialSubTypeList(id: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_SUB_TYPE + id.toString();
    return this.HTTP.get(url);
  }

  addMaterialSubType(request: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_SUB_TYPE;
    return this.HTTP.post(url, request);
  }

  editMaterialSubType(param: any, request: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_SUB_TYPE + param;
    return this.HTTP.put(url, request);
  }

  getMaterialCostHeadList(id: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_COST_HEAD + id.toString();
    return this.HTTP.get(url);
  }
  getNature_PropertiesList(id: any): Observable<any> {
    const url = API_CONFIG.NATURE_PROPERTIES + id.toString();
    return this.HTTP.get(url);
  }
  addMaterial(request: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_MASTER;
    return this.HTTP.post(url, request);
  }
  editMaterial(param: any, request: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_MASTER + param;
    return this.HTTP.put(url, request);
  }

  getMaterialManagementList(req: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_MASTER + req.toString();
    return this.HTTP.get(url);
  }

  getHSNList(req: any): Observable<any> {
    const url = API_CONFIG.HSN_CODE + req.toString();
    return this.HTTP.get(url);
  }

  deleteMaterial(request: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_MASTER + request;
    return this.HTTP.put(url);
  }

  addMaterialTypeData(request: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_TYPE_MASTER;
    return this.HTTP.post(url, request);
  }

  editMaterialTypeData(param: any, request: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_TYPE_MASTER + param;
    return this.HTTP.put(url, request);
  }

  deleteMaterialTypeData(request: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_TYPE_MASTER + request;
    return this.HTTP.put(url);
  }

  getMaterialCostList(orgId: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_TYPE_COST + orgId.toString();
    return this.HTTP.get(url);
  }

  addMaterialCostData(request: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_TYPE_COST;
    return this.HTTP.post(url, request);
  }

  editMaterialCostData(param: any, request: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_TYPE_COST + param;
    return this.HTTP.put(url, request);
  }

  deleteMaterialCostData(request: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_TYPE_COST + request;
    return this.HTTP.put(url);
  }

  getMaterialNature(orgId: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_NATURE + orgId.toString();
    return this.HTTP.get(url);
  }

  addMaterialNature(request: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_NATURE;
    return this.HTTP.post(url, request);
  }

  editMaterialNature(param: any, body: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_NATURE + param;
    return this.HTTP.put(url, body);
  }

  deleteMaterialNature(request: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_NATURE + request;
    return this.HTTP.put(url);
  }

  getJVAnalytics(req: any): Observable<any> {
    const url = API_CONFIG.JV_ANALYTICS + req.toString();
    return this.HTTP.get(url);
  }
  getJVAnalytics1(req: any): Observable<any> {
    const url = API_CONFIG.JV_ANALYTICS1 + req.toString();
    return this.HTTP.get(url);
  }
  getdeptHeadList(id: any): Observable<any> {
    const url = API_CONFIG.DEPARTMENT_HEAD + id.toString();
    return this.HTTP.get(url);
  }

  addPlanningHead(body: any): Observable<any> {
    const url = API_CONFIG.PLANNING_HEAD_SELECTION;
    return this.HTTP.put(url, body);
  }

  addStripAchivedDate(body: any): Observable<any> {
    const url = API_CONFIG.STRIP_ACHIVEMENT_PLAN;
    return this.HTTP.put(url, body);
  }

  addProjectHead(body: any): Observable<any> {
    const url = API_CONFIG.PROJECT_HEAD_SELECTION;
    return this.HTTP.put(url, body);
  }

  completeSurvey(request: any): Observable<any> {
    const url = API_CONFIG.SURVEY_COMPLETE;
    return this.HTTP.put(url, request);
  }

  rolewiseSurveyComplete(request: any): Observable<any> {
    const url = API_CONFIG.ROLEWISE_SURVEY_COMPLETE;
    return this.HTTP.put(url, request);
  }

  addDelayreason(request: any): Observable<any> {
    const url = API_CONFIG.ADD_DELAYREASON;
    return this.HTTP.post(url, request);
  }

  getDelayreason(orgId: any): Observable<any> {
    const url = API_CONFIG.ADD_DELAYREASON + orgId.toString();
    return this.HTTP.get(url);
  }

  getDelayreasondetails(orgId: any, delayId: any): Observable<any> {
    // const url = API_CONFIG.ADD_DEPARTMENT + '&organization_id=' + orgId + '&dept_id=' + deptId;

    const url =
      API_CONFIG.ADD_DELAYREASON +
      '&organization_id=' +
      orgId +
      '&id=' +
      delayId;
    return this.HTTP.get(url);
  }

  deleteDelayreason(delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.ADD_DELAYREASON +
      'method=delete&id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url);
  }

  editDelayreason(body: any, delId: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.ADD_DELAYREASON +
      'method=edit&id=' +
      delId +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url, body);
  }

  getPlanningRiskDetails(query: any): Observable<any> {
    const url = API_CONFIG.PLANNING_RISk_APPROVAL + query.toString();
    return this.HTTP.get(url);
  }

  getPlanningRiskDiary(query: any): Observable<any> {
    const url = API_CONFIG.PLANNING_RISK_DIARY + query.toString();
    return this.HTTP.get(url);
  }

  editDelayMisTableList(param: any): Observable<any> {
    const url = API_CONFIG.PLANNING_RISK_DIARY;
    return this.HTTP.put(url, param);
  }

  editPlanningRiskDetails(query: any, reqest: any): Observable<any> {
    const url = API_CONFIG.PLANNING_RISk_APPROVAL + query.toString();
    return this.HTTP.put(url, reqest);
  }

  getStripData(query: any): Observable<any> {
    const url = API_CONFIG.PLANNIG_STRIP_DATA + query.toString();
    return this.HTTP.get(url);
  }

  getStripDetaails(query: any): Observable<any> {
    const url = API_CONFIG.STRIP_DETAILS + query.toString();
    return this.HTTP.get(url);
  }

  stripConfigAdd(query: any, body: any): Observable<any> {
    const url = API_CONFIG.WBS_STRIP_CONFIG + query.toString();
    return this.HTTP.post(url, body);
  }

  stripConfigUpdate(query: any, body: any): Observable<any> {
    const url = API_CONFIG.WBS_STRIP_CONFIG + query.toString();
    return this.HTTP.put(url, body);
  }

  getStripChainage(query: any): Observable<any> {
    const url = API_CONFIG.STRIP_CHAIN_LIST + query.toString();
    return this.HTTP.get(url);
  }

  addStripData(reqest: any): Observable<any> {
    const url = API_CONFIG.STRIP_MODIFY;
    return this.HTTP.post(url, reqest);
  }

  addstripAchive(reqest: any): Observable<any> {
    const url = API_CONFIG.STRIP_ADD_ACHIUVE;
    return this.HTTP.post(url, reqest);
  }

  modifyStripData(query: any, reqest: any): Observable<any> {
    const url = API_CONFIG.STRIP_MODIFY + query.toString();
    return this.HTTP.put(url, reqest);
  }

  getLabourMasterList(orgId: any): Observable<any> {
    const url = API_CONFIG.LABOUR_MASTER + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  addLabourMaster(req: any): Observable<any> {
    const url = API_CONFIG.LABOUR_MASTER;
    return this.HTTP.post(url, req);
  }

  editLabourMaster(body: any, id: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.LABOUR_MASTER +
      '?' +
      'organization_id=' +
      orgId +
      '&method=edit&id=' +
      id;
    return this.HTTP.put(url, body);
  }

  deleteLabourMaster(id: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.LABOUR_MASTER +
      '?' +
      'organization_id=' +
      orgId +
      '&method=delete&id=' +
      id;
    return this.HTTP.put(url);
  }

  addBOQ(query: any, req: any): Observable<any> {
    const url = API_CONFIG.BOQ_PMS + query.toString();
    return this.HTTP.post(url, req);
  }

  editBOQ(query: any, req: any): Observable<any> {
    const url = API_CONFIG.BOQ_PMS + query.toString();
    return this.HTTP.put(url, req);
  }

  getBOQList(param: any): Observable<any> {
    const url = API_CONFIG.BOQ_PMS + param.toString();
    return this.HTTP.get(url);
  }

  addBOQWbsList(query: any, req: any): Observable<any> {
    const url = API_CONFIG.BOQ_WBS + query.toString();
    return this.HTTP.post(url, req);
  }

  editBOQWbsList(query: any, req: any): Observable<any> {
    const url = API_CONFIG.BOQ_WBS + query.toString();
    return this.HTTP.put(url, req);
  }

  getBOQWbsList(param: any): Observable<any> {
    const url = API_CONFIG.BOQ_WBS + param.toString();
    return this.HTTP.get(url);
  }

  addBOQWbsLabour(query: any, req: any): Observable<any> {
    const url = API_CONFIG.BOQ_WBS_LABOUR + query.toString();
    return this.HTTP.post(url, req);
  }

  editBOQWbsLabour(query: any, req: any): Observable<any> {
    const url = API_CONFIG.BOQ_WBS_LABOUR + query.toString();
    return this.HTTP.put(url, req);
  }

  getBOQWbsLabour(param: any): Observable<any> {
    const url = API_CONFIG.BOQ_WBS_LABOUR + param.toString();
    return this.HTTP.get(url);
  }

  addBOQWbsMaterial(query: any, req: any): Observable<any> {
    const url = API_CONFIG.BOQ_WBS_MATERIAL + query.toString();
    return this.HTTP.post(url, req);
  }

  editBOQWbsMaterial(query: any, req: any): Observable<any> {
    const url = API_CONFIG.BOQ_WBS_MATERIAL + query.toString();
    return this.HTTP.put(url, req);
  }

  getBOQWbsMaterial(param: any): Observable<any> {
    const url = API_CONFIG.BOQ_WBS_MATERIAL + param.toString();
    return this.HTTP.get(url);
  }

  addBOQWbsPne(query: any, req: any): Observable<any> {
    const url = API_CONFIG.BOQ_WBS_PNE + query.toString();
    return this.HTTP.post(url, req);
  }

  editBOQWbsPne(query: any, req: any): Observable<any> {
    const url = API_CONFIG.BOQ_WBS_PNE + query.toString();
    return this.HTTP.put(url, req);
  }

  getBOQWbsPne(param: any): Observable<any> {
    const url = API_CONFIG.BOQ_WBS_PNE + param.toString();
    return this.HTTP.get(url);
  }

  addBOQWbsIDC(query: any, req: any): Observable<any> {
    const url = API_CONFIG.BOQ_WBS_IDC + query.toString();
    return this.HTTP.post(url, req);
  }

  editBOQWbsIDC(query: any, req: any): Observable<any> {
    const url = API_CONFIG.BOQ_WBS_IDC + query.toString();
    return this.HTTP.put(url, req);
  }

  getBOQWbsIDC(param: any): Observable<any> {
    const url = API_CONFIG.BOQ_WBS_IDC + param.toString();
    return this.HTTP.get(url);
  }

  getBOQDETAILS(param: any): Observable<any> {
    const url = API_CONFIG.BOQ_DETAILS + param.toString();
    return this.HTTP.get(url);
  }

  getIndirectCostCategoryList(orgId: any): Observable<any> {
    const url = API_CONFIG.INDIRECT_COST_CATEGORY + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  addIndirectCostCategory(req: any): Observable<any> {
    const url = API_CONFIG.INDIRECT_COST_CATEGORY;
    return this.HTTP.post(url, req);
  }

  editIndirectCostCategory(body: any, orgId: any, id: any): Observable<any> {
    const url =
      API_CONFIG.INDIRECT_COST_CATEGORY +
      '?' +
      'organization_id=' +
      orgId +
      '&method=edit&id=' +
      id;
    return this.HTTP.put(url, body);
  }

  deleteIndirectCostCategory(orgId: any, id: any): Observable<any> {
    const url =
      API_CONFIG.INDIRECT_COST_CATEGORY +
      '?' +
      'organization_id=' +
      orgId +
      '&method=delete&id=' +
      id;
    return this.HTTP.put(url);
  }

  getIndirectCostMasterList(orgId: any): Observable<any> {
    const url = API_CONFIG.INDIRECT_COST_MASTER + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  addIndirectCostMaster(req: any): Observable<any> {
    const url = API_CONFIG.INDIRECT_COST_MASTER;
    return this.HTTP.post(url, req);
  }

  editIndirectCostMaster(body: any, orgId: any, id: any): Observable<any> {
    const url =
      API_CONFIG.INDIRECT_COST_MASTER +
      '?' +
      'organization_id=' +
      orgId +
      '&method=edit&id=' +
      id;
    return this.HTTP.put(url, body);
  }

  deleteIndirectCostMaster(orgId: any, id: any): Observable<any> {
    const url =
      API_CONFIG.INDIRECT_COST_MASTER +
      '?' +
      'organization_id=' +
      orgId +
      '&method=delete&id=' +
      id;
    return this.HTTP.put(url);
  }

  getRackMasterList(orgId: any): Observable<any> {
    const url = API_CONFIG.RACK_MASTER_LIST + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  addRacMaster(req: any): Observable<any> {
    const url = API_CONFIG.ADD_RACK_MASTER;
    return this.HTTP.post(url, req);
  }

  editRackMaster(body: any, orgId: any, id: any): Observable<any> {
    const url =
      API_CONFIG.ADD_RACK_MASTER +
      '?' +
      'organization_id=' +
      orgId +
      '&method=edit&id=' +
      id;
    return this.HTTP.put(url, body);
  }

  deleteRackMaster(orgId: any, id: any): Observable<any> {
    const url =
      API_CONFIG.ADD_RACK_MASTER +
      '?' +
      'organization_id=' +
      orgId +
      '&method=delete&id=' +
      id;
    return this.HTTP.put(url);
  }

  getBrandList(orgId: any): Observable<any> {
    const url = API_CONFIG.BRAND_LIST + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  addBrand(req: any): Observable<any> {
    const url = API_CONFIG.ADD_BRAND;
    return this.HTTP.post(url, req);
  }

  editBrand(body: any, orgId: any, id: any): Observable<any> {
    const url = API_CONFIG.EDIT_BRAND + '?' + '&method=edit&id=' + id;
    return this.HTTP.put(url, body);
  }

  deleteBrand(orgId: any, id: any): Observable<any> {
    const url =
      API_CONFIG.DELETE_BRAND +
      '?' +
      'organization_id=' +
      orgId +
      '&method=delete&id=' +
      id;
    return this.HTTP.put(url);
  }

  getExpenseMasterList(orgId: any): Observable<any> {
    const url = API_CONFIG.EXPENSE_LIST + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  addExpense(req: any): Observable<any> {
    const url = API_CONFIG.ADD_EXPENSE;
    return this.HTTP.post(url, req);
  }

  editExpense(body: any, orgId: any, id: any): Observable<any> {
    const url =
      API_CONFIG.EDIT_EXPENSE +
      '?' +
      'organization_id=' +
      orgId +
      '&method=edit&id=' +
      id;
    return this.HTTP.put(url, body);
  }

  deleteExpense(orgId: any, id: any): Observable<any> {
    const url =
      API_CONFIG.DELETE_EXPENSE +
      '?' +
      'organization_id=' +
      orgId +
      '&method=delete&id=' +
      id;
    return this.HTTP.put(url);
  }

  getRackSettingList(orgId: any): Observable<any> {
    const url = API_CONFIG.RACK_SETTING_LIST + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  addRacSettings(req: any): Observable<any> {
    const url = API_CONFIG.ADD_RACK_SETTING;
    return this.HTTP.post(url, req);
  }

  editRackSetting(body: any, orgId: any, id: any): Observable<any> {
    const url =
      API_CONFIG.ADD_RACK_SETTING +
      '?' +
      'organization_id=' +
      orgId +
      '&method=edit&id=' +
      id;
    return this.HTTP.put(url, body);
  }

  deleteRackSetting(orgId: any, id: any): Observable<any> {
    const url =
      API_CONFIG.ADD_RACK_SETTING +
      '?' +
      'organization_id=' +
      orgId +
      '&method=delete&id=' +
      id;
    return this.HTTP.put(url);
  }

  getTransportRateList(orgId: any): Observable<any> {
    const url = API_CONFIG.TRANSPORT_RATE_LIST + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  addTransportRate(req: any): Observable<any> {
    const url = API_CONFIG.ADD_TRANSPORT_RATE;
    return this.HTTP.post(url, req);
  }

  editTransportRate(body: any, orgId: any, id: any): Observable<any> {
    const url =
      API_CONFIG.ADD_TRANSPORT_RATE +
      '?' +
      'organization_id=' +
      orgId +
      '&method=edit&id=' +
      id;
    return this.HTTP.put(url, body);
  }

  deleteTransportRate(orgId: any, id: any): Observable<any> {
    const url =
      API_CONFIG.ADD_TRANSPORT_RATE +
      '?' +
      'organization_id=' +
      orgId +
      '&method=delete&id=' +
      id;
    return this.HTTP.put(url);
  }

  getTermsAndConditionsList(orgId: any): Observable<any> {
    const url = API_CONFIG.TERMS_AND_CONDITIONS + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  getTermsAndConditionsChild(orgId: any): Observable<any> {
    const url = API_CONFIG.TERMS_AND_CONDITIONS_CHILD + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  editExistingTerms(body: any, orgId: any, id: any): Observable<any> {
    const url =
      API_CONFIG.EDIT_TRANSPORT_RATE +
      '?' +
      'organization_id=' +
      orgId +
      '&method=edit&id=' +
      id;
    return this.HTTP.put(url, body);
  }

  editTermsChild(body: any, orgId: any, id: any): Observable<any> {
    const url =
      API_CONFIG.EDIT_TERMS_CHILD +
      '?' +
      'organization_id=' +
      orgId +
      '&method=edit&id=' +
      id;
    return this.HTTP.put(url, body);
  }

  addNewTerm(req: any): Observable<any> {
    const url = API_CONFIG.ADD_NEW_TERM;
    return this.HTTP.post(url, req);
  }

  deleteTermsChild(orgId: any, id: any): Observable<any> {
    const url =
      API_CONFIG.DELETE_TRANSPORT_RATE_CHILD + '?' + 'method=delete&id=' + id;
    return this.HTTP.put(url);
  }

  getLabTestingList(orgId: any): Observable<any> {
    const url = API_CONFIG.LAB_TESTING_LIST + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  addLabTesting(req: any): Observable<any> {
    const url = API_CONFIG.ADD_LAB_TESTING;
    return this.HTTP.post(url, req);
  }

  editLabTesting(body: any, orgId: any, id: any): Observable<any> {
    const url =
      API_CONFIG.EDIT_LAB_TESTING +
      '?' +
      'organization_id=' +
      orgId +
      '&method=edit&id=' +
      id;
    return this.HTTP.put(url, body);
  }

  deleteLabTesting(orgId: any, id: any): Observable<any> {
    const url =
      API_CONFIG.DELETE_LAB_TESTING +
      '?' +
      'organization_id=' +
      orgId +
      '&method=delete&id=' +
      id;
    return this.HTTP.put(url);
  }

  getProcurementSiteList(orgId: any): Observable<any> {
    const url = API_CONFIG.PROCUREMENT_SITE + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  getWorkOrderList(orgId: any): Observable<any> {
    const url = API_CONFIG.WORK_ORDER + orgId.toString();
    return this.HTTP.get(url);
  }

  getAccountHeads(query: any): Observable<any> {
    const url = API_CONFIG.ACCOUNT_HEADS + query.toString();
    return this.HTTP.get(url);
  }

  getDepreciationGroupList(orgId: any): Observable<any> {
    const url = API_CONFIG.DEPRECIATION_GROUP + orgId.toString();
    return this.HTTP.get(url);
  }

  addDepretiation(req: any): Observable<any> {
    const url = API_CONFIG.DEPRECIATION_GROUP;
    return this.HTTP.post(url, req);
  }

  editDepretiation(body: any, id: any): Observable<any> {
    const url = API_CONFIG.DEPRECIATION_GROUP + 'method=edit&id=' + id;
    return this.HTTP.put(url, body);
  }

  deleteDepretiation(id: any): Observable<any> {
    const url = API_CONFIG.DEPRECIATION_GROUP + 'method=delete&id=' + id;
    return this.HTTP.put(url);
  }

  addProcurementSite(req: any): Observable<any> {
    const url = API_CONFIG.PROCUREMENT_SITE;
    return this.HTTP.post(url, req);
  }

  addProcurementMR(query: any, reqbody: any): Observable<any> {
    const url = API_CONFIG.PROCUREMENT_MR + query.toString();
    return this.HTTP.post(url, reqbody);
  }

  updateProcurementMR(query: any, reqbody: any): Observable<any> {
    const url = API_CONFIG.PROCUREMENT_MR + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  editProcurementSite(body: any, id: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.PROCUREMENT_SITE +
      '?' +
      'method=edit&id=' +
      id +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url, body);
  }

  deleteProcurementSite(id: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.PROCUREMENT_SITE +
      '?' +
      'method=delete&id=' +
      id +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url);
  }

  getProjectStoreList(orgId: any): Observable<any> {
    const url = API_CONFIG.PROJECT_STORE + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  deleteProjectStore(id: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.PROJECT_STORE +
      '?' +
      'method=delete&id=' +
      id +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url);
  }

  addProjectStore(req: any): Observable<any> {
    const url = API_CONFIG.PROJECT_STORE;
    return this.HTTP.post(url, req);
  }

  editProjectStore(body: any, id: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.PROJECT_STORE +
      '?' +
      'method=edit&id=' +
      id +
      '&organization_id=' +
      orgId;
    return this.HTTP.put(url, body);
  }

  getProcurementMaterialRequest(orgId: any): Observable<any> {
    const url =
      API_CONFIG.PROCUREMENT_MATERIAL_REQUEST + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  getProcurementIndentRequest(orgId: any): Observable<any> {
    const url = API_CONFIG.PROCUREMENT_INDENT_REQUEST + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  getProcurementPhysicalStock(orgId: any): Observable<any> {
    const url = API_CONFIG.PROCUREMENT_PHYSICAL_STOCK + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  addPhysicalStock(req: any): Observable<any> {
    const url = API_CONFIG.PROCUREMENT_PHYSICAL_STOCK;
    return this.HTTP.post(url, req);
  }

  getChainageList(req: any): Observable<any> {
    const url = API_CONFIG.CHAINAGE_LISTS + req.toString();
    return this.HTTP.get(url);
  }

  getAccountsCostMaster(req: any): Observable<any> {
    const url = API_CONFIG.ACCOUNTS_PROJECT_COST_MASTER + req.toString();
    return this.HTTP.get(url);
  }

  addAccountsBudget(req: any): Observable<any> {
    const url = `${API_CONFIG.ACCOUNTS_PROJECT_BUDGET}?hideLoader=true`;
    return this.HTTP.post(url, req);
  }

  getAccountsBudget(req: any): Observable<any> {
    const url = API_CONFIG.ACCOUNTS_PROJECT_BUDGET + '?' + req.toString();
    return this.HTTP.get(url);
  }

  updateAccountsBudget(req: any, id: any, orgId: any): Observable<any> {
    const url = `${API_CONFIG.ACCOUNTS_PROJECT_BUDGET}?method=edit&id=${id}&organization=${orgId}&hideLoader=true`;
    return this.HTTP.put(url, req);
  }

  deleteAccountsBudget(id: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.ACCOUNTS_PROJECT_BUDGET +
      '?' +
      'method=delete&id=' +
      id +
      '&organization=' +
      orgId;
    return this.HTTP.put(url);
  }

  updateAccountsBudgetOrdering(req: any): Observable<any> {
    const url = `${API_CONFIG.ACCOUNTS_UPDATE_ORDERING}method=update-order&hideLoader=true`;
    return this.HTTP.put(url, req);
  }

  addChainageDetails(request: any): Observable<any> {
    const url = API_CONFIG.CHAINAGE_DETAILS;
    return this.HTTP.post(url, request);
  }

  getChainageDetails(req: any): Observable<any> {
    const url = API_CONFIG.CHAINAGE_DETAILS + '?' + req.toString();
    return this.HTTP.get(url);
  }

  editChainageDetails(id: any, request: any): Observable<any> {
    const url = API_CONFIG.CHAINAGE_DETAILS + '?' + 'method=edit&id=' + id;
    return this.HTTP.put(url, request);
  }

  deleteChainageDetails(id: any): Observable<any> {
    const url = API_CONFIG.CHAINAGE_DETAILS + '?' + 'method=delete&id=' + id;
    return this.HTTP.put(url);
  }

  getComments(req: any): Observable<any> {
    const url = API_CONFIG.COMMENTS + req.toString();
    return this.HTTP.get(url);
  }

  getMaterialPlan(req: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_PLAN + req.toString();
    return this.HTTP.get(url);
  }

  addBudgetBreakdown(request: any): Observable<any> {
    const url = API_CONFIG.ACCOUNTS_BUDGET_BREAKDOWN;
    return this.HTTP.post(url, request);
  }

  getPDF(request: any): Observable<any> {
    const url = API_CONFIG.GET_PDF;
    return this.HTTP.postBinary(url, request);
  }

  getBudgetBreakdown(req: any): Observable<any> {
    const url = API_CONFIG.ACCOUNTS_BUDGET_BREAKDOWN + '?' + req.toString();
    return this.HTTP.get(url);
  }

  getAccountsMaterialBudget(req: any): Observable<any> {
    const url = API_CONFIG.ACCOUNTS_MATERIAL_BUDGET + '?' + req.toString();
    return this.HTTP.get(url);
  }

  addAccountsMaterialBudget(req: any): Observable<any> {
    const url = `${API_CONFIG.ACCOUNTS_MATERIAL_BUDGET}?hideLoader=true`;
    return this.HTTP.post(url, req);
  }

  updateAccountsMaterialBudget(req: any, id: any, orgId: any): Observable<any> {
    const url = `${API_CONFIG.ACCOUNTS_MATERIAL_BUDGET}?method=edit&id=${id}&organization=${orgId}&hideLoader=true`;
    return this.HTTP.put(url, req);
  }

  updateAccountsMaterialOrdering(req: any): Observable<any> {
    const url = `${API_CONFIG.MATERIAL_UPDATE_ORDERING}method=update-order&hideLoader=true`;
    return this.HTTP.put(url, req);
  }

  deleteAccountsMaterialBudget(id: any, orgId: any): Observable<any> {
    const url =
      API_CONFIG.ACCOUNTS_MATERIAL_BUDGET +
      '?' +
      'method=delete&id=' +
      id +
      '&organization=' +
      orgId;
    return this.HTTP.put(url);
  }

  getCommunicationType(req: any): Observable<any> {
    const url = API_CONFIG.COMMUNICATION_TYPE + req.toString();
    return this.HTTP.get(url);
  }
  getCommunication(req: any): Observable<any> {
    const url = API_CONFIG.COMMUNICATION + '?' + req.toString();
    return this.HTTP.get(url);
  }
  addCommunication(request: any): Observable<any> {
    const url = API_CONFIG.COMMUNICATION;
    return this.HTTP.post(url, request);
  }
  updateCommunication(request: any, param: any): Observable<any> {
    const url = API_CONFIG.COMMUNICATION + '?' + param.toString();
    return this.HTTP.put(url, request);
  }

  approveAccountsMaterialOrdering(req: any, orgId: any): Observable<any> {
    const url = API_CONFIG.MATERIAL_APPROVE + 'type=account-material&organization_id=' + orgId;
    return this.HTTP.put(url, req);
  }

  accountsMaterialBudgetBreakdownBulk(req: any): Observable<any> {
    const url = `${API_CONFIG.ACCOUNTS_MATERIAL_BUDGET_BREAKDOWN_BULK}?hideLoader=true`;
    return this.HTTP.post(url, req);
  }
  getExcelBudget() {
    return this.HTTP.rawFile(API_CONFIG.EXCEL_MANIPULATION);
  }
  postExcelBudget(payload: any) {
    return this.HTTP.post(API_CONFIG.EXCEL_MANIPULATION, payload);
  }
  addBudgetCostMaster(payload: any) {
    return this.HTTP.post(API_CONFIG.ACCOUNT_PROJECT_COST_MASTER, payload);
  }
  getBudgetCostMaster(params: any): Observable<any> {
    const url = API_CONFIG.ACCOUNT_PROJECT_COST_MASTER + params.toString();
    return this.HTTP.get(url);
  }


  getChainageMaster(params: any): Observable<any> {
    const url = API_CONFIG.CHAINAGE_MASTER + '?' + params.toString();
    return this.HTTP.get(url);
  }

  addChainageMaster(request: any): Observable<any> {
    const url = API_CONFIG.CHAINAGE_MASTER;
    return this.HTTP.post(url, request);
  }

  getActivityMaster(params: any): Observable<any> {
    const url = API_CONFIG.ACTIVITY_MASTER + '?' + params.toString();
    return this.HTTP.get(url);
  }

  addActivityMasterBulk(request: any): Observable<any> {
    const url = API_CONFIG.ACTIVITY_MASTER_BULK;
    return this.HTTP.post(url, request);
  }

  getSubActivityMaster(params: any): Observable<any> {
    const url = API_CONFIG.SUB_ACTIVITY_MASTER + '?' + params.toString();
    return this.HTTP.get(url);
  }

  addSubActivityMasterBulk(request: any): Observable<any> {
    const url = API_CONFIG.SUB_ACTIVITY_MASTER_BULK;
    return this.HTTP.post(url, request);
  }


}
