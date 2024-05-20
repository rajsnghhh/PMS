import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-rack-master',
  templateUrl: './rack-master.component.html',
  styleUrls: [
    './rack-master.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class RackMasterComponent implements OnInit{
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  localStorageData: any;
  // RackList: Array<any> = [];
  rackMasterList: Array<any> = [];
  onEditRackData: any;
  onEditAccess: any;

  addUpdateRack: string = 'Add Rack';
  deleteRackDetails: any;
  rackCat: boolean = false;
  rackMaster: boolean = false;
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
    this.getRackMasterList();
  }

  getRackMasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page_size', '1000');

    this.apiservice.getRackMasterList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.rackMasterList = data.results;
      this.rackMaster = true;
      // this.setRackView();
    })
  }

  // setIDCView() {
  //   this.setRackViewList = []
  //   if (this.idcCat == true && this.idcMaster == true) {


  //     // Function to update the response
  //     const updateResponse = () => {
  //       const updatedResponse = this.indirectCostCategoryList.map(category => {
  //         const matchingItems = this.indirectCostMasterList.filter(item =>
  //           item.indirect_cost_category === category.id
  //         );
  //         return {
  //           ...category,
  //           items: matchingItems
  //         };
  //       });

  //       return updatedResponse;
  //     };

  //     // Call the function to get the updated response
  //     this.setRackViewList = updateResponse();



  //     // this.indirectCostCategoryList.forEach(x => {

  //     //   const filteredList=  this.indirectCostMasterList.filter(y=>y.indirect_cost_category == x.id)
  //     // this.indirectCostMasterList.forEach(x => {
  //     //   const filteredList=  this.indirectCostMasterList.filter(y=>y.indirect_cost_category == x.id)
  //     // })

  //     // const filteredList = this.indirectCostCategoryList.filter(item=>this.indirectCostMasterList.includes(item.id))


  //     // // Iterate over catlist
  //     // for (const cat of this.indirectCostCategoryList) {
  //     //   // Find the corresponding master object based on indirect_cost_category
  //     //   const matchingMaster = this.indirectCostMasterList.find(master => master.indirect_cost_category === cat.id);

  //     //   if (matchingMaster) {
  //     //     const combinedObject = { ...cat, ...matchingMaster };
  //     //     this.setIDCViewList.push(combinedObject);
  //     //   }
  //     // }
  //   }
  // }

  editRack(rack: any, access: any) {
    this.onEditRackData = rack;
    this.onEditAccess = access;

    if (this.onEditRackData && access == 'edit') {
      this.addUpdateRack = 'Edit Rack'
    } else if (this.onEditRackData && access == 'view') {
      this.addUpdateRack = 'View Rack'
    }

  }

  deleteAlertRack(rack: any) {
    this.deleteRackDetails = rack;
  }
  
  deleteRack(){
    this.apiservice.deleteRackMaster(this.deleteRackDetails.organization, this.deleteRackDetails.id).subscribe((res: any) => {
      
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });

      this.closeModal();
      this.getRackMasterList();
      
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  closeModal() {
    this.closeButton.nativeElement.click()
    this.onEditRackData = ''
    this.addUpdateRack = 'Add Rack'
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

    this.getRackMasterList();
  }
}
