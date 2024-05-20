import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
declare var window: any;

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss',
  '../../../../assets/scss/scrollableTable.scss',
  '../../../../assets/scss/from-coomon.scss']
})
export class AssetComponent implements OnInit{

  
  localStorageData: any;
  assetList:any=[];
  pageSize: any = 10;
  page: any = 1;

  scope = ''
  selectedId = ''
  offcanvasedit :any
  offcanvasAdd :any
  deleteModal : any
  vendorList:any
  siteList:any;
  itemList:any;
  accountNameList:any;
  groupList:any;

  addUser: any = {
    location: '',
    item: '',
    item__material_type:'',
    vendor: '',
    asset_account: '',
    asset_no__icontains: '',
    purchase_date__gt:'',
    purchase_date__lt:'',

  }

  constructor(
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private apiservice:APIService
  ){}

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getAssetData();
    this.viewVendorList();
    this.getSiteList();
    this.viewItemList();
    this.getAccount();
    this.getMaterialGroup();

    this.offcanvasedit = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightEditRole')
    );
    this.offcanvasAdd = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightLabeladdrole')
    );
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('deleteUser')
    );
  }

  getMaterialGroup() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.groupList = data.results;
    })
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


  getAssetData() {
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData.organisation_details[0].id);
    this.procurementAPIService.getAssetDetails(params).subscribe(data => {
    this.assetList = data.results;
    });
  }

  onSearch() {
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData.organisation_details[0].id);
    params.set('location', this.addUser.location);
    params.set('item', this.addUser.item);
    params.set('item__material_type', this.addUser.item__material_type);
    params.set('vendor', this.addUser.vendor);
    params.set('asset_account', this.addUser.asset_account);
    params.set('asset_no__icontains', this.addUser.asset_no__icontains);
    params.set('purchase_date__gt', this.addUser.purchase_date__gt);
    params.set('purchase_date__lt', this.addUser.purchase_date__lt);

    this.procurementAPIService.getAssetDetails(params).subscribe(data => {
    this.assetList = data.results;
    });
  }

  closeCanvas() {
    this.scope = ''
    this.offcanvasedit.hide();
    this.offcanvasAdd.hide();
    this.deleteModal.hide();
    this.getAssetData();
    
  }

  editTaxid(id:any) {
    this.scope = 'edit'
    this.selectedId = id
  }

  deleteTaxid(id:any){
    this.selectedId = id
  }

  addnew() {
    this.scope = 'add'
  }

  deleteAlertCompany() {
    let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('id', this.selectedId);
      params.set('method','delete')
      this.procurementAPIService.deleteAsset(params).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessDelete, '', {
          timeOut: 2000,
        });
        this.closeCanvas()
      })
  }
}
