import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-enquiry-list',
  templateUrl: './enquiry-list.component.html',
  styleUrls: ['./enquiry-list.component.scss',
    '../../../../../assets/scss/scrollableTable.scss']
})
export class EnquiryListComponent {


  localStorageData: any;
  itemList: any;
  siteList: any;
  vendorList: any;
  materialGroupList: any;
  enquiryList: any;
  deleteEnquiryId:any;

  form: any = {
    request_code__icontains: '',
    vendor__in: '',
    procurement_rfq_vendors_items__requested_material__material_type__in: '',
    updated_at__gte: '',
    updated_at__lte: '',
    indent__site__in: '',
    procurement_rfq_vendors_items__requested_material__in: ''
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
    this.form.indent__site__in =this.localStorageData.site_data.id
    this.getData();
    this.viewItemList();
    this.getSiteList();
    this.viewVendorList();
    this.getmasterList();
  }

  onSearch() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    params.set('request_code__icontains', this.form.request_code__icontains);
    params.set('vendor__in', this.form.vendor__in.toString());
    params.set('procurement_rfq_vendors_items__requested_material__material_type__in', this.form.procurement_rfq_vendors_items__requested_material__material_type__in.toString());
    params.set('updated_at__gte', this.form.updated_at__gte);
    params.set('updated_at__lte', this.form.updated_at__lte);
    params.set('project', this.localStorageData.project_data.id);
    params.set('indent__site__in', this.form.indent__site__in);
    params.set('financialyear',this.localStorageData.financial_year[0].id);
    params.set('procurement_rfq_vendors_items__requested_material__in', this.form.procurement_rfq_vendors_items__requested_material__in.toString());

    this.procurementAPIService.getRfqVendors(params).subscribe(data => {
      this.enquiryList = data.results;
    });
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

  ViewquotationByID(id:any) {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/quotation/compare/' + id)
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
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

  getData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    params.set('project', this.localStorageData.project_data.id);
    params.set('financialyear',this.localStorageData.financial_year[0].id);
    params.set('indent__site__in', this.form.indent__site__in);
    params.set('all', 'true');

    this.procurementAPIService.getRfqVendors(params).subscribe(data => {
      this.enquiryList = data.results;
    });
  }


  editEnquiry(id: any) {
    this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/enquiry/update/'+id])
  }

  deleteEnquiry(id: number) {
    this.deleteEnquiryId = id;
  }

  deleteAlertCompany() {
    let params = new URLSearchParams();
    params.set('id', this.deleteEnquiryId);
    params.set('method', 'delete');
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);

    this.procurementAPIService.deleteEnquiry(params).subscribe((res: any) => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.getData();
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

}
