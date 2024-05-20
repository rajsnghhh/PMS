import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';


@Component({
  selector: 'app-tax-invoice-challan-list',
  templateUrl: './tax-invoice-challan-list.component.html',
  styleUrls: ['./tax-invoice-challan-list.component.scss',
  '../../../../../assets/scss/scrollableTable.scss']
})
export class TaxInvoiceChallanListComponent implements OnInit{

  
  localStorageData: any;
  itemList: any=[];
  siteList: any=[];
  vendorList: any=[];
  materialGroupList: any=[];
  taxInvoiceList:any=[]
  issueCheckboxIds: number[] = [];
  isTaxInvoice_Approver:boolean=false;


  form: any = {
    organization: '',
    is_rcm:'',
    from_date: '',
    to_date: '',
    siteName: '',
    site:'',
    group: '',
    groupName: '',
    item: '',
    itemName: '',
    bill_no: '',
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
    this.getTaxInvoiceList();
    this.viewItemList();
    this.getSiteList();
    this.viewVendorList();
    this.getmasterList();
    this.getUserDetails()

  }

  
  getUserDetails() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      const rolesArray = data?.results[0]?.user_permissions

      if (rolesArray.includes('procurement-tax-invoice-approver')) {
        this.isTaxInvoice_Approver = true;
      }
    })
  }

  onSubmit() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params.set('inv_date__gte', this.form.from_date);
    params.set('inv_date__lte', this.form.to_date);
    params.set('bill_no__icontains', this.form.bill_no);
    params.set('site__in', this.form.site.toString());
    params.set('is_rcm', this.form.is_rcm);
    params.set('procurement_tax_invoice_items_master__material__material_type__in', this.form.group.toString());
    params.set('procurement_tax_invoice_items_master__material__in', this.form.item.toString());
    params.set('transporter__in', this.form.vendor.toString());


    this.procurementAPIService.getTaxInvoice(params).subscribe(data => {
      this.taxInvoiceList = data.results;
    })
  }

  getTaxInvoiceList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params.set('all', 'true');

    this.procurementAPIService.getTaxInvoice(params).subscribe(data => {
      this.taxInvoiceList = data.results;
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
