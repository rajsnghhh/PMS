import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-transport-rate',
  templateUrl: './transport-rate.component.html',
  styleUrls: [
    './transport-rate.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class TransportRateComponent implements OnInit {
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  localStorageData: any;

  transportList: Array<any> = [];
  onEditTransportData: any;
  onEditAccess: any = 'add';

  addUpdateTransportRate: string = 'Add Transport Rate';
  deleteTransportRateDetails: any;
  // rackCat: boolean = false;
  transportRate: boolean = false;
  setTransportRateViewList: Array<any> = [];

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
    
    this.getTransportRateList();
  }

  getTransportRateList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page_size', '1000');

    this.apiservice.getTransportRateList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.transportList = data.results;
      this.transportRate = true;
      // this.setTransportRateView();
      
    })
  }

  editTransportRate(transport: any, access: any) {
    this.onEditTransportData = transport;
    this.onEditAccess = access;

    if (this.onEditTransportData && access == 'edit') {
      this.addUpdateTransportRate = 'Edit Transport Rate'
    } else if (this.onEditTransportData && access == 'view') {
      this.addUpdateTransportRate = 'View Transport Rate'
    }

  }

  closeModal() {
    this.closeButton.nativeElement.click()
    this.onEditTransportData = ''
    this.addUpdateTransportRate = 'Add Rack Setting'
  }

  deleteAlertTtansport(rack: any) {
    this.deleteTransportRateDetails = rack;
  }

  deleteTransportRate(){
    this.apiservice.deleteTransportRate(this.deleteTransportRateDetails.organization, this.deleteTransportRateDetails.id).subscribe((res: any) => {
      
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });

      this.closeModal();
      this.getTransportRateList();
      
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
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

    this.getTransportRateList();
  }
}
