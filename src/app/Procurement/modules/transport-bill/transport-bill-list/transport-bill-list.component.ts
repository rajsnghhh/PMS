import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-transport-bill-list',
  templateUrl: './transport-bill-list.component.html',
  styleUrls: ['./transport-bill-list.component.scss',
  '../../../../../assets/scss/scrollableTable.scss']
})
export class TransportBillListComponent implements OnInit {

  localStorageData: any;
  vendorList: any = [];
  transportBillList:any=[]
  siteList:any=[];
  isTransportBill_Approver:boolean=false;

  form: any = {
    organization: '',
    date__lte:'',
    date__gte:'',
    invoice_no: '',
    bill_no: '',
    bill_date:'',
    hsn_sac_code: '',
    transporter: '',
    site: '',
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
    this.viewVendorList()
    this.getTransportBillList();
    this.getSiteList()
    this.getUserDetails();
  }

  getUserDetails() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      const rolesArray = data?.results[0]?.user_permissions

      if (rolesArray.includes('procurement-transporter-bill-approver')) {
        this.isTransportBill_Approver = true;
      }
    })
  }

  onSubmit(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    params.set('date__lte', this.form.date__lte);
    params.set('date__gte',this.form.date__gte);
    params.set('invoice_no', this.form.invoice_no);
    params.set('bill_no',this.form.bill_no);
    params.set('bill_date', this.form.bill_date);
    params.set('hsn_sac_code',this.form.hsn_sac_code);
    params.set('transporter__in', this.form.transporter);
    params.set('site__in',this.form.site);

    this.procurementAPIService.getTransportBill(params).subscribe(data => {
      this.transportBillList = data.results;
    })
  }

  getTransportBillList(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    params.set('site', this.localStorageData.site_data.id);
    this.procurementAPIService.getTransportBill(params).subscribe(data => {
      this.transportBillList = data.results;
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
}
