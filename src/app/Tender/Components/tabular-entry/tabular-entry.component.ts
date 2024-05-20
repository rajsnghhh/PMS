import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-tabular-entry',
  templateUrl: './tabular-entry.component.html',
  styleUrls: [
    './tabular-entry.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class TabularEntryComponent implements OnInit, OnChanges{
  @Input()
  excelData!: any;

  appentTable = false;
  bindData:any = {}
  localStorageData:any
  @Input()
  formData!: any;

  constructor(
    private commonFunction:CommonFunctionService,
    private apiservice:APIService,
    private datasharedservice:DataSharedService,
    private toastrService:ToastrService
  ) {

  }
  
  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    
  }
  ngOnChanges(): void {
    if(this.excelData && this.excelData.results.length >=0) {
      this.appentTable = true
    }else {
      this.appentTable = false
    }
    if(this.appentTable) {
      for(let i=0;i<this.excelData.results.length;i++) {
        for(let j=0;j<this.excelData.results[i].tender_data.length;j++){
          let vall
          if(this.excelData.results[i].tender_data[j].value_id != "") {
            vall = this.excelData.results[i].tender_data[j].value_id
          }else {
            vall = this.excelData.results[i].tender_data[j].value
          }

          this.bindData['data_'+this.excelData.results[i].id+'_'+this.excelData.results[i].tender_data[j].internal_name] = vall
        }
      }
    }
  }

  ChangeValue(event:any,rowId:any,colID:any) {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.localStorageData.organisation_details[0].id,
        tender_id: rowId,
        form_type: 'tender_eligibility',
        hideLoader: 'true'
      }
    )
    let requestdata = new FormData()
    requestdata.append(colID+'_1',event.target.value)
    this.apiservice.saveTenderData(query, requestdata).subscribe((data: any) => {
      if(rowId=='null') {
        this.excelData.results[0].id = data.results.Data.id
        for(let i=0;i<data.results.Data.tender_data.length;i++){
          if(data.results.Data.tender_data[i].id != ""){
            if(data.results.Data.tender_data[i].value_id == "") {
              this.bindData['data_'+data.results.Data.id+'_'+data.results.Data.tender_data[i].internal_name] = data.results.Data.tender_data[i].value
            }else {
              this.bindData['data_'+data.results.Data.id+'_'+data.results.Data.tender_data[i].internal_name] = data.results.Data.tender_data[i].value_id
            }
          }
        }
      }
    }, err => {
      if (err.error.error) {
        this.toastrService.error(err.error.error, '', {
          timeOut: 2000,
        });
      } else {
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      }
    })
  }

  AddNew() {
    if(this.excelData.results[0].id !='null') {
      let newFormData = []
      for(let i=0;i<this.formData[0].form_fields.length;i++) {
        newFormData.push({
          id:this.formData[0].form_fields[i].id,
          form_label:this.formData[0].form_fields[i].form_label,
          internal_name:this.formData[0].form_fields[i].form_internal_name,
          value:"",
          value_id:""
        })
      }
      let newSet = {
        id: "null",
        tender_data:newFormData
      }
      this.excelData.results.splice(0, 0, newSet);
    }else {
      this.toastrService.error('Please fill the row that you already have added!', '', {
        timeOut: 2000,
      });
    }
  
  }
  
}
