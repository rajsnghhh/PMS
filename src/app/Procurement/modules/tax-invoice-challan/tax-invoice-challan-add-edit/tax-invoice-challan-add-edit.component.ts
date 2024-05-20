import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-tax-invoice-challan-add-edit',
  templateUrl: './tax-invoice-challan-add-edit.component.html',
  styleUrls: ['./tax-invoice-challan-add-edit.component.scss',
  '../../../../../assets/scss/scrollableTable.scss']
})
export class TaxInvoiceChallanAddEditComponent implements OnInit{


  localStorageData: any;
  itemList: any=[];
  siteList: any=[];
  vendorList: any=[];
  materialGroupList: any=[];
  procurementIssueList:any=[]
  issueCheckboxIds: number[] = [];

  form: any = {
    organization: '',
    date_by:'',
    from_date: '',
    to_date: '',
    siteName: '',
    site:'',
    group: '',
    groupName: '',
    item: '',
    itemName: '',
    issue_location: '',
    vendorName: '',
    vendor:'',
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
    this.getProcurementIssueList();
    this.viewItemList();
    this.getSiteList();
    this.viewVendorList();
    this.getmasterList();
  }

  onSubmit() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params.set('created_at__gt', this.form.from_date);
    params.set('created_at__lt', this.form.to_date);
    params.set('material_issue__site__in', this.form.site.toString());
    params.set('issue_location', this.form.issue_location);
    params.set('requested_material__in', this.form.item.toString());
    params.set('requested_material__material_type__in', this.form.group.toString());
    params.set('material_issue__vendor__in', this.form.vendor.toString());
    
    this.procurementAPIService.getProcurementIssueList(params).subscribe(data => {
      this.procurementIssueList = data.results?.Data;
    })
  }

  onIssueCheckboxChange(event: any, itemId: number) {
    if (event.target.checked) {
      this.issueCheckboxIds.push(itemId);
    } else {
      const index = this.issueCheckboxIds.indexOf(itemId);
      if (index !== -1) {
        this.issueCheckboxIds.splice(index, 1);
      }
    }

  }

  invoiceByIDs() {
    this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/tax-invoice-challan/request/' + this.issueCheckboxIds.join(',')])
  }

  getProcurementIssueList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params.set('material_issue__project', this.localStorageData?.project_data?.id)
    params.set('material_issue__site', this.localStorageData?.site_data?.id);
    params.set('material_issue__financialyear', this.localStorageData.financial_year[0].id);
    params.set('is_chargeable', '1');
    
    this.procurementAPIService.getProcurementIssueList(params).subscribe(data => {
      this.procurementIssueList = data.results?.Data;
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
