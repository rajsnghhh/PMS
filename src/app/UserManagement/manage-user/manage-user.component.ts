import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { EditUserComponent } from '../Components/edit-user/edit-user.component';
import { UserSettingComponent } from '../Components/user-setting/user-setting.component';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'

import 'jspdf-autotable'

declare var window: any;
@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: [
    './manage-user.component.scss',
    '../../../assets/scss/scrollableTable.scss'
  ]
})
export class ManageUserComponent implements OnInit {

  @ViewChild('userSetting')
  userSetting!: UserSettingComponent;

  @ViewChild('editUserData')
  editUserData!: EditUserComponent;
  
  @ViewChild('customscroll', { read: ElementRef })
  public customscroll!: ElementRef<any>;
  formModal: any;
  offcanvas: any;
  userData: any;
  editoffcanvas: any;
  departmentId:any=[];
  departmentPayload:any;
  designationId:any=[];
  designationPayload:any;
  zoneId:any=[];
  CompanyId:any;
  zonePayload:any;
  roleId:any=[];
  rolePayload:any;
  empTypeId:any=[];
  empTypePayload:any;
  stateId:any=[];
  statePayload:any;
  cityId:any=[];
  cityPayload:any;
  manageuserData: any = [];
  is_active: boolean = true;



  constructor(
    public router: Router,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService
  ) { }

  visiblecloume = {
    Contact: true,
    Department: true,
    Designation: true,
    LastLogin: true,
    Status: true,
    Gender: false,
    State: false,
    City: false,
    AadherNo: false,
    PanNo: false,
    BloodGroup: false,
    AddressLine1: false,
    AddressLine2: false,
    ReportingManager: false,
    DateofBirth: false,
    JoiningDate: false,
    LastWorkingDate: false,
    Role:false,
    Company:true,
    Zone:false,
    empcode:false
  }
  selectedUser: any;
  activedata:any;
  statusChangedId:any;
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  userList: any=[];
  addoffcanvas: any
  searchoffcanvas: any
  activeCount = 0
  inactiveCount = 0
  userPermissions:any ={}
  ngOnInit(): void {
    this.getUserPermission()
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.queryParaMap.organisation = this.userData.organisation_details[0].id
    this.queryParaMap.is_active = '';
    this.getUserList();
    this.setUpModalCanvas();
    if (this.datasharedservice.getLocalData('userSelectedColoum')) {
      this.visiblecloume = JSON.parse(this.datasharedservice.getLocalData('userSelectedColoum'));
    }
  }

  queryParaMap: any = {
    page_size: 10,
    page: 1,
    organisation: ''
  }

  getUserPermission() {
    this.userPermissions = this.commonFunction.getUserPermission('Manage User');
  }

