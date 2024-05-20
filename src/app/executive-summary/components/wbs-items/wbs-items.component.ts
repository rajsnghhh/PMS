import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-wbs-items',
  templateUrl: './wbs-items.component.html',
  styleUrls: [
    './wbs-items.component.scss',
    '../../../../assets/scss/from-coomon.scss'
  ]
})
export class WbsItemsComponent implements OnChanges,OnInit  {

  @Input()
  TenderNumber!: any;
  @Input()
  selectedWBSITEM!: any;
  
  @Input()
  selectedID!: any;

  @Input()
  selectedParentID!: any;

  @Input()
  selectedList!: any;
  
  


  @Input()
  wbsScope!: any;

  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();

  disableParrent = true;

  selectedforedit = ''

  wbsParrentList:any = []
  uomList:any = []
  localStorageData :any
  parentItem :any = {}
  constructor(
    private apiservice : APIService,
    private datasharedservice : DataSharedService,
    private toastrService : ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.wbsParrentList = []
    if(this.TenderNumber != '' && this.selectedWBSITEM != '' && this.selectedList ){
      this.itemData.parentTemp='';
      this.getData()
    }
    if(this.selectedID != '' && this.wbsScope == 'Edit') {
      this.getprefieldData()
    }
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getUOMData()
  }


  getprefieldData() {
    let params = new URLSearchParams();
    params.set('tender_id', this.TenderNumber);
    params.set('id', this.selectedID);
    this.apiservice.getWbsList(params).subscribe(data => {
      // list_to_tree

      this.itemData.id = data.id
      this.itemData.code = ''
      this.itemData.content = data.wbs_name
      this.itemData.uom = data.uom
      this.itemData.parentTemp = data.parent_id
      this.itemData.by_order = data.by_order
      this.parentItem.category = data.category
      
    })
  }


  getData() {
    // let params = new URLSearchParams();
    // params.set('tender_id', this.TenderNumber);
    // params.set('parent_id', this.selectedParentID);
    // params.set('all', 'true');

    // this.apiservice.getWbsList(params).subscribe(data => {
      // list_to_tree
      let treeData = this.list_to_tree(this.selectedList)
      
      let filterData = treeData.find((data: { id: any; }) => data.id == this.selectedWBSITEM)
      if(filterData.wbs_name == 'Specilized Vendors' || filterData.wbs_name == 'Major Materials') {
        this.disableParrent = false
      } else {
        this.disableParrent = true
      }

      this.itemData.parent = this.selectedWBSITEM
      this.itemData.code = ''
      this.wbsParrentList = this.toArray([filterData],[]);

      this.parentItem = this.wbsParrentList[0]
      this.wbsParrentList = this.wbsParrentList.filter((item: { id: any; }) => item.id != this.selectedID)
    // })
  }

  getUOMData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
    })
  }

  list_to_tree(list: any) {
    const comments = list
    const nest: any = (items: any[], id = null, link = 'parent_id') =>
      items
        .filter((item: { [x: string]: null; }) => item[link] === id)
        .map((item: { id: null | undefined; }) => ({ ...item, children: nest(items, item.id) }));
    return nest(comments)
  }
  toArray(nodes: any[], arr: any[]) {
    if (!nodes) {
      return [];
    }
    if (!arr) {
      arr = [];
    }
    for (var i = 0; i < nodes.length; i++) {
      arr.push(nodes[i]);
      this.toArray(nodes[i].children, arr);
    }
  return arr;
 }

 itemData:any = {}




 addItem() {

  if(this.wbsScope == 'Edit') {
    this.updateWBS()
  }else{
    let request:any = {
      "organization": this.localStorageData.organisation_details[0].id,
      "wbs_name": this.itemData.content,
      "category": this.parentItem.category,
      "parent_id": this.itemData.parentTemp ? this.itemData.parentTemp : this.itemData.parent,
      "uom_id" : this.itemData.uom,
      "by_order": this.itemData.by_order
    }
    let params = new URLSearchParams();
    if(this.TenderNumber) {
      request.tender_id = this.TenderNumber;
    } else {
      params.set('is_master', '1');
    }
    this.apiservice.addWBSData(params,request).subscribe(data => {
      this.toastrService.success('Added Successfully', '', {
        timeOut: 2000,
      });
      this.itemData = {}
      this.parentFun.emit()
    })
  }
 }


 updateWBS() {
    let params = new URLSearchParams();
    params.set('method', 'edit');
    params.set('wbs_id', this.selectedID);

    let request:any = {
      "organization": this.localStorageData.organisation_details[0].id,
      "wbs_name": this.itemData.content,
      "category": this.parentItem.category,
      "parent_id": this.itemData.parentTemp ? this.itemData.parentTemp : this.itemData.parent,
      "uom_id" : this.itemData.uom,
      "by_order": this.itemData.by_order
    }
    if(this.TenderNumber) {
      request.tender_id = this.TenderNumber;
    } else {
      params.set('is_master', '1');
    }

    this.apiservice.editWBSData(params, request).subscribe(data => {
      this.toastrService.success('WBS Updated Successfully', '', {
        timeOut: 2000,
      });
      this.parentFun.emit();
    })
}

 deleteItem() {
  let params = new URLSearchParams();
  params.set('method', 'delete');
  params.set('wbs_id', this.selectedID);

    let request:any = {}
    if(this.TenderNumber) {
      request.tender_id = this.TenderNumber;
    } else {
      params.set('is_master', '1');
    }
    
    this.apiservice.editWBSData(params, request).subscribe(data => {
      this.toastrService.success('Deleted Successfully', '', {
        timeOut: 2000,
      });
      this.parentFun.emit();
    })
 }

}
