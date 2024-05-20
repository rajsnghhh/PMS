import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-send-enquiry',
  templateUrl: './send-enquiry.component.html',
  styleUrls: ['./send-enquiry.component.scss',
  '../../../../../assets/scss/scrollableTable.scss']
})
export class SendEnquiryComponent {


  localStorageData: any;
  enquiryListData: any;
  enquiryTableData:any;
  emailBody:any;

  form: any = {
    enquiry_no: '',
  };

  constructor(
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private procurementAPIService: PROCUREMENTAPIService,
    private router: Router,
    private activeroute: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.enquiryList();
  }

  enquiryList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('project', this.localStorageData.project_data.id);
    params.set('site', this.localStorageData.site_data.id);
    params.set('financialyear',this.localStorageData.financial_year[0].id);
    this.procurementAPIService.getRfqVendors(params).subscribe(data => {
      this.enquiryListData = data.results;
    });
  }

  getTableData(id:any){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id',id);

    this.procurementAPIService.getRfqVendors(params).subscribe(data => {
      this.enquiryTableData = data;
      this.mailDetailsAdd();  
    });
  }

  mailDetailsAdd(){
    for(let data of this.enquiryTableData.vendor_details){
      data.enq_send_status=this.enquiryTableData.mail_details.find((val:any)=>val.vendor_id==data.vendor_id).email_send__is_sent;
      data.email_body=this.enquiryTableData.mail_details.find((val:any)=>val.vendor_id==data.vendor_id).email_send__processed_message;

    }
  }

  previewEmail(emailBody:any){
    this.emailBody=emailBody;
  }

  directMail(){
    this.procurementAPIService.MailTrigger().subscribe(data=>{
    })
  }

}