  closeUserSetting(){
    this.offcanvas.hide();
    this.getUserList()
  }
  setUpModalCanvas() {
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('deleteUser')
    );
    this.offcanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightUserSetting')
    );

    this.addoffcanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightLabeladduser')
    );

    this.searchoffcanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightsearch')
    );

    this.editoffcanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightEditUser')
    );


  }

  ChangeStatus(id: number,active:any) {
    this.activedata=active;
    this.statusChangedId=id;
    this.userList[id].Status = !this.userList[id].Status
  }
  confirmDeactive() {

    let organisation = this.userList.find((e: { id: string | null; }) => e.id == this.statusChangedId).organization;
    let zone = this.userList.find((e: { id: string | null; }) => e.id == this.statusChangedId).zone;
    let employement_type = this.userList.find((e: { id: string | null; }) => e.id == this.statusChangedId).employement_type;
    let company_name = this.userList.find((e: { id: string | null; }) => e.id == this.statusChangedId).company_name;
    let designation = this.userList.find((e: { id: string | null; }) => e.id == this.statusChangedId).designation;
    let department = this.userList.find((e: { id: string | null; }) => e.id == this.statusChangedId).department;
    let role = this.userList.find((e: { id: string | null; }) => e.id == this.statusChangedId).role;
    let country = this.userList.find((e: { id: string | null; }) => e.id == this.statusChangedId).country;
    let state = this.userList.find((e: { id: string | null; }) => e.id == this.statusChangedId).state;
    let city = this.userList.find((e: { id: string | null; }) => e.id == this.statusChangedId).city;
    let aadhar_number = this.userList.find((e: { id: string | null; }) => e.id == this.statusChangedId).aadhar_number;
    let pan_number = this.userList.find((e: { id: string | null; }) => e.id == this.statusChangedId).pan_number;
    let gender = this.userList.find((e: { id: string | null; }) => e.id == this.statusChangedId).gender;
    let email = this.userList.find((e: { id: string | null; }) => e.id == this.statusChangedId).email;
    let first_name = this.userList.find((e: { id: string | null; }) => e.id == this.statusChangedId).first_name;
    let last_name = this.userList.find((e: { id: string | null; }) => e.id == this.statusChangedId).last_name;
    let phone_no = this.userList.find((e: { id: string | null; }) => e.id == this.statusChangedId).phone_no;
    let notice_period = this.userList.find((e: { id: string | null; }) => e.id == this.statusChangedId).notice_period;
    let username = this.userList.find((e: { id: string | null; }) => e.id == this.statusChangedId).username;

    let data = {
      organization:organisation,
      zone:zone,
      employement_type: employement_type,
      company_name: company_name,
      designation: designation,
      department: department,
      role: role,
      country:country,
      state: state,
      city: city,
      aadhar_number: aadhar_number,
      pan_number:pan_number,
      gender:gender,
      email:email,
      first_name:first_name,
      last_name:last_name,
      phone_no:phone_no,
      notice_period: notice_period,
      username:username,
      is_active: this.activedata
    }
    this.apiservice.updateUser(data, this.statusChangedId).subscribe(data => {
      this.toastrService.success('Status Changed Successfully', '', {
        timeOut: 2000,
      });
      this.getUserList();
    }, err => {
      if (err.detail) {
        this.toastrService.error(err.detail, '', {
          timeOut: 2000,
        });
      } else {
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      }
    })
  }
  getactiveUserList() {
    this.queryParaMap.is_active = 'true';
    this.getUserList()
  }

  getAllUserList() {
    this.queryParaMap.is_active = '';
    this.getUserList()
  }

  getinactiveUserList() {
    this.queryParaMap.is_active = 'false';
    this.getUserList()
  }

  getUserList() {
    // getUserList
    let query = this.commonFunction.getURL(this.queryParaMap)
    this.apiservice.getUserList(query).subscribe(data => {
      this.activeCount = data.active_count
      this.inactiveCount = data.inactive_count
      this.paginationservice.setTotalItemData(data.count);
      this.userList = data.results;
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }
  searchUserList() {
    // getUserList
    let query = this.commonFunction.getURL(this.queryParaMap)
    this.apiservice.searchUserList(query,this.departmentPayload,this.designationPayload,this.zonePayload,this.rolePayload,this.empTypePayload,this.statePayload,this.cityPayload,this.CompanyId).subscribe(data => {
      this.activeCount = data.active_count
      this.inactiveCount = data.inactive_count
      this.paginationservice.setTotalItemData(data.count);
      this.userList = data.results;
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  editUser(id: any) {
    this.editUserData.getData(id);
  }

  editProfileSetting(id: any, roleId:any) {
    this.userSetting.getuserSettingData(id,roleId,this.userData.organisation_details[0].id);
  }
  usersActivity(userId:any){
    this.datasharedservice.saveLocalData('ActivityUserId',JSON.stringify(userId));
    this.router.navigateByUrl('/pms/usermanagement/userActivity');
  }
  deleteUser(id: number) {
    this.selectedUser = id;
  }

  userDelete() {
    this.apiservice.deleteTheUser(this.selectedUser).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.getUserList();
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  tableColoumChange(col: string) {

    if (col == 'Contact') {
      this.visiblecloume.Contact = !this.visiblecloume.Contact
    }
    if (col == 'Role') {
      this.visiblecloume.Role = !this.visiblecloume.Role
    }
    if (col == 'Zone') {
      this.visiblecloume.Zone = !this.visiblecloume.Zone
    }
    if (col == 'empcode') {
      this.visiblecloume.empcode = !this.visiblecloume.empcode
    }
    if (col == 'Company') {
      this.visiblecloume.Company = !this.visiblecloume.Company
    }
    if (col == 'PanNo') {
      this.visiblecloume.PanNo = !this.visiblecloume.PanNo
    }
    if (col == 'Department') {
      this.visiblecloume.Department = !this.visiblecloume.Department
    }
    if (col == 'Designation') {
      this.visiblecloume.Designation = !this.visiblecloume.Designation
    }
    if (col == 'LastLogin') {
      this.visiblecloume.LastLogin = !this.visiblecloume.LastLogin
    }
    if (col == 'Status') {
      this.visiblecloume.Status = !this.visiblecloume.Status
    }
    if (col == 'Gender') {
      this.visiblecloume.Gender = !this.visiblecloume.Gender
    }
    if (col == 'State') {
      this.visiblecloume.State = !this.visiblecloume.State
    }
    if (col == 'City') {
      this.visiblecloume.City = !this.visiblecloume.City
    }
    if (col == 'BloodGroup') {
      this.visiblecloume.BloodGroup = !this.visiblecloume.BloodGroup
    }
    if (col == 'AadherNo') {
      this.visiblecloume.AadherNo = !this.visiblecloume.AadherNo
    }
    if (col == 'AddressLine1') {
      this.visiblecloume.AddressLine1 = !this.visiblecloume.AddressLine1
    }
    if (col == 'AddressLine2') {
      this.visiblecloume.AddressLine2 = !this.visiblecloume.AddressLine2
    }
    if (col == 'ReportingManager') {
      this.visiblecloume.ReportingManager = !this.visiblecloume.ReportingManager
    }
    if (col == 'DateofBirth') {
      this.visiblecloume.DateofBirth = !this.visiblecloume.DateofBirth
    }
    if (col == 'JoiningDate') {
      this.visiblecloume.JoiningDate = !this.visiblecloume.JoiningDate
    }
        if (col == 'LastWorkingDate') {
      this.visiblecloume.LastWorkingDate = !this.visiblecloume.LastWorkingDate
    }
    this.datasharedservice.saveLocalData('userSelectedColoum', JSON.stringify(this.visiblecloume))
  }

  openFormModal() {
    this.formModal.show();
  }
  saveSomeThing() {
    // confirm or save something
    this.formModal.hide();
  }

  addUser() {
    this.addoffcanvas.show();
  }

  closeUserCanvas() {
    this.addoffcanvas.hide();
    this.getUserList();
  }


  closeEditCanvas() {
    this.editoffcanvas.hide();
    this.getUserList();
  }
  openCanvas() {
    this.offcanvas.show();
  }

  reset() {
    window.location.reload();
  }

  searchUser() {
    this.searchoffcanvas.show()
  }

  closeSearchCanvas() {
    this.searchoffcanvas.hide()
    if (this.datasharedservice.getLocalData('Searchtemp')) {
      let searchData = JSON.parse(this.datasharedservice.getLocalData('Searchtemp'));
      this.CompanyId=searchData.companyId;
      this.datasharedservice.removeLocalData('Searchtemp');
      if (searchData.search != '') {
        this.queryParaMap.search = searchData.search;
      }else{
        this.queryParaMap.search = ''
      }
      if (searchData.department.length != 0) {
        this.departmentId=[];
        for (const item of searchData.department) {
          var obj = {
            department: item
          }
          this.departmentId.push(obj);
        }
        let strValue = JSON.stringify(this.departmentId); 
        let result = strValue.replace(/:/g,"=").replace(/,/g,"&").replace(/"/g,"").replace(/{/g,"").replace(/}/g,"");
        let result1=result.split('[');
        let result2=result1[1].split(']');
        this.departmentPayload = new URLSearchParams();
        this.departmentPayload=result2[0];
      }else{
        this.departmentPayload=''
        this.departmentPayload='department=';
      }
      if (searchData.designation.length != 0) {
        this.designationId=[];
        for (const item of searchData.designation) {
          var obj1 = {
            designation: item
          }
          this.designationId.push(obj1);
        }
        let strValue = JSON.stringify(this.designationId); 
        let result = strValue.replace(/:/g,"=").replace(/,/g,"&").replace(/"/g,"").replace(/{/g,"").replace(/}/g,"");
        let result1=result.split('[');
        let result2=result1[1].split(']');
        this.designationPayload = new URLSearchParams();
        this.designationPayload=result2[0];  
      }else{
        this.designationPayload='';
        this.designationPayload='designation=';
      }
      if (searchData.zone.length != 0) {
        this.zoneId=[];
        for (const item of searchData.zone) {
          var obj2 = {
            zone_id: item
          }
          this.zoneId.push(obj2);
        }
        let strValue = JSON.stringify(this.zoneId); 
        let result = strValue.replace(/:/g,"=").replace(/,/g,"&").replace(/"/g,"").replace(/{/g,"").replace(/}/g,"");
        let result1=result.split('[');
        let result2=result1[1].split(']');
        this.zonePayload = new URLSearchParams();
        this.zonePayload=result2[0];  
      }else{
        this.zonePayload='';
        this.zonePayload='zone_id=';
      }
      if (searchData.role.length != 0) {
        this.roleId=[];
        for (const item of searchData.role) {
          var obj3 = {
            role_id: item
          }
          this.roleId.push(obj3);
        }
        let strValue = JSON.stringify(this.roleId); 
        let result = strValue.replace(/:/g,"=").replace(/,/g,"&").replace(/"/g,"").replace(/{/g,"").replace(/}/g,"");
        let result1=result.split('[');
        let result2=result1[1].split(']');
        this.rolePayload = new URLSearchParams();
        this.rolePayload=result2[0]; 
      }else{
        this.rolePayload='';
        this.rolePayload='role_id=';
      }
       if (searchData.emptype.length != 0) {
        this.empTypeId=[];
        for (const item of searchData.emptype) {
          var obj4 = {
            employement_type: item
          }
          this.empTypeId.push(obj4);
        }
        let strValue = JSON.stringify(this.empTypeId); 
        let result = strValue.replace(/:/g,"=").replace(/,/g,"&").replace(/"/g,"").replace(/{/g,"").replace(/}/g,"");
        let result1=result.split('[');
        let result2=result1[1].split(']');
        this.empTypePayload = new URLSearchParams();
        this.empTypePayload=result2[0];
      }else{
        this.empTypePayload='';
        this.empTypePayload='employement_type=';
      }
       if (searchData.state.length != 0) {
        this.stateId=[];
        for (const item of searchData.state) {
          var obj5 = {
            state_id: item
          }
          this.stateId.push(obj5);
        }
        let strValue = JSON.stringify(this.stateId); 
        let result = strValue.replace(/:/g,"=").replace(/,/g,"&").replace(/"/g,"").replace(/{/g,"").replace(/}/g,"");
        let result1=result.split('[');
        let result2=result1[1].split(']');
        this.statePayload = new URLSearchParams();
        this.statePayload=result2[0];
      }else{
        this.statePayload='';
        this.statePayload='state_id=';
      }
       if (searchData.city.length != 0) {
          this.cityId=[];
          for (const item of searchData.city) {
            var obj6 = {
              city_id: item
            }
            this.cityId.push(obj6);
          }
          let strValue = JSON.stringify(this.cityId); 
          let result = strValue.replace(/:/g,"=").replace(/,/g,"&").replace(/"/g,"").replace(/{/g,"").replace(/}/g,"");
          let result1=result.split('[');
          let result2=result1[1].split(']');
          this.cityPayload = new URLSearchParams();
          this.cityPayload=result2[0];
      }else{
        this.cityPayload='';
        this.cityPayload='city_id=';
      }
      if(searchData.reset) {
        this.getAllUserList()
      }

      this.searchUserList();
    }
  }

  changeShort(shortCol: any) {

    if (this.queryParaMap.field_name && this.queryParaMap.field_name == shortCol) {
      this.queryParaMap.order_by = 'desc'
    } else {
      this.queryParaMap.order_by = 'asc'
    }

    this.queryParaMap.field_name = shortCol;

    this.getUserList();
  }


  getPaginate() {
    this.paginationservice.getPaginationData().subscribe(newPaginationData => {
      if (newPaginationData) {
        this.paginationValue = newPaginationData;
      }
    });
    this.pageSize = this.paginationValue.pagesizeValue;
    this.page = this.paginationValue.pagevalue;
    let params = new URLSearchParams();
    this.queryParaMap.page_size = this.paginationValue.pagesizeValue;
    this.queryParaMap.page = this.paginationValue.pagevalue;
    this.getUserList();
  }

  filterStatus(data: any) {
    let res = ''
    if(data==true){
    res += 'Active'
    }else {
    res += 'Inactive'
    }
    return res
  }

  gotoDeletedUserList() {
    this.router.navigate(['/pms/usermanagement/archived-user']);
  }

  downloadCsv() {
    var i=0;
    for (const item of this.userList){
      i = i + 1;
      var obj = {
        Emp_code: item.employe_code,
        contact: item.first_name+item.last_name,
        mobile: item.phone_no,
        email: item.email,
        company: item.company_details[0]?.name,
        profile: item.role_details?.role_name,
        zone: item.zone_details?.zone_name,
        department: item.department_details[0]?.department,
        role: item.designation_details[0]?.designation,
        lastlogin: item.last_login,
        gender: item.gender,
        state: item.state_details?.name,
        city: item.city_details?.name,
        aadhar: item.aadhar_number,
        pan: item.pan_number,
        bloodgroup: item.blood_group,
        address_line_1: item.address_line_1,
        address_line_2: item.address_line_2,
        repoting_manager:item.reporting_manager_details[0].first_name+item.reporting_manager_details[0].last_name,
        date_of_birth: item.date_of_birth,
        joining_date: item.joining_date,
        last_working_date: item.last_working_date,
        status: this.filterStatus(item.is_active),
        }
      this.manageuserData.push(obj);
    }

    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      headers: ["Emp. Code","Contact","Phone","Email","Company","Profile","Zone","Department","Role","Last Login","Gender","State","City","Aadhar No","PAN No","Blood Group","Address Line 1","Address Line 2","Reporting Manager","Date of Birth","Joining Date","Last Working Date","Status"]
    };
    new ngxCsv(this.manageuserData,"userList", options);
    window.location.reload();
  }
  
  downloadPdf() {
    var i=0;
    for (const item of this.userList){
      var obj = [
        item.employe_code,
        item.first_name + item.last_name,
        item.phone_no,
        item.email,
        item.company_details[0]?.name,
        item.role_details?.role_name,
        item.zone_details?.zone_name,
        item.department_details[0]?.department,
        item.designation_details[0]?.designation,
        item.last_login,
        item.gender,
        item.state_details?.name,
        item.city_details?.name,
        item.aadhar_number,
        item.pan_number,
        item.blood_group,
        item.address_line_1,
        item.address_line_2,
        item.reporting_manager_details[0].first_name+item.reporting_manager_details[0].last_name,
        item.date_of_birth,
        item.joining_date,
        item.last_working_date,
        this.filterStatus(item.is_active),
      ]
      this.manageuserData.push(obj);
    }
   var  header= [["Emp. Code","Contact","Phone","Email","Company","Profile","Zone","Department","Role","Last Login","Gender","State","City","Aadhar No","PAN No","Blood Group","Address Line 1","Address Line 2","Reporting Manager","Date of Birth","Joining Date","Last Working Date","Status"]];
   var pdfsize = 'a0';
   var doc = new jsPDF('l', 'pt', pdfsize);
   (doc as any).autoTable({  head: header, body:this.manageuserData, startY: 10, startX: 0,
   styles: {overflow: 'linebreak',
   fontSize: 5} })
  // doc.output('dataurlnewwindow');
   doc.save("User List");
   doc.output('dataurlnewwindow')
   this.manageuserData=[];

  }
  
  next() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }
 
  previous() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }
}
