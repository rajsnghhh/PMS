import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-purchase-below-table',
  templateUrl: './purchase-below-table.component.html',
  styleUrls: ['./purchase-below-table.component.scss']
})
export class PurchaseBelowTableComponent implements OnInit, OnChanges {
  environment = environment
  docUrl = ''
  disabledEdit = true
  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;
  localStorageData : any
  userlist:any = []
  @Input() reload: any;

  constructor(
    private apiservice : APIService,
    private datasharedservice : DataSharedService,
    private activeroute: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA')); 
    this.getUserList() 
    this.docUrl = environment.API_URL1+''
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA')); 
    if(((this.scope == 'update' || this.scope == 'view' || this.scope == 'print') && this.prefieldData.id)|| this.activeroute.snapshot.paramMap.get('grnID')) {
      this.form.t_and_c = this.prefieldData.t_and_c
      this.form.jurisdiction = this.prefieldData.jurisdiction
      this.form.remarks = this.prefieldData.remarks
      this.form.attachments = this.prefieldData.attachments
      // this.form.line_in_bottom = this.prefieldData.line_in_bottom
    }
    if(this.scope == 'view' || this.scope == 'print') {
      this.disabledEdit = true
    } else {
      this.form.requested_by = this.localStorageData.user_id
      this.disabledEdit = false
    }
  }

  @Output() parrentAction = new EventEmitter<any>();

  @Input() prefieldData: any;
  @Input() scope: any;

  
  form:any = {
    purchase_bottom : false,
    t_and_c : '',
    // line_in_bottom : '',
    remarks : '',
    attachments : []

  };
  
  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }


  onSubmit(): void {
    this.form.purchase_bottom = true
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
              'organization' : this.localStorageData.organisation_details[0].id,
              'file_data':data,
              'mime_type':file.type
            }
          )
      };
    }
}


}
