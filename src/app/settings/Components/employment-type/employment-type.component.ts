import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { EditEmployementComponent } from './edit-employement/edit-employement.component';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'

import 'jspdf-autotable'
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';

@Component({
  selector: 'app-employment-type',
  templateUrl: './employment-type.component.html',
  styleUrls: ['./employment-type.component.scss',
  '../../../../assets/scss/scrollableTable.scss'
]
})
export class EmploymentTypeComponent implements OnInit {
  @ViewChild('editEmployement')
  editEmployement!: EditEmployementComponent;
  employmentForm!: FormGroup;
  countrylist: any; 
  deleteemployementId:any;
  employementList: any = [];
  localStorageData:any;
  editemployementId:any;
  EmployementList: any;
  EmployementData: any = [];
  userPermissions:any ={}

  pageSize:any=10;
  page:any=1;
  paginationValue:any;

  constructor(
    private apiservice:APIService,
    private router: Router,
    private datasharedservice:DataSharedService,
    private commonFunction: CommonFunctionService,
    private toastrService: ToastrService,
    private paginationservice:PaginationService

  ) { }
  

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewemployement();
    this.viewdownloademployement();
    this.getUserPermission();
  }

  getUserPermission() {
    this.userPermissions = this.commonFunction.getUserPermission('Manage User');
  }

  viewemployement() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getEmployeeList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);    
      this.employementList = data.results;
    })
  }

  viewdownloademployement() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page_size', '1000');
    this.apiservice.getEmployeeList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);    
      this.EmployementList = data.results;
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

    this.apiservice.getEmployeeList(params).subscribe(data => {
      this.employementList = data.results;    
    })

  }

  editemployementid(id: any) {
    this.datasharedservice.saveLocalData('employement_id', JSON.stringify(''));
    this.datasharedservice.saveLocalData('employement_id', JSON.stringify(id));
    this.editEmployement.getData(id);
   }

  deleteemployement(id: number) {
   this.deleteemployementId=id;
  }
  
  deleteAlertemployement(){
    this.apiservice.deleteEmployee(this.deleteemployementId,this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.viewemployement();
     },err=>{
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }
 
  downloadCsv() {
    var i=0;
    for (const item of this.EmployementList){
      i = i + 1;
      var obj = {
        S_No: i,
        user_type: item.user_type
        }
      this.EmployementData.push(obj);
    }

    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      headers: ["S.No","Employement Name"]
    };
    new ngxCsv(this.EmployementData,"EmployementList", options);
    window.location.reload();
  }
  
  downloadPdf() {
    var i=0;
    for (const item of this.EmployementList){
      i = i + 1;
      var obj = [
        i,
        item.user_type
      ]
      this.EmployementData.push(obj);
    }
   var  header= [["S.No.","Employement Name"]];
    var doc = new jsPDF();
  (doc as any).autoTable({  head: header, body:this.EmployementData,styles: {overflow: 'linebreak',
  fontSize: 10} })
  doc.save("Employement List");
  this.EmployementData=[];

  }
 

}
