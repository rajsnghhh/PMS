import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { LocalStorageService } from 'src/app/Shared/Services/local-storage.service';
import * as Global from 'src/app/global';

@Component({
  selector: 'app-raw-material-sale-list',
  templateUrl: './raw-material-sale-list.component.html',
  styleUrls: [
    './raw-material-sale-list.component.scss',
    '../../../../../../assets/scss/micro-view-table.scss',
    '../../../../../../assets/scss/scrollableTable.scss',
    '../../../../../../assets/scss/tableactionButton.scss',
  ],
})
export class RawMaterialSaleListComponent {
  Global = Global;
  scope: any = 'list';
  localStorageData:any;
  purchaseOrderList: Array<any> = [];
  isRawMaterialSaleApprover: boolean = false;
  selected_items: any = [];
  selected: boolean[] = [];
  @Input() purchaseOrderAdvancedSearchFormValue: any;

  @Output() activeScope = new EventEmitter<any>();

  constructor(
    private procurementAPIService: PROCUREMENTAPIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    public router: Router,
    private activeroute: ActivatedRoute,
    private commonfunction: CommonFunctionService,
    private localStorage: LocalStorageService,
    private apiservice: APIService
  ) {}

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getPurchaseOrderList();
    this.getUserDetails();
  }

  ngOnChanges() {
    if (this.purchaseOrderAdvancedSearchFormValue) {
      this.getPurchaseOrderList();
    }
  }

  scopeChange(scope: any) {
    // this.activeScope.emit(scope);
    this.scope = scope;
    this.ngOnInit();
  }
  approveRawMaterials() {
    if (this.selected_items?.length) {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorage.organisation_id());
      params.set('type', 'raw-material-sales');
      this.procurementAPIService
        .updateProcurementSatatus(params, this.selected_items)
        .subscribe((data) => {
          this.toastrService.success(Success_Messages.SuccessUpdate, '', {
            timeOut: 2000,
          });
          for (let i = 0; i < this.selected.length; ++i) {
            this.selected[i] = false;
          }
          this.scope = 'list';
          this.getPurchaseOrderList();
        });
    } else {
      this.toastrService.error('Select Item to Approve.');
    }
  }
  editItem(item: any) {
    let path = item?.id;
    if (item?.tax_type == 'gst') {
      path = '/gst/' + item?.id;
    }
    this.router.navigate([
      '/pms/' +
        this.activeroute.snapshot.paramMap.get('procurementScope') +
        '/procurement/raw-material-sales/edit/' +
        path,
    ]);
  }

  getUserDetails() {
    this.apiservice.gettenderUserpermission().subscribe((data) => {
      const rolesArray = data?.results[0]?.user_permissions;
      if (rolesArray.includes('procurement-raw-material-sales-approver')) {
        this.isRawMaterialSaleApprover = true;
      }
    });
  }

  getPurchaseOrderList() {

    let params = new URLSearchParams();
    if (this.scope == 'list') {
      params.set('page_size', '1000');
    } else if (this.scope == 'approve') {
      params.set('status', 'pending');
    }
    params.set('organization_id', this.localStorage.organisation_id());
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    params.set('project', this.localStorageData?.project_data?.id)
    params.set('site', this.localStorageData?.site_data?.id)
    if (!this.purchaseOrderAdvancedSearchFormValue) {
      params.set('all', 'true');
    }

    if (this.purchaseOrderAdvancedSearchFormValue) {
      for (const [key, value] of Object.entries(
        this.purchaseOrderAdvancedSearchFormValue
      )) {
        let val = '' + value;
        let ky = '' + key;
        params.set(ky, val);
      }
    }
    this.procurementAPIService.getRawMaterialList(params).subscribe((data) => {
      this.purchaseOrderList = data.results;

      if (this.purchaseOrderList.length == 0) {
        this.toastrService.error('No data found', '', {
          timeOut: 2000,
        });
      }
    });
  }
 

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }

  printByID(id: any) {
    this.commonfunction.openOnNewTab(
      '/pms/' +
        this.activeroute.snapshot.paramMap.get('procurementScope') +
        '/procurement/purchase-order/print/' +
        id
    );
  }
  selectItems(event: any, id: string, i: number) {
    this.selected[i] = !this.selected[i];
    const index = this.selected_items.findIndex(
      (item: any) => parseInt(item.id) === parseInt(id)
    );

    if (event.target.checked) {
      // If not in the array, add it
      if (index === -1) {
        this.selected_items.push({
          id: id,
          status: 'approved',
        });
      }
    } else {
      if (index !== -1) {
        this.selected_items.splice(index, 1);
      }
    }
  }
}
