import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-rate-contract-add-edit',
  templateUrl: './rate-contract-add-edit.component.html',
  styleUrls: [
    './rate-contract-add-edit.component.scss',
    '../../../../../assets/scss/from-coomon.scss'
  ]
})
export class RateContractAddEditComponent {
  @Input()
  canvasScope!: any;

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
    this.getmasterList()
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
    if(!this.addPersonalInformation.store){
      this.addPersonalInformation.store = null
    } else {
      this.addPersonalInformation.site = null
    }

    if(this.addPersonalInformation.id) {
      params.set('id', this.selectedID);
      params.set('method', 'edit');
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      this.procurementApiService.updateInventory(params,this.addPersonalInformation).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.CloseComponent()
      })
    }else {
      this.procurementApiService.addInventory(params,this.addPersonalInformation).subscribe(data => {
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
    this.procurementApiService.getProcurementInventoryDetails(req).subscribe(data => {
      this.addPersonalInformation.id = data.id
      this.addPersonalInformation.group = data.item_group
      this.addPersonalInformation.subgroup = data.item_sub_group
      this.addPersonalInformation.material = data.material
      this.addPersonalInformation.opening_quantity = data.opening_quantity
      this.addPersonalInformation.quantity = data.quantity

      this.addPersonalInformation.remarks = data.remarks

      this.addPersonalInformation.site = data.site_disp
      this.addPersonalInformation.store = data.store
      

      this.addPersonalInformation.stock_type = data.stock_type

    })
  }


  getmasterList() {
    // let params = new URLSearchParams();
    // params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('all', 'true');
    // this.apiservice.getMaterialManagementList(params).subscribe(data => {
    //   this.materialList = data.results
    // })
  }
  

  CloseComponent() {
    this.closeCanvas.emit()
  }

}
