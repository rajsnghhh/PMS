import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { EditEmailSmsConfigurationComponent } from '../edit-email-sms-configuration/edit-email-sms-configuration.component';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'

import 'jspdf-autotable'

@Component({
  selector: 'app-email-sms-configuration',
  templateUrl: './email-sms-configuration.component.html',
  styleUrls: ['./email-sms-configuration.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class EmailSmsConfigurationComponent implements OnInit {

  @ViewChild('editemailTemplate')
  editemailTemplate!: EditEmailSmsConfigurationComponent;

  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  localStorageData: any;
  emailList: any = [];
  deleteEmailId: any;
  activedata: boolean = true;
  statusChangedId: any;
  EmailData: any =[];


  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService

  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getEmailList();
    this.getdownloadEmailList();
  }

  getEmailList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getEmailList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.emailList = data.results;
    })
  }

  getdownloadEmailList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page_size', '1000');
    this.apiservice.getEmailList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);    
      this.emailList = data.results;
    })
  }


  editEmailTemplateid(id: any) {
    this.datasharedservice.saveLocalData('email_id', JSON.stringify(id));
    this.editemailTemplate.getData(id);
  }

  deleteemail(id: number) {
    this.deleteEmailId = id;
  }

  deleteAlertemail() {
    this.apiservice.deleteemail(this.deleteEmailId, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.getEmailList();
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  ChangeStatus(id: number, active: any) {
    this.activedata = active;
    this.statusChangedId = id;
    this.emailList[id].Status = !this.emailList[id].Status
  }

  confirmDeactive() {
    let organisation = this.emailList.find((e: { id: string | null; }) => e.id == this.statusChangedId).organization;
    let template_name = this.emailList.find((e: { id: string | null; }) => e.id == this.statusChangedId).template_name;
    let subject = this.emailList.find((e: { id: string | null; }) => e.id == this.statusChangedId).subject;
    let body = this.emailList.find((e: { id: string | null; }) => e.id == this.statusChangedId).body;
    let from_name = this.emailList.find((e: { id: string | null; }) => e.id == this.statusChangedId).from_name;
    let from_email = this.emailList.find((e: { id: string | null; }) => e.id == this.statusChangedId).from_email;
    let template_type = this.emailList.find((e: { id: string | null; }) => e.id == this.statusChangedId).template_type;
    let tags = this.emailList.find((e: { id: string | null; }) => e.id == this.statusChangedId).tags;

    let data = {
      organization: organisation,
      template_name: template_name,
      subject: subject,
      body: body,
      from_name: from_name,
      from_email: from_email,
      template_type: template_type,
      tags: tags,
      status: this.activedata
    }
    this.apiservice.editEmailStatus(data, this.statusChangedId, this.localStorageData.organisation_details[0].id).subscribe(data => {
      this.toastrService.success('Status Changed Successfully', '', {
        timeOut: 2000,
      });
      this.getEmailList();
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

  getPaginate() {
    this.paginationservice.getPaginationData().subscribe(newPaginationData => {
      if (newPaginationData) {
        this.paginationValue = newPaginationData;
      }
    });
    this.pageSize = this.paginationValue.pagesizeValue;
    this.page = this.paginationValue.pagevalue;
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page', this.paginationValue.pagevalue)
    params.set('page_size', this.paginationValue.pagesizeValue)

    this.apiservice.getEmailList(params).subscribe(data => {
      this.emailList = data.results;
    }
    )
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

  downloadCsv() {
    var i = 0;
    for (const item of this.emailList) {
      i = i + 1;
      var obj = {
        S_No: i,
        template_name: item.template_name,
        emtp_type_name: item.email_template_type.emtp_type_name,
        subject: item.subject,
        status: this.filterStatus(item.is_active),
        updated_at: item.updated_at,
      }
      this.EmailData.push(obj);
    }
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      headers: ["S.No", "Template Name", "Template Type", "Subject", "Status", "Updated On"]
    };
    new ngxCsv(this.EmailData, "Email List", options);
    window.location.reload();
  }

  downloadPdf() {
    var i = 0;
    for (const item of this.emailList) {
      i = i + 1;
      var obj = [
        i,
        item.template_name,
        item.email_template_type.emtp_type_name,
        item.subject,
        this.filterStatus(item.is_active),
        item.updated_at,
      ]
      this.EmailData.push(obj);
    }
    var header = [["S.No.", "Template Name", "Template Type", "Subject", "Status", "Updated On"]];
    var doc = new jsPDF();
    (doc as any).autoTable({
      head: header, body: this.EmailData, styles: {
        overflow: 'linebreak',
        fontSize: 10
      }
    })
    doc.save("Email List");
    this.EmailData = [];
  }


}
