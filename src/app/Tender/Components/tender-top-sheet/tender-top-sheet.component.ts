import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';

@Component({
  selector: 'app-tender-top-sheet',
  templateUrl: './tender-top-sheet.component.html',
  styleUrls: [
    './tender-top-sheet.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class TenderTopSheetComponent implements OnChanges {

  @Input()
  TenderNumber!: any;

  bindData:any = {}

  @Input()
  formData: any = [];
  keyScopeList:any = []

  @Input()
  prefieldData: any = {};

  remarks = ''
  Accepted = false
  
  topsheetTotal:any = {}

  @Input()
  DisableModify!: any;

  constructor( 
    private apiservice:APIService,
    private toastrService:ToastrService
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.TenderNumber != "") {
      // this.getKeyScopeList()
      this.getWBSITEMScopeList()
      this.getTopSheetData()
    }

    if(this.prefieldData?.Data?.top_sheet_remarks != null) {
      this.remarks = this.prefieldData.Data.top_sheet_remarks
    }
  }


  getWBSITEMScopeList() {
    let params = new URLSearchParams();
    params.set('tender_id', this.TenderNumber);
    params.set('parent_id__category', 'volumetric');
    params.set('all', 'true');
    this.apiservice.getWbsList(params).subscribe(data => {
      // let parentTree = this.list_to_tree(data.results)
      // let res:any = []
      // for (var i = 0; i < parentTree.length; i++) {
      //   if(parentTree[i].category == "general") {
      //     let ary = this.toArray(parentTree[i].children,[]) 
      //     if(ary.length > 0) {
      //       res = res.concat(ary)
      //     }
      //   }
      // }
      this.keyScopeList = data.results
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


  changeInTableData(tableindex:any,keyscoperow:any,val:any) {
    if(val.form_internal_name == 'sale_value' || val.form_internal_name == 'expenditure_value') {
      let temp:any = ''
      if(keyscoperow.tender_value.length == 0) {
        temp = 0
      } else {
        temp = this.bindData[this.formData[tableindex].name+'_'+keyscoperow.id+'_'+val.form_internal_name] / keyscoperow.tender_value[0]
      }
      this.bindData[this.formData[tableindex].name+'_'+keyscoperow.id+'_unit_head'] = parseFloat(temp.toString()).toFixed(2)

      this.uploadTopSheet(this.formData[tableindex].name,keyscoperow.id,val.id,this.bindData[this.formData[tableindex].name+'_'+keyscoperow.id+'_'+val.form_internal_name])
      this.uploadTopSheet(this.formData[tableindex].name,keyscoperow.id,this.getUnitHeadID(this.formData[tableindex].form_fields),this.bindData[this.formData[tableindex].name+'_'+keyscoperow.id+'_unit_head'])
    }  
    
    if (val.form_internal_name == 'remarks') {
      this.uploadTopSheet(this.formData[tableindex].name,keyscoperow.id,val.id,this.bindData[this.formData[tableindex].name+'_'+keyscoperow.id+'_'+val.form_internal_name])
    }
  }

  getUnitHeadID(data:any) {
    for(let i=0;i<data.length;i++) {
      if(data[i].form_internal_name == 'unit_head') {
        return data[i].id
      }
    }
  }

  getTopSheetData() {
    let params = new URLSearchParams();
    params.set('tender_id',this.TenderNumber );
    for(let i=0;i<this.formData.length;i++) {

      this.apiservice.getTopSheetData(this.formData[i].name,params).subscribe(data => {
        this.BindData(i,data.results)
      },err=>{
        if(err.error.msg){
          this.toastrService.error(err.error.msg, '', {
            timeOut: 2000,
          });
        }else{
          this.toastrService.error(Error_Messages.Failed_HTTP, '', {
            timeOut: 2000,
          });
        }
      })
    }
  }

  BindData(formIndex:any,data:any) {
    for(let i=0;i<data.length;i++) {
      this.bindData[this.formData[formIndex].name+'_'+data[i].wbskey+'_'+this.getInputID(formIndex,data[i])] = data[i].value
    }
    this.calculateSum()
  }

  getInputID(formIndex:any,data:any) {
    let inputs = this.formData[formIndex].form_fields
    for(let i=0;i<inputs.length;i++) {
      if(inputs[i].id == data.form) {
        return inputs[i].form_internal_name
      }
    }
  }

  calculateSum() {
    let params = new URLSearchParams();
    params.set('tender_id',this.TenderNumber );
    
    this.apiservice.getTopsheetTotal(params).subscribe(data => {
      for (var key in data) {
        this.bindData[key] = data[key]
      }
    },err=>{
      if(err.error.msg){
        this.toastrService.error(err.error.msg, '', {
          timeOut: 2000,
        });
      }else{
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      }
    })

  }

  uploadTopSheet(sheetTyepe:any,wbsID:any,formID:any,val:any) {
    let req = {
      tender_id: this.TenderNumber,
      wbskey_id : wbsID,
      form_id: formID,
      value:val
    }

    this.apiservice.uploadTopSheet(sheetTyepe,req).subscribe(data => {
      this.calculateSum()
    },err=>{
      if(err.error.msg){
        this.toastrService.error(err.error.msg, '', {
          timeOut: 2000,
        });
      }else{
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      }
    })
  }

  submitApproval() {
    if(this.remarks != "" && this.Accepted) {
      let req = {
        tender_id: this.TenderNumber,
        remarks : this.remarks
      }
      this.apiservice.topsheetSubmit(req).subscribe(data => {
        window.location.reload()
      },err=>{
        if(err.error.msg){
          this.toastrService.error(err.error.msg, '', {
            timeOut: 2000,
          });
        }else{
          this.toastrService.error(Error_Messages.Failed_HTTP, '', {
            timeOut: 2000,
          });
        }
      })
    }
  }
  // is_top_sheet_complete
  // is_top_sheet_complete
  // top_sheet_remarks
  
}
