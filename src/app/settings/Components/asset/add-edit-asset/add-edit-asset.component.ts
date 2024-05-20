import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';


@Component({
  selector: 'app-add-edit-asset',
  templateUrl: './add-edit-asset.component.html',
  styleUrls: ['./add-edit-asset.component.scss',
  '../../../../../assets/scss/from-coomon.scss'
]
})
export class AddEditAssetComponent implements OnInit{


  @Input()
  scope!: any;
  @Input()
  selectedId!: any;

  @Output()
  parentFun = new EventEmitter<string>();

  addUser: any = {
    organization:'',
    status: '',
    location : '',
    use_full_life :'0',
    asset_no :'',
    auto_assets_np:'',
    max_depreciation:'0',
    purchase_date :'',
    pur_amt :'0',
    sale_date:'',
    sale_amt :'0',
    wdv :false,
    item :'',
    depreciation_group :'',
    vendor:'',
    asset_account:'',
    depreciation:'0'
  }

  localStorageData: any;
  itemList:any;
  siteList:any;
  accountNameList:any;
  depreciationList:any;
  vendorList:any=[];

  constructor(
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private apiservice:APIService
  ){}

  ngOnChanges(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if (this.scope == 'edit' && this.selectedId) {
      this.getEditData()
    }
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getSiteList();
    this.viewItemList();
    this.getAccount();
    this.viewVendorList();
    this.getDepreciationList();
  }

  changeDepreciation(dataid:any){
    this.addUser.depreciation=this.depreciationList.find((data:any)=>data.id==dataid).depr_grp_per;
  }

  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    this.apiservice.getVendorList(params).subscribe(data => {
      this.changeVendorStructure(data.results);
    })
  }

  changeVendorStructure(Value:any){
    this.vendorList=[];
    for(let vendor of Value){
       let obj={
        id:vendor.id,
        name:''
       }
       for(let venname of vendor.vendor_master_data){
        if(venname.form_label=='Vendor Name'){
          obj.name=venname.value;
        }
       }
       this.vendorList.push(obj)
    }
  }

  getDepreciationList() {
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    this.apiservice.getDepreciationGroupList(params).subscribe(data => {
      this.depreciationList = data.results;
    })
  }

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })
  }

  getAccount(){
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementAPIService.getAccountHead(params).subscribe(data => {
    this.accountNameList = data.results;
    });
  }

  viewItemList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.itemList = data.results;
    })
  }

  getEditData() {
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData.organisation_details[0].id);
    params.set('id', this.selectedId);

    this.procurementAPIService.getAssetDetails(params).subscribe(data => {
      this.addUser.status = data.status;
      this.addUser.location = data.location;
      this.addUser.use_full_life=data.use_full_life.toString();
      this.addUser.asset_no=data.asset_no;
      this.addUser.auto_assets_np=data.auto_assets_np;
      this.addUser.max_depreciation=data.max_depreciation.toString();
      this.addUser.purchase_date=data.purchase_date;
      this.addUser.pur_amt=data.pur_amt.toString();
      this.addUser.sale_date=data.sale_date;
      this.addUser.sale_amt=data.sale_amt.toString();
      this.addUser.wdv=data.wdv;
      this.addUser.item=data.item;
      this.addUser.depreciation_group = data.depreciation_group;
      this.addUser.vendor=data.vendor;
      this.addUser.depreciation=data.depreciation.toString();
      this.addUser.asset_account=data.asset_account;
    })
  }
 
  onSubmit() {
    this.addUser.organization = this.localStorageData.organisation_details[0].id;

      if (this.selectedId) {
        let params = new URLSearchParams();
        params.set('id', this.selectedId);
        params.set('method', 'edit')
        this.procurementAPIService.editAsset(params, this.addUser).subscribe(data => {
          this.toastrService.success(Success_Messages.SuccessUpdate, '', {
            timeOut: 2000,
          });
          this.parentFun.emit();
        })
      } else {
       
        let params = new URLSearchParams();
         params.set('organization', this.localStorageData.organisation_details[0].id);
        this.procurementAPIService.addAsset(params,this.addUser).subscribe(data => {
          this.toastrService.success(Success_Messages.SuccessAdd, '', {
            timeOut: 2000,
          });
          this.parentFun.emit();
        })
      }


  }

  resetADD(form: NgForm): void {
    this.parentFun.emit();
    form.reset();
  }

}
