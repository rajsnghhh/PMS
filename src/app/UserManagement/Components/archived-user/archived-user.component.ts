import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'

import 'jspdf-autotable'
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { UserSettingComponent } from '../user-setting/user-setting.component';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-archived-user',
  templateUrl: './archived-user.component.html',
  styleUrls: ['./archived-user.component.scss',
  '../../../../assets/scss/scrollableTable.scss']
})
export class ArchivedUserComponent implements OnInit {

  deletedUserList: any=[];
  localStorageData: any;
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  selectedUser: any;
  manageuserData: any = [];


  queryParaMap: any = {
    page_size: 10,
    page: 1,
    organisation:''
  }

  @ViewChild('userSetting')
  userSetting!: UserSettingComponent;

  @ViewChild('editUserData')
  editUserData!: EditUserComponent;


  constructor(
    private router: Router,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService
  ) {}


  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getDeletedUserList();
  }

  getDeletedUserList() {
    this.queryParaMap.organisation = this.localStorageData.organisation_details[0].id;
    let query = this.commonFunction.getURL(this.queryParaMap)
    this.apiservice.getDeletedUserList(query).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.deletedUserList = data.results;
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  gotoTenderList() {
    this.router.navigate(['/pms/usermanagement/manageUser']);
  }

  retriveUser() {

    this.apiservice.RetriveUser(this.selectedUser).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.router.navigate(['/pms/usermanagement/manageUser']);
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  deleteUser(id: number) {
    this.selectedUser = id;
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
    this.getDeletedUserList();
  }

  downloadCsv() {
    var i=0;
    for (const item of this.deletedUserList){
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
        }
      this.manageuserData.push(obj);
    }

    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      headers: ["Emp. Code","Contact","Phone","Email","Company","Profile","Zone","Department","Role"]
    };
    new ngxCsv(this.manageuserData,"userList", options);
    window.location.reload();
  }
  
  downloadPdf() {
    var i=0;
    for (const item of this.deletedUserList){
      var obj = [
        item.employe_code,
        item.first_name+item.last_name,
        item.phone_no,
        item.email,
        item.company_details[0]?.name,
        item.role_details?.role_name,
        item.zone_details?.zone_name,
        item.department_details[0]?.department,
        item.designation_details[0]?.designation,
      ]
      this.manageuserData.push(obj);
    }
   var  header= [["Emp. Code","Contact","Phone","Email","Company","Profile","Zone","Department","Role"]];
    var doc = new jsPDF();
  (doc as any).autoTable({  head: header, body:this.manageuserData,styles: {overflow: 'linebreak',
  fontSize: 4} })
  doc.save("User List");
  this.manageuserData=[];

  }

}
