import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-idc',
  templateUrl: './idc.component.html',
  styleUrls: [
    './idc.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class IdcComponent implements OnInit {
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  localStorageData: any;
  indirectCostCategoryList: Array<any> = [];
  indirectCostMasterList: Array<any> = [];
  onEditIDCData: any;
  onEditAccess: any;
  addUpdateIDC: string = 'Add IDC';
  deleteIDCDetails: any;
  idcCat: boolean = false;
  idcMaster: boolean = false;
  setIDCViewList: Array<any> = [];

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

    this.getIndirectCostCategoryList();
    this.getIndirectCostMasterList();
  }

  getIndirectCostCategoryList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page_size', '1000');
    this.apiservice.getIndirectCostCategoryList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.indirectCostCategoryList = data.results;
      this.indirectCostCategoryList = this.indirectCostCategoryList.map(({ name, ...rest }) => ({ ...rest, category_name: name, }));
      this.idcCat = true;
      this.setIDCView();
    })
  }

  getIndirectCostMasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page_size', '1000');
    this.apiservice.getIndirectCostMasterList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.indirectCostMasterList = data.results;
      this.idcMaster = true;
      this.setIDCView();
    })
  }

  setIDCView() {
    this.setIDCViewList = []
    if (this.idcCat == true && this.idcMaster == true) {


      // Function to update the response
      const updateResponse = () => {
        const updatedResponse = this.indirectCostCategoryList.map(category => {
          const matchingItems = this.indirectCostMasterList.filter(item =>
            item.indirect_cost_category === category.id
          );
          return {
            ...category,
            items: matchingItems
          };
        });

        return updatedResponse;
      };

      // Call the function to get the updated response
      this.setIDCViewList = updateResponse();



      // this.indirectCostCategoryList.forEach(x => {

      //   const filteredList=  this.indirectCostMasterList.filter(y=>y.indirect_cost_category == x.id)
      // this.indirectCostMasterList.forEach(x => {
      //   const filteredList=  this.indirectCostMasterList.filter(y=>y.indirect_cost_category == x.id)
      // })

      // const filteredList = this.indirectCostCategoryList.filter(item=>this.indirectCostMasterList.includes(item.id))


      // // Iterate over catlist
      // for (const cat of this.indirectCostCategoryList) {
      //   // Find the corresponding master object based on indirect_cost_category
      //   const matchingMaster = this.indirectCostMasterList.find(master => master.indirect_cost_category === cat.id);

      //   if (matchingMaster) {
      //     const combinedObject = { ...cat, ...matchingMaster };
      //     this.setIDCViewList.push(combinedObject);
      //   }
      // }
    }
  }

  editIDC(idc: any, access: any) {
    this.onEditIDCData = idc;
    this.onEditAccess = access;
    if (this.onEditIDCData && access == 'edit') {
      this.addUpdateIDC = 'Edit IDC'
    } else if (this.onEditIDCData && access == 'view') {
      this.addUpdateIDC = 'View IDC'
    }

  }

  deleteAlertIDC(idc: any) {
    this.deleteIDCDetails = idc;
  }

  deleteIDC() {

    this.apiservice.deleteIndirectCostCategory(this.deleteIDCDetails.organization, this.deleteIDCDetails.id).subscribe((res: any) => {
      let indirect_cost_category = res?.results?.indirect_cost_category[0]?.id;
      this.apiservice.deleteIndirectCostMaster(this.deleteIDCDetails.organization, indirect_cost_category).subscribe((res: any) => {
        this.toastrService.success(Success_Messages.SuccessDelete, '', {
          timeOut: 2000,
        });
        this.getIndirectCostCategoryList();
        this.getIndirectCostMasterList();
      }, err => {
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      })
    })
    // this.apiservice.deleteIndirectCostCategory(this.deleteLabourDetails.id, this.deleteLabourDetails.organization).subscribe((res: any) => {

    //   this.toastrService.success(Success_Messages.SuccessDelete, '', {
    //     timeOut: 2000,
    //   });
    //   this.getIndirectCostCategoryList();
    //   this.getIndirectCostMasterList();
    // }, err => {
    //   this.toastrService.error(Error_Messages.Failed_HTTP, '', {
    //     timeOut: 2000,
    //   });
    // })


  }


  closeModal() {
    this.closeButton.nativeElement.click()
    this.onEditIDCData = ''
    this.addUpdateIDC = 'Add IDC'
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


    this.getIndirectCostCategoryList();
    this.getIndirectCostMasterList();

  }


}
