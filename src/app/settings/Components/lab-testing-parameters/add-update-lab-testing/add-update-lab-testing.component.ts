import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-update-lab-testing',
  templateUrl: './add-update-lab-testing.component.html',
  styleUrls: [
    './add-update-lab-testing.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class AddUpdateLabTestingComponent implements OnInit, OnChanges{
  checkListData: any = [];
  localStorageData: any;
  materialTypeList: any;
  // materialSubTypeList:any;
  check_items: any = '';
  
  finalRequestData: any = [];

  itemGroupErrorFlag: any = true;

  @Input() prefieldData: any;
  @Input() onEditAccess: any;
  @Input() scope: any;

  @Output() parrentAction = new EventEmitter<any>();

  @Output("getLabTestingList") getLabTestingList: EventEmitter<any> = new EventEmitter();
  @Output("closeModal") closeModal: EventEmitter<any> = new EventEmitter();

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private router: Router,
    private procurementAPIService:PROCUREMENTAPIService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    if(!this.prefieldData){
      this.checkListData.push({
        group: '',
        description:'',
      });
    }
    this.getMaterialParent();
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.prefieldData){

      this.check_items = this.prefieldData.check_items
      this.checkListData = []

      for(let item of this.prefieldData.items){
        this.checkListData.push({
          group: item.item_group,
          description: item.description,
        });
      }
    }
  }

  addRow() {
    this.checkListData.push({
      group: '',
      description:'',
    });
  }

  deleteRow(index: any) {
    this.checkListData.splice(index, 1);
  }

  changeStructure(data: any) {
    this.finalRequestData = [];
    for (let val of data) {
      var obj: any = {
        organization: this.localStorageData.organisation_details[0].id,
        item_group: val.group,
        description: val.description,
      }
      this.finalRequestData.push(obj);
    }
  }

  onSave() {
    for(let obj of this.finalRequestData){
      if(obj.item_group == ''){
        this.itemGroupErrorFlag = true
      } else{
        this.itemGroupErrorFlag = false
      }
    }
    if(this.check_items != ''){
      if(!this.prefieldData){
        this.changeStructure(this.checkListData);
        let request = {
          organization: this.localStorageData.organisation_details[0].id,
          check_items: this.check_items,
          items: this.finalRequestData
        }
        
        this.apiservice.addLabTesting(request).subscribe(data => {
          this.toastrService.success("Lab Testing Parameter Added Successfully.", '', {
            timeOut: 2000,
          });
          
          this.getLabTestingList.emit();
    
          this.closeModal.emit();
          this.check_items = '';
          this.checkListData = [];
          this.checkListData.push({
            group: '',
            description:'',
          });
        })
    
      } else {
        this.changeStructure(this.checkListData);
        let request = {
          organization: this.localStorageData.organisation_details[0].id,
          check_items: this.check_items,
          items: this.finalRequestData
        }
        
        this.apiservice.editLabTesting(request, this.prefieldData.organization, this.prefieldData.id).subscribe(data => {
          this.toastrService.success("Lab Testing Parameter Added Successfully.", '', {
            timeOut: 2000,
          });
          
          this.getLabTestingList.emit();
    
          this.closeModal.emit();
          this.check_items = '';
          this.checkListData = [];
          this.checkListData.push({
            group: '',
            description:'',
          });
        })
      }
    } else { 
      if(this.itemGroupErrorFlag == true){
        this.toastrService.error("Item Group is mandatory.", '', {
          timeOut: 2000,
        });
      }
      this.toastrService.error("Check Item is mandatory.", '', {
        timeOut: 2000,
      });
    }
  }

  getMaterialParent() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialTypeList = data.results;
    })
  }

  // typeChange(typeid: any) {
  //   let params = new URLSearchParams();
  //   params.set('organization_id', this.localStorageData.organisation_details[0].id);
  //   params.set('parent', typeid);
  //   params.set('page', '1');
  //   params.set('page_size', '1000');

  //   this.apiservice.getMaterialTypeList(params).subscribe(data => {
  //     this.materialSubTypeList = data.results;      
  //   })
  // }
}
