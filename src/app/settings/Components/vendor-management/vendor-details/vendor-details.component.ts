import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { DynamicFormsComponent } from 'src/app/Shared/Module/dynamic-forms/dynamic-forms.component';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss',
    '../../../../../assets/scss/scrollableTable.scss']
})

export class VendorDetailsComponent implements OnInit, OnChanges {

  @Output()
  parentFun = new EventEmitter<string>();
  @Input() viewItem: any;
  MenuFormList: any;
  form_type = '';
  ActionButtonName = ''
  localStorageData: any;
  formFieldList: any = [];
  prefieldData: any = [];
  tyofForm: any;
  VendorId: any;

  @ViewChild('dynamicForm')
  dynamicForm!: DynamicFormsComponent;

  @Input()
  VendorData!: any;

  vendorList: any = [];
  userPermissions: any = {};
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  @Input()
  formData!: any;

  @Input()
  reload!: any;

  

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService,

  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.getPrefildData();
  }

  ngOnInit(): void {
    this.getSideMenuList();
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if(this.datasharedservice.getLocalData('vendor_id')){
      this.VendorId = JSON.parse(this.datasharedservice.getLocalData('vendor_id')).id;
    }
  }

  viewVendorList(venderId: any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('vendor_id', this.VendorId);
    this.apiservice.getVendorList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      for (let i = 0; i < data.results.length; i++) {
        if (data.results[i].id == venderId) {
          this.vendorList = data.results[i];
        }
      }
    })
  }

  getSideMenuList() {
    let params = new URLSearchParams();
    params.set('menu_id', '6')
    this.apiservice.getMenuFormList(params).subscribe(data => {
      this.MenuFormList = data.results;
      this.changeNav(this.MenuFormList[0]?.button_name)
      this.ActionButtonName = this.MenuFormList[0]?.button_name
    });
  }

  changeNav(button_name: string) {
    this.form_type = 'vender-details'
    this.ActionButtonName = button_name;
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('form_type', this.form_type);

    this.apiservice.getDynamicForm(params).subscribe(data => {
      this.formFieldList = data.results;
      this.prefieldData = [];
    });

  }

  getPrefildData() {
    if (this.viewItem?.vendor_master_data) {
      this.viewItem.tender_data = this.viewItem?.vendor_master_data;
      this.viewItem.vendor_master_data = []
    }
    let prefield = {
      "results": this.viewItem
    }
    this.prefieldData = prefield;
  }

  genarateMaterialData(jsonData: any) {
    let req = JSON.parse(jsonData)
    let form_datatest = new FormData();
    for (const [key, value] of Object.entries(req.data)) {
      if (value) {
        form_datatest.append(key, value.toString())
      }
    }
    let fileSet = this.datasharedservice.getObservableData1()
    for (var key in fileSet) {
      form_datatest.append(key, fileSet[key])
    }

    let query = this.commonFunction.getURL(
      {
        organization_id: this.localStorageData.organisation_details[0].id,
        vendor_id: this.viewItem?.id ? this.viewItem?.id : 'null',
        form_type: this.form_type
      }
    )
    this.saveMaterialData(query, form_datatest)
  }

  saveMaterialData(query: string, data: any) {
    this.apiservice.saveVendorData(query, data).subscribe((data: any) => {
      if (this.viewItem?.vendor_master_data) {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
      } else {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
      }
      setTimeout(function () {
        window.location.reload();
      }, 2000);
      this.parentFun.emit();
      this.dynamicForm.resetForm();
    }, err => {
      if (err.error.error) {
        this.toastrService.error(err.error.error, '', {
          timeOut: 2000,
        });
      } else {
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      }
    })

  }

  expandSpecificElement(serialNo: any) {
    this.formData[serialNo].colapseStatus = !this.formData[serialNo].colapseStatus;
  }

}

