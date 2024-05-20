import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-gate-pass-add-bottom',
  templateUrl: './gate-pass-add-bottom.component.html',
  styleUrls: ['./gate-pass-add-bottom.component.scss']
})
export class GatePassAddBottomComponent {
  environment = environment
  docUrl = ''
  disabledEdit = true
  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;
  localStorageData : any
  userlist:any = []
  constructor(
    private apiservice : APIService,
    private datasharedservice : DataSharedService
  ) {

  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA')); 
    this.getUserList() 
    this.docUrl = environment.API_URL1+''
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA')); 
    if((this.scope == 'update' || this.scope == 'view' || this.scope == 'transportation') && this.prefieldData.id) {
      this.form.prepared_by = this.prefieldData.prepared_by
      this.form.remarks = this.prefieldData.remarks
    }
    if(this.scope == 'view' || this.scope == 'transportation') {
      this.disabledEdit = true
    } else {
      this.form.prepared_by = this.localStorageData.user_id
      this.disabledEdit = false
    }
  }

  @Output() parrentAction = new EventEmitter<any>();

  @Input() prefieldData: any;
  @Input() scope: any;

  
  form:any = {
    mr_bottom : false,
    prepared_by: "",
    remarks : '',
    attachments : []

  };
  
  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }


  onSubmit(): void {
    this.form.mr_bottom = true
    JSON.stringify(this.form, null, 2)
    this.parrentAction.emit(JSON.stringify(this.form, null, 2))
  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userlist = data
    })
  }

  handleUpload(event:any) {
    this.form.attachments = []
    for(let i=0;i<event.target.files.length;i++) {
      const file = event.target.files[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let replacestring = 'data:' +file.type +';base64,'
        let data = reader.result?.toString().replace(replacestring, '');
          this.form.attachments.push(
            {
              'file_data':data,
              'mime_type':file.type,
              'organization':this.localStorageData.organisation_details[0].id
            }
          )
      };
    }
}
}
