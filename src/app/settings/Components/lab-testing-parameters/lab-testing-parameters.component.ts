import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-lab-testing-parameters',
  templateUrl: './lab-testing-parameters.component.html',
  styleUrls: [
    './lab-testing-parameters.component.scss',
    '../../../../assets/scss/scrollableTable.scss',
  ]
})
export class LabTestingParametersComponent implements OnInit{
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  localStorageData: any;

  labTestingList: Array<any> = [];
  onEditLabData: any;
  onEditAccess: any = 'add';

  addUpdateLabTestingData: string = 'Add Lab Testing Parameter';
  deleteLabDetails: any;
  // rackCat: boolean = false;
  labTesting: boolean = false;
  setLabTestingList: Array<any> = [];

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
    
    this.getLabTestingList();
  }

  getLabTestingList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page_size', '1000');

    this.apiservice.getLabTestingList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.labTestingList = data.results;
      this.labTesting = true;

    })
  }

  editLabTesting(transport: any, access: any) {
    this.onEditLabData = transport;
    this.onEditAccess = access;

    if (this.onEditLabData && access == 'edit') {
      this.addUpdateLabTestingData = 'Edit Lab Testing Parameter'
    } else if (this.onEditLabData && access == 'view') {
      this.addUpdateLabTestingData = 'View Lab Testing Parameter'
    }

  }

  closeModal() {
    this.closeButton.nativeElement.click()
    this.onEditLabData = ''
    this.addUpdateLabTestingData = 'Add Lab Testing Parameter'
  }

  deleteAlertTtansport(rack: any) {
    this.deleteLabDetails = rack;
  }

  deleteTransportRate(){
    this.apiservice.deleteLabTesting(this.deleteLabDetails.organization, this.deleteLabDetails.id).subscribe((res: any) => {
      
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });

      this.closeModal();
      this.getLabTestingList();
      
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

    this.getLabTestingList();
  }
}
