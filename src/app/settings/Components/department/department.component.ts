import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { EditDepartmentComponent } from './edit-department/edit-department.component'; 
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'

import 'jspdf-autotable'
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';


@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss',
  '../../../../assets/scss/scrollableTable.scss'
]
})
export class DepartmentComponent implements OnInit {

  @ViewChild('editDepartment')
  editDepartment!: EditDepartmentComponent;
  departmentForm!: FormGroup;
  localStorageData:any;

  pageSize:any=10;
  page:any=1;
  paginationValue:any;
  DepartmentData: any = [];
  DepartmentList: any;
  userPermissions:any ={}

  countrylist:any;
  selectedItems:any;
  selectedStates:any;
  departmentList: any = [];
  deleteDepartmentId: any;

  constructor(
    private apiservice:APIService,
    private datasharedservice:DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice:PaginationService

  ) { }
 
  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.apiservice.getCountryList().subscribe(data=>{
      this.countrylist = data;
      this.viewDepartment();
      this.viewpdfDepartment();
      this.getUserPermission();
    })
  }

  getUserPermission() {
    this.userPermissions = this.commonFunction.getUserPermission('Manage User');
  }

  viewDepartment() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getDepartmentList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);    
      this.departmentList = data.results;
    })
  }

  viewpdfDepartment() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page_size', '1000');
    this.apiservice.getDepartmentList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);    
      this.DepartmentList = data.results;
    })
  }

  getPaginate(){
    this.paginationservice.getPaginationData().subscribe(newPaginationData => {
      if (newPaginationData) {
        this.paginationValue = newPaginationData;
      }
    });
    this.pageSize=this.paginationValue.pagesizeValue;
    this.page=this.paginationValue.pagevalue;
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page', this.paginationValue.pagevalue)
    params.set('page_size', this.paginationValue.pagesizeValue)

    this.apiservice.getDepartmentList(params).subscribe(data => {
      this.departmentList = data.results;    
    })

  }


  editdepartmentid(id: any) {
    this.datasharedservice.saveLocalData('department_id', JSON.stringify(id));
    this.editDepartment.getData(id);
   }

  deleteDepartment(id: number) {
   this.deleteDepartmentId=id;
  }
  
  deleteAlertDepartment(){
    this.apiservice.deleteDepartment(this.deleteDepartmentId,this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.viewDepartment();
    },err=>{
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  downloadCsv() {
    var i=0;
    for (const item of this.DepartmentList){
      i = i + 1;
      var obj = {
        S_No: i,
        department: item.department,
        departmentheadname: item.department_head_name
        }
      this.DepartmentData.push(obj);
    }

    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      headers: ["S.No","Department Name","Department Head Name"]
    };
    new ngxCsv(this.DepartmentData,"DepartmentList", options);
    window.location.reload();
  }
  
  downloadPdf() {
    var i=0;
    for (const item of this.DepartmentList){
      i = i + 1;
      var obj = [
        i,
        item.department,
        item.department_head_name
      ]
      this.DepartmentData.push(obj);
    }
   var  header= [["S.No.","Department Name","Department Head Name"]];
    var doc = new jsPDF();
  (doc as any).autoTable({  head: header, body:this.DepartmentData,styles: {overflow: 'linebreak',
  fontSize: 10} })
  doc.save("Department List");
  this.DepartmentData=[];

  }



}
