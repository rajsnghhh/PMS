import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-section-rack-setting',
  templateUrl: './section-rack-setting.component.html',
  styleUrls: [
    './section-rack-setting.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class SectionRackSettingComponent implements OnInit {
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  localStorageData: any;

  rackSettingList: Array<any> = [];
  onEditRackData: any;
  onEditAccess: any;

  addUpdateRackSetting: string = 'Add Rack Setting';
  deleteRackDetails: any;
  // rackCat: boolean = false;
  rackSetting: boolean = false;
  setRackViewList: Array<any> = [];

  @ViewChild('closeButton') closeButton!: ElementRef;

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getRackSettingList();
  }

  getRackSettingList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page_size', '1000');

    this.apiservice.getRackSettingList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.rackSettingList = data.results;
      this.rackSetting = true;
      // this.setRackView();
      
    })
  }

  editRack(rack: any, access: any) {
    this.onEditRackData = rack;
    this.onEditAccess = access;

    if (this.onEditRackData && access == 'edit') {
      this.addUpdateRackSetting = 'Edit Rack Setting'
    } else if (this.onEditRackData && access == 'view') {
      this.addUpdateRackSetting = 'View Rack Setting'
    }

  }

  deleteAlertRack(rack: any) {
    this.deleteRackDetails = rack;
  }

  deleteRack(){
    this.apiservice.deleteRackSetting(this.deleteRackDetails.organization, this.deleteRackDetails.id).subscribe((res: any) => {
      
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });

      this.closeModal();
      this.getRackSettingList();
      
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  closeModal() {
    this.closeButton.nativeElement.click()
    this.onEditRackData = ''
    this.addUpdateRackSetting = 'Add Rack Setting'
  }

  getPaginate() {
    this.paginationservice.getPaginationData().subscribe(newPaginationData => {
      if (newPaginationData) {
        this.paginationValue = newPaginationData;
      }
    });
    this.pageSize = this.paginationValue.pagesizeValue;
    this.page = this.paginationValue.pagevalue;
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page', this.paginationValue.pagevalue)
    params.set('page_size', this.paginationValue.pagesizeValue)

    this.getRackSettingList();
  }
}
