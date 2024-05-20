import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-labour-master',
  templateUrl: './labour-master.component.html',
  styleUrls: [
    './labour-master.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class LabourMasterComponent implements OnInit {
  pageSize: any = 10;
  page: any = 1;
  localStorageData: any;
  labourMasterList: Array<any> = [];
  onEditLabourData: any;
  addUpdateLabour: string = 'Add Labour';
  deleteLabourDetails: any;

  @ViewChild('closeButton') closeButton!: ElementRef;


  // countrylist: any;
  // deleteCompanyId: any;
  // companyList: any = [];
  // Companycsvdownload: any;
  // CompanyData: any = [];
  // userPermissions: any = {}

  // paginationValue: any;
  // DynamicFormData: any

  constructor(
    private apiservice: APIService,
    private router: Router,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService

  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getLabourMasterList();
    // this.viewCompany();
    // this.getUserPermission();
    // this.getDynamicForm();
  }

  getLabourMasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getLabourMasterList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.labourMasterList = data.results;
    })
  }

  editLabourMaster(labour: any) {
    this.onEditLabourData = labour;
    if (this.onEditLabourData) {
      this.addUpdateLabour = 'Edit Labour'
    }

  }

  deleteAlertLabour(labour: any) {
    this.deleteLabourDetails = labour;
  }

  deleteLabourMaster() {
    this.apiservice.deleteLabourMaster(this.deleteLabourDetails.id, this.deleteLabourDetails.organization).subscribe((res: any) => {

      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.getLabourMasterList();
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })


  }


  closeModal() {
    this.closeButton.nativeElement.click()
    this.onEditLabourData = ''
    this.addUpdateLabour = 'Add Labour'
  }


  // getDynamicForm() {
  //   let params = new URLSearchParams();
  //   params.set('organization_id', this.localStorageData.organisation_details[0].id);
  //   params.set('form_type', 'labour-master');
  //   this.apiservice.getDynamicForm(params).subscribe(data => {
  //     this.DynamicFormData = data.results
  //   });
  // }

  // getUserPermission() {
  //   this.userPermissions = this.commonFunction.getUserPermission('Manage User');
  // }

  // viewCompany() {
  //   let params = new URLSearchParams();
  //   params.set('organization_id', this.localStorageData.organisation_details[0].id);
  //   this.apiservice.getCompanyList(params).subscribe(data => {
  //     this.paginationservice.setTotalItemData(data.count);
  //     this.companyList = data.results;
  //   })
  // }

  getPaginate() {
    // this.paginationservice.getPaginationData().subscribe(newPaginationData => {
    //   if (newPaginationData) {
    //     this.paginationValue = newPaginationData;
    //   }
    // });
    // this.pageSize = this.paginationValue.pagesizeValue;
    // this.page = this.paginationValue.pagevalue;
    // let params = new URLSearchParams();
    // params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('page', this.paginationValue.pagevalue)
    // params.set('page_size', this.paginationValue.pagesizeValue)

    // this.apiservice.getCompanyList(params).subscribe(data => {
    //   this.companyList = data.results;
    // })
    // }

    // editcompanyid(id: any) {
    //   this.datasharedservice.saveLocalData('company_id', JSON.stringify(id));
    //   // this.editCompany.getData(id);
    // }

    // deleteCompany(id: number) {
    //   // this.deleteCompanyId = id;
  }

  deleteAlertCompany() {
    // this.apiservice.deleteCompany(this.deleteCompanyId, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
    //   this.toastrService.success(Success_Messages.SuccessDelete, '', {
    //     timeOut: 2000,
    //   });
    //   this.viewCompany();
    // }, err => {
    //   if (err.status == 500) {
    //     this.toastrService.error(err.error.detail, '', {
    //       timeOut: 4000,
    //     });
    //   } else {
    //     this.toastrService.error(Error_Messages.Failed_HTTP, '', {
    //       timeOut: 2000,
    //     });
    //   }
    // })
  }

  downloadCsv() {
    // var i = 0;
    // for (const item of this.CompanyList) {
    //   i = i + 1;
    //   var obj = {
    //     S_No: i,
    //     name: item.name,
    //     PartyAddress: item.party_address,
    //     PAN_No: item.pan_no,
    //     GST_No: item.gst_no,
    //     Email_Id: item.email_id,
    //     Phone_No: item.phone_no,
    //     available_threshold: item.available_threshold,
    //     value_of_similar_works: item.value_of_similar_works,
    //     maximum_span_length_of_bridge_avail: item.maximum_span_length_of_bridge_avail,
    //     average_annual_turn_over: item.average_annual_turn_over,
    //     net_worth: item.net_worth
    //   }
    //   this.CompanyData.push(obj);
    // }
    // var options = {
    //   fieldSeparator: ',',
    //   quoteStrings: '"',
    //   decimalseparator: '.',
    //   showLabels: true,
    //   headers: ["S.No.", "Company Name", "Party Address", "PAN No.", "GST No.", "Email Id", "Phone No.", "Avilable Threshold(in Crs.)", "Value of Similar Works(in Crs.)", "Maximum Span Length of Bridge Avilable (in Mtr)", "Average Annual Turnover (in Crs.) (last 5 years)", "Net Worth (in Crs.)"]
    // };
    // new ngxCsv(this.CompanyData, "CompanyList", options);
    // window.location.reload();
  }

  downloadPdf() {
    // var i = 0;
    // for (const item of this.CompanyList) {
    //   i = i + 1;
    //   var obj = [
    //     i,
    //     item.name,
    //     item.party_address,
    //     item.pan_no,
    //     item.gst_no,
    //     item.email_id,
    //     item.phone_no,
    //     item.available_threshold,
    //     item.value_of_similar_works,
    //     item.maximum_span_length_of_bridge_avail,
    //     item.average_annual_turn_over,
    //     item.net_worth
    //   ]
    //   this.CompanyData.push(obj);
    // }
    // var header = [["S.No.", "Company Name", "Party Address", "PAN No.", "GST No.", "Email Id", "Phone No.", "Avilable Threshold(in Crs.)", "Value of Similar Works(in Crs.)", "Maximum Span Length of Bridge Avilable (in Mtr)", "Average Annual Turnover (in Crs.) (last 5 years)", "Net Worth (in Crs.)"]];
    // var pdfsize = 'a0';
    // var doc = new jsPDF('l', 'pt', pdfsize);
    // (doc as any).autoTable({
    //   head: header, body: this.CompanyData, styles: {
    //     overflow: 'linebreak',
    //     fontSize: 10
    //   }
    // })
    // doc.save("Company List");
    // this.CompanyData = [];
  }
}
