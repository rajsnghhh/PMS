import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: [
    './terms-and-conditions.component.scss',
    '../../../../assets/scss/scrollableTable.scss',
  ]
})
export class TermsAndConditionsComponent implements OnInit {
  pageSize: any = 10;
  page: any = 1;
  category = 'all'
  paginationValue: any;
  localStorageData: any;

  termsAndConditionsList: Array<any> = [];
  onEditTermsData: any;
  onEditAccess: any = 'add';

  addUpdateTerms: string = 'Add Terms and Conditions';
  deleteTermsDetails: any;
  // rackCat: boolean = false;
  termsAndConditions: boolean = false;
  setTermsList: Array<any> = [];

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
    
    this.getTermsAndConditionsList();
  }

  getTermsAndConditionsList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);

    // params.set('slug', 'po');
    params.set('all', 'true');

    if(this.category != 'all') {
      params.set('slug', this.category);
    }
    
    // params.set('page_size', '1000');

    this.apiservice.getTermsAndConditionsList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.termsAndConditionsList = data.results;
      this.termsAndConditions = true;
      // this.setTransportRateView();
      
    })
  }

  editTerms(transport: any, access: any) {
    this.onEditTermsData = transport;
    this.onEditAccess = access;

    if (this.onEditTermsData && access == 'edit') {
      this.addUpdateTerms = 'Edit Terms and Conditions'
    } else if (this.onEditTermsData && access == 'view') {
      this.addUpdateTerms = 'View Terms and Conditions'
    }

  }

  closeModal() {
    this.closeButton.nativeElement.click()
    this.onEditTermsData = ''
    this.addUpdateTerms = 'Add Terms and Conditions'
  }

  deleteAlertTerms(rack: any) {
    this.deleteTermsDetails = rack;
  }

  deleteTerms(){
    this.apiservice.deleteTermsChild(this.deleteTermsDetails.organization, this.deleteTermsDetails.id).subscribe((res: any) => {
      
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });

      this.closeModal();
      this.getTermsAndConditionsList();
      
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

    this.getTermsAndConditionsList();
  }

}
