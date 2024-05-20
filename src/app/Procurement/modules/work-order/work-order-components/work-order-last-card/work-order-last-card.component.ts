import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { DataSharingService } from '../../../purchase/data-sharing.service';

@Component({
  selector: 'app-work-order-last-card',
  templateUrl: './work-order-last-card.component.html',
  styleUrls: ['./work-order-last-card.component.scss']
})
export class WorkOrderLastCardComponent {
  form: any = {}
  localStorageData: any;
  userlist: any = []


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
      wo_last_Valid: false,
      cheque_no: '',
      cheque_date: this.setCurrentDate(),
      cheque_amount: 0,
      bank_name: '',
      cash_amount: 0,
      total_amount: 0,
      start_date: this.setCurrentDate(),
      end_date: this.setCurrentDate(),
      employee_name: '',
      jurisdiction: '',
      remark: '',
      attachments: []
    }
    this.getUserList()

  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userlist = data
    })
  }

  handleUpload(event: any) {
    this.form.attachments = []
    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let replacestring = 'data:' + file.type + ';base64,'
        let data = reader.result?.toString().replace(replacestring, '');
        this.form.attachments.push(
          {
            'file_data': data,
            'mime_type': file.type,
            'organization' : this.localStorageData.organisation_details[0].id
          }
        )
      };
    }
  }

  setCurrentDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm: any = today.getMonth() + 1; // Months start at 0!
    let dd: any = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return yyyy + '-' + mm + '-' + dd
  }


  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  onSubmit() {
    this.form.wo_last_Valid = true
    JSON.stringify(this.form)

    this.parrentAction.emit(JSON.stringify(this.form))
  }


}

