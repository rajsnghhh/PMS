import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-debit-note',
  templateUrl: './debit-note.component.html',
  styleUrls: [
    './debit-note.component.scss',
    '../../../../../assets/scss/scrollableTable.scss',
    '../../../../../assets/scss/micro-view-table.scss',
    '../../../../../assets/scss/tableactionButton.scss'
  ]
})
export class DebitNoteComponent {
  localStorageData: any;
  debitNoteList: any;
  itemList: any;
  siteList: any;
  deleteBrandDetails: any;
  prefieldData: any = {}


  form: any = {
    voucher_no: '',
    date__gte: '',
    date__lte: '',
    number_of_jobs: '',
    site: '',
    procurement_item_stock_jv_item__item__in: '',
  };

  constructor(
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private procurementAPIService: PROCUREMENTAPIService,
    private router: Router,
    private activeroute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.localStorageData = JSON.parse(
      this.datasharedservice.getLocalData('userDATA')
    );
    this.getData();

    // this.viewItemList();
    // this.getSiteList();
  }

  onSearch() {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData.organisation_details[0].id
    );
    params.set('voucher_no', this.form.voucher_no);
    params.set('date__gte', this.form.date__gte);
    params.set('date__lte', this.form.date__lte);
    params.set('number_of_jobs', this.form.number_of_jobs);
    params.set('site', this.form.site);
    params.set(
      'procurement_fabrication_work_raw_materials__material__in',
      this.form.procurement_item_stock_jv_item__item__in.toString()
    );

    this.procurementAPIService.getFabricationWork(params).subscribe((data) => {
      this.debitNoteList = data.results;

      // this.debitNoteList.forEach((_covenants: any) => {
      //   _covenants.isExpanded = false;
      // });
    });
  }

  viewItemList() {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData.organisation_details[0].id
    );
    this.apiservice.getMaterialManagementList(params).subscribe((data) => {
      this.itemList = data.results;
    });
  }

  getSiteList() {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData.organisation_details[0].id
    );
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe((data) => {
      this.siteList = data.results;
    });
  }

  getData() {
    let params = new URLSearchParams();
    params.set(
      'organization_id', this.localStorageData.organisation_details[0].id
    );
    params.set('site', this.localStorageData.site_data.id);
    this.procurementAPIService.getMaterialIssueDebitNote(params).subscribe((data) => {
      this.debitNoteList = data.results;
      // this.debitNoteList.forEach((_covenants: any) => {
      //   _covenants.isExpanded = false;
      // });
    });
  }

  updateByID(id: any) {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/debit-note/edit/' + id)
  }
  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }

  

  deleteAlertBrand(brand: any) {
    this.deleteBrandDetails = brand;
  }

  deleteBrand(){
    let params = new URLSearchParams();
    params.set('id', this.deleteBrandDetails.id);
    params.set('method', 'delete');
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);

    this.procurementAPIService.deleteGeneralAdminExpenses(params).subscribe((res: any) => {
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
