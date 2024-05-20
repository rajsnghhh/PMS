import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-indent-request-form-data',
  templateUrl: './indent-request-form-data.component.html',
  styleUrls: ['./indent-request-form-data.component.scss']
})
export class IndentRequestFormDataComponent {
  environment = environment
  docUrl = ''
  localStorageData: any;
  userlist: any;

  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;

  @Output() parrentAction = new EventEmitter<any>();
  @Input() selectedMRDetails: any;

  form: any = {}

  @Input() prefieldData: any;
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
    if ((this.scope == 'update' || this.scope == 'view' || this.scope == 'print') && this.prefieldData?.id) {
      // this.form.created_by = this.prefieldData.requested_by
      this.form.line_in_bottom = this.prefieldData.line_in_bottom;
      this.form.remarks = this.prefieldData.remarks;
      this.form.attachments = this.prefieldData.attachments;
    }
    if (this.scope == 'view' || this.scope == 'print') {
      this.disabledEdit = true
    } else {
      // this.form.requested_by = this.localStorageData.user_id
      this.disabledEdit = false
    }

    if(this.scope == 'add' && this.selectedMRDetails.length>0) {
      this.setMrData()
    }
  }

  setMrData() {
      this.form.line_in_bottom = this.selectedMRDetails[0]?.material_request[0]?.line_in_bottom;
      this.form.remarks = this.selectedMRDetails[0]?.material_request[0]?.remarks;
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    this.getUserList()
    this.form = {
      indent_form_data: false,
      created_by: this.localStorageData ? this.localStorageData.user_id : '',
      line_in_bottom: '',
      remarks: '',
      // attachments : []
      // isFwdToOtherSite: '',
      // printIndentAfterSave: ''
    };

    if (this.scope == 'create' || this.scope == 'add') {
      this.form.attachments = []
    }

    this.docUrl = environment.API_URL1 + ''

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
            'organization': this.localStorageData.organisation_details[0].id,
            'file_data': data,
            'mime_type': file.type
          }
        )
      };
    }
  }

  onSubmit(): void {
    // this.form.indent_form_data = true
    // JSON.stringify(this.form)
    // this.parrentAction.emit(JSON.stringify(this.form))

    if (this.form.attachments.length > 0) {
      // this.form.attachments = this.form.attachments.filter((items: { id: any; }) => !items.id)
      this.form.indent_form_data = true
      JSON.stringify(this.form, null, 2)
      this.parrentAction.emit(JSON.stringify(this.form, null, 2))
    }
  }

}
