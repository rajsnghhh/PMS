import { Component, Input } from '@angular/core';
import { PmsDocPreviewService } from 'src/app/Shared/Services/pms-doc-preview.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss']
})
export class TableViewComponent {

  colapseFromsList: any = [];
  temp = {};

  @Input()
  viewData!: any;

  @Input()
  prefieldData!: any;

  @Input()
  formData!: any;

  inputList = ['dropdown', 'multiselect', 'reference', 'file', 'date', 'dependant-multiselect', 'boolean']
  environment = environment
  appentTable: any;
  tenderdata: any = {};
  constructor(
    private docPreview: PmsDocPreviewService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.formData.length > 0) {
      for (let i = 0; i < this.formData.length; i++) {
        this.formData[i].colapseStatus = true;
        this.formData[i].Datatouples = [1];
      }
    }
    if (this.prefieldData) {
      if (this.prefieldData.results) {
        this.prePopulateData(this.prefieldData.results.tender_data)
      }
    }
  }

  applyConditionOnload(value: any, logic: any) {
    for (let i = 0; i < logic.length; i++) {
      if (value == logic[i].option_id) {
        this.openHideField(logic[i].form_id, true)
      }
    }
  }

  openHideField(id: any, status: boolean) {
    for (let i = 0; i < this.formData.length; i++) {
      for (let j = 0; j < this.formData[i].form_fields.length; j++) {
        if (this.formData[i].form_fields[j].id.toString() == id.toString()) {
          this.formData[i].form_fields[j].hidden_param = status
        }
      }
    }
  }

  prePopulateData(data: any) {
    let InputList = []
    for (let i = 0; i < data.length; i++) {
      if (parseInt(data[i].id) || data[i].internal_name == 'thresold') {
        InputList.push(data[i].internal_name)
        let val = ''
        if (data[i].value_id != "") {
          val = data[i].value_id
        } else if (data[i].document != "") {
          val = data[i].document
        } else {
          val = data[i].value
        }
        if (InputList.includes(data[i].internal_name)) {
          this.tenderdata[data[i].internal_name + this.countOccourance(InputList, data[i].internal_name, data[i]).toString()] = val
        } else {
          this.tenderdata[data[i].internal_name + '1'] = val
        }
      }
    }     
    if (this.formData && this.formData[0]) {
      for (let index = 0; index < this.formData.length; index++) {
        for (let i = 0; i < this.formData[index].form_fields.length; i++) {
          if (this.formData[index].form_fields[i].form_input_type == 'dropdown' && this.formData[index].form_fields[i].conditinal_on.length > 0) {
            if (this.tenderdata[this.formData[index].form_fields[i].form_internal_name + '1']) {
              this.applyConditionOnload(this.tenderdata[this.formData[index].form_fields[i].form_internal_name + '1'], this.formData[index].form_fields[i].conditinal_on)
            }
          }
        }
      }
    }
  }

  viewDoc(url: any) {
    this.docPreview.showDoc(environment.API_URL1 + url, {})
  }

  showNamebyID(list: any, selected: any) {
    selected = JSON.parse(selected)
    let res = ''
    let allList = []
    if (list.dependent_dropdown_choices.length > 0) {
      allList = list.dependent_dropdown_choices
    } else {
      allList = list.dropdown_choices
    }

    if (Array.isArray(selected)) {
      if (selected.length > 0 && allList.length > 0) {
        for (let i = 0; i < selected.length; i++) {
          for (let j = 0; j < allList.length; j++) {
            if (allList[j].id == selected[i]) {
              res += allList[j].itemName + ','
            }
          }
        }
      }
    } else {
      for (let j = 0; j < allList.length; j++) {
        if (allList[j].id == selected) {
          res += allList[j].itemName + ' '
        }
      }
    }

    return res
  }

  showNamebyID1(list: any, selected: any) {
    // selected = selected[0]
    // selected = JSON.parse(selected)
    let res = ''
    let allList = []
    if (list.dependent_dropdown_choices.length > 0) {
      allList = list.dependent_dropdown_choices
    } else {
      allList = list.dropdown_choices
    }
    // if(allList.length>0) {
    //   for(let j =0;j<allList.length;j++) {
    //     if(allList[j].id == selected){
    //       res += allList[j].itemName + ' '
    //     }
    //   }
    // }
    if (Array.isArray(selected)) {
      if (selected.length > 0 && allList.length > 0) {
        for (let i = 0; i < selected.length; i++) {
          for (let j = 0; j < allList.length; j++) {
            if (allList[j].id == selected[i]) {
              res += allList[j].itemName;
              if (j < allList.length - 1) {
                res += ', ';
              }
            }
          }
        }
      }
    } else {
      for (let j = 0; j < allList.length; j++) {
        if (allList[j].id == selected) {
          res += allList[j].itemName + ' '
        }
      }
    }

    return res
  }


  expandSpecificElement(serialNo: any) {
    this.formData[serialNo].colapseStatus = !this.formData[serialNo].colapseStatus;
  }

  AddNewRowCode(data: any) {
    for (let i = 0; i < this.formData.length; i++) {
      if (this.formData[i].id == data.form_group_id) {
        if (!this.formData[i].Datatouples.includes(data.by_order)) {
          this.formData[i].Datatouples.push(data.by_order)
        }
      }
    }
  }

  countOccourance(Data: any, find: string, objData: any) {
    if (objData.is_multiple) {
      if (objData.by_order > 1) {
        this.AddNewRowCode(objData)
      }
      return objData.by_order
    }
    let count = 0;
    for (let i = 0; i < Data.length; i++) {
      if (Data[i] == find) {
        count++
      }
    }
    return count
  }

  getFileName(data: any) {
    return data.replace(/\ /g, "").split('/').pop()
  }

  ifShow(fromName: any) {
    if (fromName == 'JV Details') {
      for (let i = 0; i < this.prefieldData.results?.tender_data.length; i++) {
        if (this.prefieldData?.results?.tender_data[i]?.internal_name == "participations_mode") {
          if (this.prefieldData.results.tender_data[i].value != "JV") {
            return false
          }
        }
      }
    }
    return true
  }
}
