import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { DataSharingService } from '../../../purchase/data-sharing.service';


@Component({
  selector: 'app-wo-gst-last-card',
  templateUrl: './wo-gst-last-card.component.html',
  styleUrls: ['./wo-gst-last-card.component.scss']
})
export class WoGstLastCardComponent {

  form: any = {}
  localStorageData: any;
  userlist:any=[];
  importData:any;

  @Output() parrentAction = new EventEmitter<any>();

  @Input() prefieldData: any;
  @Input() scope: any;


  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
    private dataService: DataSharingService
  ) { }

  ngOnInit() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.form = {
      wo_gst_last_Valid: false,
      cheque_no: '',
      cheque_date:(new Date()).toISOString().substring(0, 10),
      cheque_amount:0,
      bank_name: '',
      cash_amount: 0,
      total_amount: 0,
      start_date:(new Date()).toISOString().substring(0, 10),
      end_date:(new Date()).toISOString().substring(0, 10),
      employee_name: '',
      jurisdiction: '',
      remark: '',
      fileData:'',
      attachments:[],
      organization: this.localStorageData?.organisation_details[0]?.id
    }

    this.getUserList()
  
  }

  uploadFile(eve: any) {
    this.form.attachments=[];
    this.importData = eve.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(this.importData); 
    reader.onload = (event) => { 

      let obj={
        organization:this.localStorageData.organisation_details[0].id,
        file_data:event.target!.result,
        mime_type:eve.target.files[0].type
      }
      this.form.attachments.push(obj);
    }
  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userlist = data
    })
  }


  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  onSubmit() {
    this.form.wo_gst_last_Valid = true
    JSON.stringify(this.form)
    this.parrentAction.emit(JSON.stringify(this.form))
  }


}
