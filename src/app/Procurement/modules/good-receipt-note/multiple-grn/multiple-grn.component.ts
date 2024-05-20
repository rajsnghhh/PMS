import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { DataSharingService } from '../../purchase/data-sharing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-multiple-grn',
  templateUrl: './multiple-grn.component.html',
  styleUrls: ['./multiple-grn.component.scss',
    '../../../../../assets/scss/scrollableTable.scss']

})
export class MultipleGrnComponent implements OnInit {

  localStorageData: any;
  masterlist: any;
  uomList: any;
  vendorList: any;
  accountNameList: any;
  siteList: any;

  form: any = {
    grn_table_data: false,
    grn_items: [],
    site: ''
  };
  receivedData: any;

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private procurementApiService: PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private dataService: DataSharingService,
    private router:Router
  ) {

  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.dataService.sharedData$.subscribe(data => {
      this.receivedData = data && data.sendProjectSite;
    });

    this.getUomList()
    this.getmasterList()
    this.viewVendorList()
    this.getAccount()
    this.getSiteList()

    this.form.grn_items.push({
      "organization": this.localStorageData.organisation_details[0].id,
      MaterialBOQ: [],
      currentStock: '',
      fill_item_by_party: false,
      is_royalty: false,
      is_warranty: false,
      is_istp: false
    })
  }

  addMoreGRNItems() {
    this.form.grn_items.push({
      "organization": this.localStorageData.organisation_details[0].id,
      MaterialBOQ: [],
      currentStock: '',
      fill_item_by_party: false,
      is_royalty: false,
      is_warranty: false,
      is_istp: false
    })
  }

  getUomList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
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
  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorList = data.results;
    })
  }
  getAccount() {
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementApiService.getAccountHead(params).subscribe(data => {
      this.accountNameList = data.results;
    });
  }
  getmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.masterlist = data.results
      // this.generateMaterialData()
    })
  }

  setMaterialSubGroup(index: number, typeid: any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.form.grn_items[index].MaterilSubGroupList = data.results;
    })
  }

  setMaterialList(i: any, subtypeId: any) {
    let params2 = new URLSearchParams();
    params2.set('organization_id', this.localStorageData.organisation_details[0].id);
    params2.set('material_type', subtypeId);
    params2.set('page', '1');
    params2.set('page_size', '1000');

    this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
      this.form.grn_items[i].MaterilFilterList = data2.results;
    })
    // ========= getting materials =========
  }


  onCheckfill_item_by_party(index: any) {
    if (this.form.grn_items[index].fill_item_by_party) {
      this.form.grn_items[index].fill_item_by_party = true;
    } else {
      this.form.grn_items[index].fill_item_by_party = false;
    }
  }

  setMaterialMasterData(index: number) {
    //this.getProcurementMaterialDetails(index)
    for (let i = 0; i < this.masterlist.length; i++) {
      if (this.masterlist[i].id == this.form.grn_items[index].requested_material) {
        this.form.grn_items[index].MaterialmasterData = this.masterlist[i]
        break;
      }
    }
  }

  getProcurementMaterialDetails(index: any) {

    let params = new URLSearchParams();
    params.set('id', this.form.grn_items[index].item);
    // params.set('project', this.form.grn_items[index].project_id);
    params.set('project', this.receivedData?.projectId)
    this.procurementApiService.getProcurementMaterialDetails(params).subscribe(data => {
      this.form.grn_items[index].MaterialBOQ = data.Data
      this.form.grn_items[index].total_received_uptodate = (data.results[0]?.total_recieved_quantity) ? (data.results[0]?.total_recieved_quantity) : 0      
      this.form.grn_items[index].budgeted_qty = (data.results[0]?.total_project_quantity) ? (data.results[0]?.total_project_quantity) : 0
      this.form.grn_items[index].currentStock = (data.results[0]?.total_balance_quantity)? (data.results[0]?.total_balance_quantity) : 0
    })
    this.form.grn_items[index].currentStock = '0'

    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);
    // req.set('site', this.form.grn_items[index].site_id)
    req.set('site', this.receivedData?.siteId)

    req.set('material', this.form.grn_items[index].item);

    this.procurementApiService.getProcurementInventoryDetails(req).subscribe(data => {
      
      this.form.grn_items[index].stock_on_site = (data.results[0]?.quantity)? (data.results[0]?.quantity) : 0
      
    })
  }

  calculateShowAmount(index: number): void {
    const item = this.form.grn_items[index];
    item.show_amount = item.received_quantity * item.amount;
  }


  delete(index: any) {
    this.form.grn_items.splice(index, 1);
  }

  onSubmit() {
    let req = {
      site: this.form.site,
      grn_datas: this.form.grn_items
    }

    this.procurementApiService.addMultipleGRN(req).subscribe(data => {

      this.toastrService.success('Grn Created Successfully', '', {
        timeOut: 2000,
      });

      this.router.navigateByUrl('/pms/store/procurement/grn');
    })
  }
}
