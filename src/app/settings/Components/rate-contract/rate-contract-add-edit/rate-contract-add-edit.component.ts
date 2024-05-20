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

  accountList : any = []
  materialTypeList : any = []
  materialItemList : any = []
  siteList : any = []
  taxHeads : any = []

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
    this.getAccountHeadList()
    this.getMaterialType()
    this.getSiteList()
    this.getTaxHeadData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if((this.canvasScope == 'view' || this.canvasScope == 'update') && this.selectedID) {
      this.generatePrePopulateData()
    }
  }

  getTaxHeadData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementApiService.getTaxHeadDetails(params).subscribe(data => {
      this.taxHeads = data.results
    });
  }



  addPersonalInformation : any = {}

  personalSubmit() {

    let params = new URLSearchParams();
    this.addPersonalInformation["organization"] = this.localStorageData.organisation_details[0].id

    if(this.addPersonalInformation.id) {
      params.set('id', this.selectedID);
      params.set('method', 'edit');
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      this.procurementApiService.updateRate(params,this.addPersonalInformation).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.CloseComponent()
      })
    }else {
      this.procurementApiService.addRate(params,this.addPersonalInformation).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
        this.CloseComponent()
      })
    }
  }

  getAccountHeadList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getAccountHeads(params).subscribe(data => {
      this.accountList = data.results
    })
  }

  setmaterialItemList() {
    let filter = this.materialTypeList.filter((item: { id: any; }) => item.id == this.addPersonalInformation?.item_group)
    if(filter.length > 0) {
      this.materialItemList = filter[0].material_master
    } else {
      this.materialItemList = []
    }
  }


  generatePrePopulateData() {
    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);
    req.set('id', this.selectedID);
    this.procurementApiService.getProcurementRateDetails(req).subscribe(data => {
      this.addPersonalInformation.id = data.id
      this.addPersonalInformation.entry_date = data.entry_date
      this.addPersonalInformation.effect_date = data.effect_date
      this.addPersonalInformation.item_group = data.item_group
      this.addPersonalInformation.account = data.account
      this.addPersonalInformation.site = data.site
      this.addPersonalInformation.item = data.item
      this.addPersonalInformation.tax_type = data.tax_type
      this.addPersonalInformation.company_rate = data.company_rate
      this.addPersonalInformation.company_discount = data.company_discount
      this.addPersonalInformation.basic_rate = data.basic_rate
      this.addPersonalInformation.edu_percentage = data.edu_percentage
      this.addPersonalInformation.edu_amount = data.edu_amount
      this.addPersonalInformation.excise_percentage = data.excise_percentage
      this.addPersonalInformation.excise_amount = data.excise_amount
      this.addPersonalInformation.she_percentage = data.she_percentage
      this.addPersonalInformation.she_amount = data.she_amount
      this.addPersonalInformation.cst_percentage = data.cst_percentage
      this.addPersonalInformation.cst_amount = data.cst_amount



      this.addPersonalInformation.vat_percentage = data.vat_percentage
      this.addPersonalInformation.vat_amount = data.vat_amount
      this.addPersonalInformation.total_rate = data.total_rate
      this.addPersonalInformation.discount = data.discount
      this.addPersonalInformation.invoice_rate = data.invoice_rate
      this.addPersonalInformation.additional_discount = data.additional_discount
      this.addPersonalInformation.net_rate = data.net_rate
      this.setmaterialItemList()
    })
  }

  calculate() {
    this.addPersonalInformation.basic_rate = this.addPersonalInformation?.company_rate - this.addPersonalInformation?.company_discount
    this.addPersonalInformation.edu_amount = ((this.addPersonalInformation?.basic_rate * this.addPersonalInformation?.edu_percentage)/100).toFixed(2);
    this.addPersonalInformation.excise_amount = ((this.addPersonalInformation?.basic_rate * this.addPersonalInformation?.excise_percentage)/100).toFixed(2);
    this.addPersonalInformation.she_amount = ((this.addPersonalInformation?.basic_rate * this.addPersonalInformation?.she_percentage)/100).toFixed(2);
    this.addPersonalInformation.cst_amount = ((this.addPersonalInformation?.basic_rate * this.addPersonalInformation?.cst_percentage)/100).toFixed(2);
    this.addPersonalInformation.vat_amount = ((this.addPersonalInformation?.basic_rate * this.addPersonalInformation?.vat_percentage)/100).toFixed(2);
    this.addPersonalInformation.total_rate = parseInt(this.addPersonalInformation?.basic_rate) + parseInt(this.addPersonalInformation?.edu_amount) + parseInt(this.addPersonalInformation?.excise_amount) + parseInt(this.addPersonalInformation?.she_amount) + parseInt(this.addPersonalInformation?.cst_amount) + parseInt(this.addPersonalInformation?.vat_amount) 
    this.addPersonalInformation.invoice_rate = this.addPersonalInformation?.total_rate - this.addPersonalInformation.discount
    this.addPersonalInformation.net_rate = this.addPersonalInformation?.invoice_rate - this.addPersonalInformation.additional_discount
  }

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('project', this.selectedMRDetails.project);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })

  }

  getMaterialType() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialTypeList = data.results;      
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
