import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-form-data-below-material-issue',
  templateUrl: './form-data-below-material-issue.component.html',
  styleUrls: ['./form-data-below-material-issue.component.scss']
})
export class FormDataBelowMaterialIssueComponent {
  localStorageData: any;
  userlist: any;

  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;

  @Output() parrentAction = new EventEmitter<any>();

  form: any = {}

  @Input() preFieldData: any;
  @Input() scope: any;
  disabledEdit = true


  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    public router: Router,
    private toastrService: ToastrService

  ) { }


  ngOnChanges(changes: SimpleChanges): void {

    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if ((this.scope == 'update' || this.scope == 'view') && this.preFieldData?.id) {
      this.form.remarks = this.preFieldData.remarks
      this.form.attachment = this.preFieldData.attachment

    }
    if (this.scope == 'view') {
      this.disabledEdit = true
    } else {
      // this.form.requested_by = this.localStorageData.user_id
      this.disabledEdit = false
    }
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    this.getUserList()
    this.form = {
      issue_form_data: false,
      requested_by: '',
      issued_by: this.localStorageData ? this.localStorageData.user_id : '',
      attachment: [],
      remarks: ''
    };

  }

  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }



  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userlist = data
    })
  }

  onSubmit(): void {
    this.form.issue_form_data = true
    JSON.stringify(this.form)
    this.parrentAction.emit(JSON.stringify(this.form))
  }


  handleUpload(event: any) {
    this.form.attachment = []

    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let replacestring = 'data:' + file.type + ';base64,'
        let data = reader.result?.toString().replace(replacestring, '');
        this.form.attachment.push(
          {
            'file_data': data,
            'mime_type': file.type
          }
        )

      };
    }
  }

}
