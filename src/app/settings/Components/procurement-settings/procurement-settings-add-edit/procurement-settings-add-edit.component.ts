import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-procurement-settings-add-edit',
  templateUrl: './procurement-settings-add-edit.component.html',
  styleUrls: [
    './procurement-settings-add-edit.component.scss',
    '../../../../../assets/scss/from-coomon.scss'
  ]
})
export class ProcurementSettingsAddEditComponent {
  @Input()
  canvasScope!: any;

  @Input()
  settingScope!: any;

  @Input()
  selectedID!: any;

  siteList : any = []

  userList : any = []

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
    this.getSiteList()
    this.getUserList()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if((this.canvasScope == 'view' || this.canvasScope == 'update') && this.selectedID) {
      this.generatePrePopulateData()
    }
  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userList = data
    })
  }



  addPersonalInformation : any = {}

  personalSubmit() {

    let params = new URLSearchParams();
    this.addPersonalInformation["organization"] = this.localStorageData.organisation_details[0].id
    this.addPersonalInformation["doctype"] = this.settingScope

    if(this.addPersonalInformation.id) {
      params.set('id', this.selectedID);
      params.set('method', 'edit');
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      this.procurementApiService.updateApprovalUser(params,this.addPersonalInformation).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.CloseComponent()
      })
    }else {
      this.procurementApiService.addApprovalUser(params,this.addPersonalInformation).subscribe(data => {
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
    this.procurementApiService.getProcurementApprovalUser(req).subscribe(data => {
      this.addPersonalInformation.id = data.id
      this.addPersonalInformation.max_value = data.max_value
      this.addPersonalInformation.min_value = data.min_value
      this.addPersonalInformation.site_ids = this.getsiteIDS(data.site)
      this.addPersonalInformation.user = data.user
    })
  }

  getsiteIDS(data:any) {
    let res = []
    for(let i=0;i<data.length;i++) {
      res.push(data[i].id)
    }
    return res
  }


  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })
  }
  

  CloseComponent() {
    this.closeCanvas.emit()
  }
}
