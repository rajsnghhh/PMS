import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-freight-contract-add-edit',
  templateUrl: './freight-contract-add-edit.component.html',
  styleUrls: [
    './freight-contract-add-edit.component.scss',
    '../../../../../assets/scss/from-coomon.scss'
  ]
})
export class FreightContractAddEditComponent {
  @Input()
  canvasScope!: any;

  @Input()
  selectedID!: any;

  accountList:any = []
  cityList:any = []

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
    this.getAccountHeadList()
    this.getCity()
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
      this.procurementApiService.updateFreight(params,this.addPersonalInformation).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.CloseComponent()
      })
    }else {
      this.procurementApiService.addFreight(params,this.addPersonalInformation).subscribe(data => {
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
    this.procurementApiService.getProcurementFreightDetails(req).subscribe(data => {
      this.addPersonalInformation.id = data.id
      this.addPersonalInformation.effective_date = data.effective_date
      this.addPersonalInformation.source_city = data.source_city
      this.addPersonalInformation.destination_city = data.destination_city
      this.addPersonalInformation.distance = data.distance
      this.addPersonalInformation.tolerance_level = data.tolerance_level
      this.addPersonalInformation.account = data.account
      this.addPersonalInformation.rate_mt = data.rate_mt
      this.addPersonalInformation.rate_bag = data.rate_bag
      
      
    })
  }


  getAccountHeadList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getAccountHeads(params).subscribe(data => {
      this.accountList = data.results
    })
  }

  getCity(){
    let params = new URLSearchParams();
    params.set('country_id','102')
    this.apiservice.getCityList(params).subscribe(data => {
      this.cityList = data;
    })
  }

  

  CloseComponent() {
    this.closeCanvas.emit()
  }

}
