import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-approval-doc-type-add-edit',
  templateUrl: './approval-doc-type-add-edit.component.html',
  styleUrls: [
    './approval-doc-type-add-edit.component.scss',
    '../../../../../assets/scss/from-coomon.scss'
  ]
})
export class ApprovalDocTypeAddEditComponent {
  @Input()
  canvasScope!: any;

  indentList : any = []

  @Input()
  selectedID!: any;

  @Output() closeCanvas = new EventEmitter<string>();

  constructor(
    private apiservice : APIService,
    private procurementApiService : PROCUREMENTAPIService,
    private datasharedservice : DataSharedService,
    private toastrService: ToastrService,

  ) {}

  localStorageData :any


  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getProcurementIndentRequest()
  }


  ngOnChanges(changes: SimpleChanges): void {
    if((this.canvasScope == 'view' || this.canvasScope == 'update') && this.selectedID) {
      this.generatePrePopulateData()
    }
  }



  addPersonalInformation : any = {}

  personalSubmit() {

    let params = new URLSearchParams();
    this.addPersonalInformation["organization"] = this.localStorageData.organisation_details[0].id

    if(this.addPersonalInformation.id) {
      params.set('id', this.selectedID);
      params.set('method', 'edit');
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      this.procurementApiService.updateADoc(params,this.addPersonalInformation).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.CloseComponent()
      })
    }else {
      this.procurementApiService.addADoc(params,this.addPersonalInformation).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
        this.CloseComponent()
      })
    }
  }


  generatePrePopulateData() {
    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);
    req.set('id', this.selectedID);
    this.procurementApiService.getProcurementADocDetails(req).subscribe(data => {
      this.addPersonalInformation.id = data.id
      this.addPersonalInformation.indent = data.indent
      this.addPersonalInformation.department_type = data.department_type
    })
  }


  getProcurementIndentRequest() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProcurementIndentRequest(params).subscribe(data => {
      this.indentList = data.results.Data
    })
  }
  

  CloseComponent() {
    this.closeCanvas.emit()
  }
}
