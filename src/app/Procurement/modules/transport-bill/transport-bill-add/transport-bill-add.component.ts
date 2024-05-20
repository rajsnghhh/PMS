import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-transport-bill-add',
  templateUrl: './transport-bill-add.component.html',
  styleUrls: ['./transport-bill-add.component.scss',
  '../../../../../assets/scss/scrollableTable.scss']
})
export class TransportBillAddComponent {

  localStorageData: any;
  itemList: any=[];
  siteList: any=[];
  vendorList: any=[];
  storeList:any=[]
  materialGroupList: any=[];

  form: any = {
    organization: '',
    from_date: '',
    to_date: '',
    siteName: '',
    transporter:'',
    transporterName:'',
    site:'',
    group: '',
    groupName: '',
    item: '',
    itemName: '',
    from_location: '',
    to_location:'',
    vendorName: '',
    vendor:'',
    transporter_bill_to:'',
    transporter_bill_toName:''
  };

  constructor(
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private procurementAPIService: PROCUREMENTAPIService,
    private router: Router,
    private activeroute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    // this.form.site.push(this.localStorageData?.site_data.id);
    this.viewItemList();
    this.getSiteList();
    this.viewVendorList();
    this.getmasterList();
    this.getStoreList();
  }

  onSubmit() {
     this.datasharedservice.setsharedData(this.form);
     this.router.navigateByUrl('/pms/store/procurement/transport-bill/create-bill');
    }

  getStoreList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
    })

  }

  getmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialGroupList = data.results
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

  viewItemList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.itemList = data.results;
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

}
