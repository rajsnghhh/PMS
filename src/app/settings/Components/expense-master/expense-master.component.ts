import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-expense-master',
  templateUrl: './expense-master.component.html',
  styleUrls: [
    './expense-master.component.scss',
    '../../../../assets/scss/scrollableTable.scss',
  ]
})
export class ExpenseMasterComponent {
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  localStorageData: any;

  materialTypeList: any;

  expenseList: Array<any> = [];
  onEditBrandData: any;
  onEditAccess: any;

  addUpdateBrand: string = 'Add Expense Master';
  deleteBrandDetails: any;
  brandCat: boolean = false;
  expense: boolean = false;
  setBrandViewList: Array<any> = [];

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
    
    this.getBrandList()
    // this.getMaterialType();
  }

  getMaterialType(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialTypeList = data.results;      
    })    
  }

  getBrandList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');

    this.apiservice.getExpenseMasterList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.expenseList = data.results;
      this.expense = true;
    })
  }

  editBrand(brand: any, access: any) {
    this.onEditBrandData = brand;
    this.onEditAccess = access;

    if (this.onEditBrandData && access == 'edit') {
      this.addUpdateBrand = 'Edit Expense Master'
    } else if (this.onEditBrandData && access == 'view') {
      this.addUpdateBrand = 'View Expense Master'
    }

  }

  deleteAlertBrand(brand: any) {
    this.deleteBrandDetails = brand;
  }
  
  deleteBrand(){
    this.apiservice.deleteExpense(this.deleteBrandDetails.organization, this.deleteBrandDetails.id).subscribe((res: any) => {
      
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });

      this.closeModal();
      this.getBrandList();
      
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  closeModal() {
    this.closeButton.nativeElement.click()
    this.onEditBrandData = ''
    this.addUpdateBrand = 'Add Expense Master'
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

    this.getBrandList();
  }
}
