import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { EditSmsConfigurationComponent } from '../edit-sms-configuration/edit-sms-configuration.component';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'

import 'jspdf-autotable'


@Component({
  selector: 'app-sms-configuration',
  templateUrl: './sms-configuration.component.html',
  styleUrls: ['./sms-configuration.component.scss',
  '../../../../assets/scss/scrollableTable.scss']
})
export class SmsConfigurationComponent implements OnInit {

  @ViewChild('editsmsTemplate')
  editsmsTemplate!: EditSmsConfigurationComponent;

  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  localStorageData: any;
  smsList: any = [];
  deleteSmsId : any;
  SMSData: any = [];


  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService

  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getsmsList();
    this.getdownloadsmsList();
  }


  getsmsList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getSmsList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.smsList = data.results;
    })
  }

  getdownloadsmsList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page_size', '1000');
    this.apiservice.getSmsList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);    
      this.smsList = data.results;
    })
  }


  editsmsTemplateid(id: any) {
    this.datasharedservice.saveLocalData('sms_id', JSON.stringify(id));
    this.editsmsTemplate.getData(id);
  }

  deletesms(id: number) {
     this.deleteSmsId=id;
  }

  deleteAlertsms() {
    this.apiservice.deleteSms(this.deleteSmsId,this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.getsmsList();
    },err=>{
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  getPaginate() {
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

    this.apiservice.getSmsList(params).subscribe(data => {
      this.smsList = data.results;    
    })
  }

  downloadCsv() {
    var i = 0;
    for (const item of this.smsList) {
      i = i + 1;
      var obj = {
        S_No: i,
        sms_template_name: item.sms_template_name,
        template_type: item.template_type.smtp_type_name,
        body: item.body
      }
      this.SMSData.push(obj);
    }
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      headers: ["S.No", "Template Name", "Template Type", "Message"]
    };
    new ngxCsv(this.SMSData, "SMS List", options);
    window.location.reload();
  }

  downloadPdf() {
    var i = 0;
    for (const item of this.smsList) {
      i = i + 1;
      var obj = [
        i,
        item.sms_template_name,
        item.template_type.smtp_type_name,
        item.body      
      ]
      this.SMSData.push(obj);
    }
    var header = [["S.No.", "Template Name", "Template Type", "Message"]];
    var doc = new jsPDF();
    (doc as any).autoTable({
      head: header, body: this.SMSData, styles: {
        overflow: 'linebreak',
        fontSize: 10
      }
    })
    doc.save("SMS List");
    this.SMSData = [];
  }

}
