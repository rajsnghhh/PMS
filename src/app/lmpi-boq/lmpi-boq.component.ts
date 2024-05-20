import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { APIService } from '../Shared/Services/api.service';
import { DataSharedService } from '../Shared/Services/data-shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lmpi-boq',
  templateUrl: './lmpi-boq.component.html',
  styleUrls: ['./lmpi-boq.component.scss']
})
export class LmpiBoqComponent implements OnInit, OnChanges {

  @Input()
  TenderNumber!: any;

  @Input()
  selectedTab!: any;   /// tender_lmpi_group For Tender Scope
                       /// budget For Budget Scope

  @Input()
  selectedBOQ!: any; 

  @Input()
  DisableModify!: any;

  WbsList: any = []
  selectedWbs = ''
  lmpiScope = ''
  selectedWBSUOM = ''
  localStorageData:any;
  wbsLinked = false;
  wbsLinkedData:any = {}

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.wbsLinkedData.organization = this.localStorageData.organisation_details[0].id
    this.getWBSData()
  }

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    
  }





  getWBSData() {
    let params = new URLSearchParams();
    params.set('category', 'volumetric');
    params.set('all', 'true');
    if(this.selectedTab == 'budget') {
      params.set('boq_id', this.selectedBOQ);
    } else {
      params.set('tender_id', this.TenderNumber);
    }
    this.apiservice.getWbsList(params).subscribe(data => {
      let filter = data.results.filter((item: { parent_id: null; }) => item.parent_id != null)
      this.WbsList = filter;
      this.selectedWbs = this.WbsList[0].id
      this.selectedWBSUOM = this.WbsList[0]?.uom_name
      setTimeout(() => {
        this.lmpiScope = 'labour'
      }, 500)
      this.getLMPI_WBSData()
    })
  }

  changeWBS() {
    let filter = this.WbsList.filter((item: { wbs_name: string; }) => item.wbs_name == this.selectedWbs)
    if(filter.length > 0) {
      this.selectedWBSUOM = filter[0].uom_name
    } else {
      this.selectedWBSUOM = ''
    }
    setTimeout(() => {
      this.lmpiScope = 'labour'
    }, 500)
    
    this.getLMPI_WBSData()
  }

  getLMPI_WBSData() {
    let scope = ''
    if(this.selectedWbs){
      scope+=this.selectedWbs
    }
    if(scope != '') {
    let params = new URLSearchParams();
    if(this.selectedTab == 'budget') {
      params.set('boq_id', this.selectedBOQ);
    } else {
      params.set('tender_id', this.TenderNumber);
    }
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('wbs', scope);
    
    this.apiservice.getBOQWbsList(params).subscribe(data => {
      if(data.results.length > 0) {
        if(data.results[0].budgeted_quantity != null) {
          this.wbsLinkedData.budgeted_quantity = data.results[0].budgeted_quantity
        } else {
          delete this.wbsLinkedData.budgeted_quantity;
        }
        if(data.results[0].id != null) {
          this.wbsLinkedData.id = data.results[0].id
        }
        if(data.results[0].rate != null) {
          this.wbsLinkedData.rate = data.results[0].rate
        } else {
          delete this.wbsLinkedData.rate;
        }
        if(data.results[0].start_date != null) {
          this.wbsLinkedData.start_date = data.results[0].start_date
        } else {
          delete this.wbsLinkedData.start_date;
        }
        if(data.results[0].end_date != null) {
          this.wbsLinkedData.end_date = data.results[0].end_date 
        }else {
          delete this.wbsLinkedData.end_date;
        }
        this.wbsLinked = true
      }else {
        delete this.wbsLinkedData.budgeted_quantity;
        delete this.wbsLinkedData.rate;
        delete this.wbsLinkedData.start_date;
        delete this.wbsLinkedData.end_date;
        delete this.wbsLinkedData.id;
        this.wbsLinked = false
      }
    })}
  }

  linkWBS(action:any) {
    let scope = ''
    if(this.selectedWbs){
      scope+=this.selectedWbs
    }
    if(scope != '') {
    this.wbsLinkedData.wbs = scope
    if(this.selectedTab == 'budget') {
      this.wbsLinkedData.boq = this.selectedBOQ
      this.wbsLinkedData.tender = null
    } else {
      this.wbsLinkedData.boq = null
      this.wbsLinkedData.tender = this.TenderNumber
    }
    
    if(true){
    if(this.wbsLinkedData.budgeted_quantity) {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);

      if(action=='edit') {
        params.set('method', 'edit');
        params.set('id', this.wbsLinkedData.id);
        this.apiservice.editBOQWbsList(params,this.wbsLinkedData).subscribe(data => {
          this.getLMPI_WBSData()
        })
      }else {
        this.apiservice.addBOQWbsList(params,this.wbsLinkedData).subscribe(data => {
          this.getLMPI_WBSData()
        })
      }
      
    } else {
      let err = 'Please enter budget quantity to proceed!'
      this.toastrService.error(err, '', {
        timeOut: 2000,
      });
    }}else{
      let err = 'Please Select WBS Head to proceed!'
      this.toastrService.error(err, '', {
        timeOut: 2000,
      });
    }
  }
  }

  changelmpiscope(scope: any) {
    this.lmpiScope = scope
  }
}
