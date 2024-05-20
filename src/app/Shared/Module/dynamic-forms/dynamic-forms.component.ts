import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { evaluateInfix } from 'calculator-lib';
import { NgForm } from '@angular/forms';
import { APIService } from '../../Services/api.service';
import { DataSharedService } from '../../Services/data-shared.service';
import { TenderactionsComponent } from 'src/app/Tender/Components/tenderactions/tenderactions.component';
import { Router } from '@angular/router';
import { PmsDocPreviewService } from '../../Services/pms-doc-preview.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: [
    './dynamic-forms.component.scss',
    '../../../../assets/scss/survey-common.scss',
    '../../../../assets/scss/from-coomon.scss'
  ]
})

export class DynamicFormsComponent implements OnInit, OnChanges {
  @Input()
  formData!: any;

  @Input() btnName !:any;
  openTab: any = 'view';

  @Input()
  actionName!: string;

  editMode = false

  @Input()
  activeFromName!: string;


  @Input()
  prefieldData!: any;

  @Input()
  selectedTab!: any;


  @Input()
  tenderAction!: any[];

  @Input()
  chieldActionRequired!: boolean;

  @Output() changeValue = new EventEmitter<any>();

  formFieldList: any = [];

  JV_MASTER_FROM:any = []
  JVDATALIST:any = [] 
  ShowJVDATA = false
  ownCompanyId:any = ''
  jdLeadID:any = ''
  emitData:any={};

  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;

  @ViewChild('f', { read: ElementRef })
  validForm!: ElementRef<HTMLElement>;

  @ViewChild('f')
  dataForm!: NgForm;
  reloadRequired = false;
  acceptTnC = false;
  tenderbuttonAction = '';
  btndisable: any
  needacceptTnCText = ''
  needacceptTnC = false

  @ViewChild(TenderactionsComponent)
  tdActionChild!: TenderactionsComponent;

  @Output() parentCompFun = new EventEmitter<string>()

  @Output("proceedNext")
  proceedtoNext: EventEmitter<any> = new EventEmitter();

  multipleEntry = false;
  showMultiPlebutton = false;
  tenderExcelData: any;
  tableViewData: any;
  attributeName: any;
  tenderdata: any = {}
  MultidropdownSettings = {}
  filesData:any = {}
  localStorageData: any;
  tableViewEnable = true;
  environment = environment;
  jvDisableScope = ['jv_share__details','bid_capacity','bid_capacity_percentage_analysis','available_threshold','value_of_similar_works','maximum_span_length_of_bridge_avail','average_annual_turn_over','net_worth' ]
  constructor(
    private toastrService: ToastrService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private router: Router,
    private docPreview:PmsDocPreviewService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.dropDownSettings()
    this.getUserDetails()
    this.setViewEditTab()
    this.enableDisableSwitch()
  }

  funcParent() {
    this.proceedtoNext.emit()

  }

  increment(num:any) {
    return num+1
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.JVDATALIST = []
    for (let i = 0; i < this.formData.length; i++) {
      this.formData[i].Datatouples = [1];
      if(this.formData[i].name == 'JV Details') {
        this.JV_MASTER_FROM = this.formData[i]
      }
    }
    this.setViewEditTab()
    this.enableDisableSwitch()
    if (this.prefieldData.results && this.prefieldData.results.tender_data) {
      this.prePopulateData(this.prefieldData.results.tender_data)
      this.getUserDetails()
    } else {
      for (let i = 0; i < this.formData.length; i++) {
        this.formData[i].disableValue = false;
      }
    }
    if (this.formData && this.formData[0]) {
      for (let index = 0; index < this.formData.length; index++) {
        for (let i = 0; i < this.formData[index].form_fields.length; i++) {
          // if (this.formData[index].form_fields[i].form_input_type == 'reference' && this.formData[index].form_fields[i].is_other == true) {
          //   this.formData[index].form_fields[i].form_input_type = 'dropdown'
          //   this.formData[index].form_fields[i].dropdown_choices = this.formData[index].form_fields[i].dependent_dropdown_choices
          // }
          if(this.formData[index].form_fields[i]?.condition_input_type == 'dependant-multiselect' && this.formData[index].form_fields[i]?.dependent_dropdown_choices.length>0) {
            for(let input=0;input<this.formData[index].form_fields[i].dependent_dropdown_choices.length;input++) {
              this.formData[index].form_fields[i].dependent_dropdown_choices[input].id = this.formData[index].form_fields[i].dependent_dropdown_choices[input].option_id
            }
          }
          if (this.formData[index].form_fields[i].form_input_type == 'dropdown' && this.formData[index].form_fields[i].dependent_dropdown_choices.length > 0) {
            this.formData[index].form_fields[i].dropdown_choices = this.formData[index].form_fields[i].dependent_dropdown_choices
          }
          if (this.formData[index].form_fields[i].form_input_type == 'dropdown' && this.formData[index].form_fields[i].conditinal_on.length > 0) {
            if (this.tenderdata[this.formData[index].form_fields[i].form_internal_name + '1']) {
              this.applyConditionOnload(this.tenderdata[this.formData[index].form_fields[i].form_internal_name + '1'], this.formData[index].form_fields[i].conditinal_on)
            }
          }
        }
      }
    }
    if (this.activeFromName == 'tender_pre_feasibility_assignments') {
      this.btndisable = false;
    }
    let activeLink = this.router.url.split('/')
    if (activeLink.includes('edit')) {
      this.editMode = true
    } else {
      this.editMode = false
    }
  }

  hideswitchScope = ['vendor-management-view']

  applyConditionOnload(value: any, logic: any) {
    for (let i = 0; i < logic.length; i++) {
      if (value == logic[i].option_id) {
        this.openHideField(logic[i].form_id, true)
      }
    }
  }

  setViewEditTab() {
    let activeLink = this.router.url.split('/')
    if (activeLink.includes('edit')) {
      this.openTab = 'edit'
    } else {
      this.openTab = 'view'
    }
    if (activeLink.includes('add-new') || activeLink.includes('labour') || activeLink.includes('plant_machinary') || activeLink.includes('material-management') || this.activeFromName =='vendor-management'|| activeLink.includes('create-project')|| activeLink.includes('edit-project') || activeLink.includes('edit-jv-incorporation')) {
      this.openTab = 'edit'
    } else {

    }
  }

  enableDisableSwitch() {
    let activeLink = this.router.url.split('/')
    if (this.selectedTab == 'tender_executive_summary' || this.activeFromName == 'tender_survey_details' || activeLink.includes('add-new') || activeLink.includes('planning') || activeLink.includes('plant_machinary') || activeLink.includes('material-management') ||  this.activeFromName =='vendor-management' || activeLink.includes('create-project') || this.selectedTab == 'tender_top_sheet' || activeLink.includes('edit-project') || activeLink.includes('edit-jv-incorporation') || activeLink.includes('jv-incorporation') || activeLink.includes('labour') || this.selectedTab == 'tender_lmpi_group') {
      this.tableViewEnable = false
    } else {
      this.tableViewEnable = true
    }
  }

  prePopulateData(data: any) {
    this.tableViewData = data;
    let InputList = []
    for (let i = 0; i < data.length; i++) {
      if (true) {
        InputList.push(data[i].internal_name)
        let val: any = ''
        if (data[i].value_id != "") {
          if(Array.isArray(data[i].value_id)) {
            val = this.generateMultiselectBindValue(data[i],this.countOccourance(InputList, data[i].internal_name,data[i]).toString())
          }else {
            val = data[i].value_id
          }
        } else if (this.isJsonString(data[i].value) && Array.isArray(JSON.parse(data[i].value))) {
          if (InputList.includes(data[i].internal_name)) {
            val = this.generateMultiselectBindValue(data[i], this.countOccourance(InputList, data[i].internal_name,data[i]).toString())
          } else {
            val = this.generateMultiselectBindValue(data[i], '1')
          }
        } else if (this.isJsonString(data[i].value_id) && Array.isArray(JSON.parse(data[i].value_id))) {
          if (InputList.includes(data[i].internal_name)) {
            val = this.generateMultiselectBindValue(data[i], this.countOccourance(InputList, data[i].internal_name,data[i]).toString())
          } else {
            val = this.generateMultiselectBindValue(data[i], '1')
          }
        } else if(data[i].internal_name == 'party_name_standalone' || data[i].internal_name == 'select_own_company') {
          val = data[i].value
          if(!isNaN(val)) {
            this.ownCompanyId = val
            this.setUpBindingForJV()
          }
        }
        else if(data[i].internal_name == 'lead_member_name') {
          val = data[i].value
          if(!isNaN(val)) {
            for (let i = 0; i < this.formData.length; i++) {
              for (let j = 0; j < this.formData[i].form_fields.length; j++) {
                if (this.formData[i].form_fields[j].form_internal_name == 'lead_member_name' && this.formData[i].form_fields[j].dependent_dropdown_choices.length > 0 && !isNaN(val)) {
                  for( let k=0;k<this.formData[i].form_fields[j].dependent_dropdown_choices.length;k++) {
                    if(this.formData[i].form_fields[j].dependent_dropdown_choices[k].id == val) {
                      this.jdLeadID = this.formData[i].form_fields[j].dependent_dropdown_choices[k].option_id
                    }
                  }
                }
              }
            }
            this.setUpBindingForJV()
          }
        } 
        else {
          val = data[i].value
        }

        if(data[i].document != "") {
          val = environment.API_URL1 + data[i].document
        }

        if (InputList.includes(data[i].internal_name)) {
          this.tenderdata[data[i].internal_name +data[i].form_group_id +'_'+ this.countOccourance(InputList, data[i].internal_name,data[i]).toString()] = val
        } else {
          this.tenderdata[data[i].internal_name +data[i].form_group_id+ '1'] = val
        }
      }
    }
    

    for (let i = 0; i < this.formData.length; i++) {
      if (this.prefieldData.results?.form_editable == false) {
        this.formData[i].disableValue = true;
        this.btndisable = true;
      } else {
        this.formData[i].disableValue = false;
        this.btndisable = false;
      }
    }
    this.setUpFormBinding(this.formData)
  }

  ifprefieldvalue(data:any) {
    if(typeof data === 'string' || data instanceof String) {
      return false
    }else {
      return true
    }
  }

  generateMultiselectBindValue(data: any, index: any) {
    let selectedItems: any = []
    for (let i = 0; i < this.formData.length; i++) {
      for (let j = 0; j < this.formData[i].form_fields.length; j++) {
        if (this.formData[i].form_fields[j].form_internal_name.toString() == data.internal_name.toString()) {
          if (this.formData[i].form_fields[j].dependent_dropdown_choices.length > 0) {
            if(data.value_id == "") {
              if(this.isJsonString(data.value) && Array.isArray(JSON.parse(data.value))) {
                data.value = JSON.parse(data.value)
              }
              selectedItems = this.arrayFileterOperation(this.formData[i].form_fields[j].dependent_dropdown_choices, data.value)
            }else {
              selectedItems = this.arrayFileterOperation(this.formData[i].form_fields[j].dependent_dropdown_choices, data.value_id)
            }
          } else {
            // selectedItems = this.arrayFileterOperation(this.formData[i].form_fields[j].dropdown_choices, data.value)
          }
        }
      }
    }
    return selectedItems
  }

  arrayFileterOperation(list: any, selected: any) {
    let selectedItem = []
    for (let i = 0; i < selected.length; i++) {
      for (let j = 0; j < list.length; j++) {
        if (selected[i] == list[j].id) {
          selectedItem.push(list[j])
          if(list[j].query_name == 'jv_master') {
            this.JVDATALIST.push(list[j])
            this.setUpBindingForJV()
          }
        }
      }
    }
    return selectedItem
  }

  isJsonString(str: any) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  countOccourance(Data: any, find: string,objData:any) {
    if(objData.is_multiple) {
      if(objData.by_order > 1) {
        this.AddNewRowCode(objData)
      }
      if(objData.by_order) {
        return objData.by_order
      } else {
        return 1
      }
    }
    let count = 0;
    for (let i = 0; i < this.formData.length; i++) {
      for (let j = 0; j < this.formData[i].form_fields.length; j++) {
        if (this.formData[i].form_fields[j].form_internal_name == find && this.formData[i].form_fields[j].form_group == objData.form_group_id) {
          count++
        }
      }
    }
    if(count == 0) {
      count ++
    }
    
    return count
  }

  dropDownSettings() {
    this.MultidropdownSettings = {
      singleSelection: false,
      disabled: false,
      text: "",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    }
  }

  AddNewRow(data: any) {
    this.formData[data].Datatouples.push(this.formData[data].Datatouples[this.formData[data].Datatouples.length - 1] + 1)
  }
  AddNewRowCode(data: any) {
    for(let i=0;i<this.formData.length;i++) {
      if(this.formData[i].id == data.form_group_id) {
        if(!this.formData[i].Datatouples.includes(data.by_order)) {
          this.formData[i].Datatouples.push(data.by_order)
        }
      }
    }
  }

  fileRequiredValidation(fileData:any,fileControl:any) {
    if(fileControl == false) {
      return false
    } else {
      if(fileData == undefined) {
        return true
      }else {
        return false
      }
    }
  }

  previewDoc(data:any,ctrlName:any,groupid:any,dataTouple:any) {
    if(this.filesData[this.getInputID(groupid,ctrlName)+'_'+dataTouple]) {
      this.docPreview.showDoc('',this.filesData[this.getInputID(groupid,ctrlName)+'_'+dataTouple])
    }else {
      this.docPreview.showDoc(data,{})
    }
  }

  removeDoc(ctrl_name:any) {
    this.tenderdata[ctrl_name] = undefined
  }

  filterFileNameOnly(fullname:any) {
    return fullname.replace(/\ /g, "").split('/').pop()
  }

  removeRow(data: any, datatouple: any) {
    const index = this.formData[data].Datatouples.indexOf(datatouple, 0);
    if (index > -1) {
      this.formData[data].Datatouples.splice(index, 1);
    }
    this.formData[data].Datatouples
  }

  proceedNext() {
    // this.navservice.changeNav('locationDetails');
  }

  resetForm() {
    this.dataForm.resetForm()
  }

  dynamicFileTypes(data: any) {
    let res = ''
    for (let i = 0; i < data.length; i++) {
      res += '.'
      res += data[i].option.split('.').join("").toLowerCase()
      res += ','
    }
    return res.slice(0, -1)
  }

  uploadFile(event: any, allowdtypes: any,ctrlName:any,groupid:any,dataTouple:any) {
    if (allowdtypes.split('.').join("").split(',').includes(event.target.files[0].name.split('.').pop().toLowerCase())) {
      this.filesData[this.getInputID(groupid,ctrlName)+'_'+dataTouple] = event.target.files[0]
      // this.tenderdata[event.target.getAttribute("ctrl_name")] = event.target.files[0];
      this.toastrService.success("File added Successfully", '', {
        timeOut: 2000,
      });
    } else {
      this.toastrService.error("Please Choose a valid File", '', {
        timeOut: 2000,
      });
    }
  }

  customFormula(data: any,fieldID:any, index: any) {
    for (let i = 0; i < data.length; i++) {
      this.calCulatorCustomFormula(data[i], index,fieldID)
    }
  }

  formulaOnFormula(internal_name: any, Datatouple: any,fieldID:any) {
    for (let i = 0; i < this.formData.length; i++) {
      for (let j = 0; j < this.formData[i].form_fields.length; j++) {
        if (this.formData[i].form_fields[j].form_internal_name.toString() == internal_name.toString()) {
          if (this.formData[i].form_fields[j].form_input_type.toString() == "formulla") {
            this.customFormula(this.formData[i].form_fields[j].all_formulas, Datatouple,fieldID)
          }
        }
      }
    }
  }

  calCulatorCustomFormula(data: any, toupleIndex: any,fieldID:any) {
    let value = this.applyFormula(atob(data.formula).replace(/"([^"]+(?="))"/g, '$1'), toupleIndex,fieldID);
    this.tenderdata[data.internal_name+fieldID+'_' + toupleIndex] = Number(value).toFixed(2)
    this.formulaOnFormula(data.internal_name, toupleIndex,fieldID)
  }
  applyFormula(data: any, toupleIndex: any,fieldID:any) {
    var found = [],
      rxp = /{{([^}}]+)}}/g,
      curMatch;
    while (curMatch = rxp.exec(data)) {
      found.push(curMatch[1]);
    }
    for (let i = 0; i < found.length; i++) {
      if (this.tenderdata[found[i]+ fieldID + '_' + toupleIndex]) {
        let a = ''.toString() + found[i]
        var regExp = new RegExp('{{' + a + '}}').toString();
        regExp = regExp.substring(1, regExp.length - 1);
        data = data.replace(regExp, this.tenderdata[found[i]+ fieldID + '_' + toupleIndex]);
      } else {
        return ''
      }
    }
    let val = evaluateInfix(data);
    return val

  }

  submitData() {
    this.genarateTenderData(this.formData)
  }

  setUpFormBinding(jsonData: any) {
    for (let jd = 0; jd < jsonData.length; jd++) {
      let data = jsonData[jd]
      for (let toupleIndex = 0; toupleIndex < data.Datatouples.length; toupleIndex++) {
        let dt = data.Datatouples[toupleIndex]
        for (var key in data.form_fields) {
          if (data.form_fields[key].form_input_type == 'boolean') {
            if (this.tenderdata[data.form_fields[key].form_internal_name +data.id + '_' + dt] == 'Yes') {
              this.tenderdata[data.form_fields[key].form_internal_name +data.id + '_' + dt] = true
            }
            if (this.tenderdata[data.form_fields[key].form_internal_name +data.id + '_' + dt] == 'No') {
              this.tenderdata[data.form_fields[key].form_internal_name +data.id + '_' + dt] = false
            }
          }
          if (data.form_fields[key].form_input_type == 'dropdown') {
            if (this.tenderdata[data.form_fields[key].form_internal_name +data.id + '_' + dt]) {
              let condition:any = data.form_fields[key].conditinal_on
              for (let i = 0; i < condition.length; i++) {
                if (this.tenderdata[data.form_fields[key].form_internal_name +data.id + '_' + dt] == condition[i].option_id.toString()) {
                  this.openHideField(condition[i].form_id, true)
                } else {
                  this.openHideField(condition[i].form_id, false)
                }
              }
            }
          }
        }
      }
    }
  }

  setUpBindingForJV() {
    // this.prePopulateData(this.prefieldData.results.tender_data)
    // this.JVDATALIST = this.JVDATALIST.filter((i: { query_name: string; }) => i.query_name != 'company')
    // if(this.JVDATALIST.length > 0) {
    //   this.ShowJVDATA = true
    // } else {
    //   this.ShowJVDATA = false
    // }
    this.ShowJVDATA = true
    let leadIndex = 0
    let jvIndexInFormMaster = 0
    for(let i=0;i<this.formData.length;i++) {
      if(this.formData[i].id == this.JV_MASTER_FROM.id) {
        jvIndexInFormMaster = i
        break
      }
    }

    if(this.ownCompanyId != '') {
      this.JVDATALIST = this.JVDATALIST.filter((company: { query_name: string; }) => company.query_name != "company");
      for(let i=0;i<this.formData.length;i++) {
        for(let j=0;j<this.formData[i].form_fields.length;j++) {
          if(this.formData[i].form_fields[j].form_internal_name == 'select_own_company' || this.formData[i].form_fields[j].form_internal_name == 'party_name_standalone') {
            for(let k=0;k<this.formData[i].form_fields[j].dependent_dropdown_choices.length;k++) {
              if(this.formData[i].form_fields[j].dependent_dropdown_choices[k].id == this.ownCompanyId) {
                this.JVDATALIST.push(this.formData[i].form_fields[j].dependent_dropdown_choices[k])
                break
              }
            }
          }
          if(this.formData[i].form_fields[j].form_internal_name == 'lead_member_name') {
            for(let k=0;k<this.formData[i].form_fields[j].dependent_dropdown_choices.length;k++) {
              if(this.formData[i].form_fields[j].dependent_dropdown_choices[k].id == this.jdLeadID) {
                leadIndex = k
              }
            }
            
          }

        }
      }
    }
    this.formData[jvIndexInFormMaster].Datatouples = [1]
    for(let i=0;i<this.JVDATALIST.length;i++) {
      this.formData[jvIndexInFormMaster].Datatouples.push(i+1) 
    }
    for(let i=0;i<this.JVDATALIST.length;i++) {
      for(let j=0;j<this.JV_MASTER_FROM.form_fields.length;j++) {
        if((this.JV_MASTER_FROM.form_fields[j].form_internal_name != 'jv_share__details' || this.JV_MASTER_FROM.form_fields[j].form_internal_name != 'bid_capacity' || this.JV_MASTER_FROM.form_fields[j].form_internal_name != 'bid_capacity_percentage_analysis') && this.JV_MASTER_FROM.form_fields[j].form_internal_name != 'selected_as_lead_jv_analytics') {
          this.tenderdata[this.JV_MASTER_FROM.form_fields[j].form_internal_name +this.JV_MASTER_FROM.form_fields[j].form_group+ '_' + this.increment(i)] = this.JVDATALIST[i].dependent_drowndown_values[this.JV_MASTER_FROM.form_fields[j].form_internal_name]
        }
        if(this.JV_MASTER_FROM.form_fields[j].form_internal_name == 'selected_as_lead_jv_analytics' && this.jdLeadID !=''){
          if(this.JVDATALIST[i].option_id == this.jdLeadID) {
            this.tenderdata[this.JV_MASTER_FROM.form_fields[j].form_internal_name +this.JV_MASTER_FROM.form_fields[j].form_group+ '_' + this.increment(i)] = true
          }else {
            this.tenderdata[this.JV_MASTER_FROM.form_fields[j].form_internal_name +this.JV_MASTER_FROM.form_fields[j].form_group+ '_' + this.increment(i)] = false
          }
          
        }
      }
    }
    if(this.JVDATALIST.length == 1 ) {
      this.tenderdata['selected_as_lead_jv_analytics151_1'] = true;
      this.tenderdata['jv_share__details151_1'] = 100
    }
    let uniquelist:any = []
    let uniqueArray:any = []
    for(let i=0;i<this.JVDATALIST.length;i++) {
      if(uniquelist.indexOf(this.JVDATALIST[i].id) < 0) {
        uniquelist.push(this.JVDATALIST[i].id)
        uniqueArray.push(this.JVDATALIST[i])
      }
    }
    this.JVDATALIST = uniqueArray
  }

  JVChange(focusId:any,controleName:any) {
    if(controleName.form_internal_name == 'jv_share__details') {
      let sum = 0
      for(let i=0;i<this.JVDATALIST.length;i++) {
        sum +=  parseFloat(this.tenderdata[controleName.form_internal_name +controleName.form_group+ '_' + this.increment(i)])
      }
      if(sum != 100) {
        this.toastrService.error("Kindly provide valid JV Share (In %) sum should be 100 currently it is "+sum, '', {
          timeOut: 2000,
        });
      }
    }
  }

  genarateTenderData(jsonData: any) {

    let form_datatest = new FormData();

    for (let jd = 0; jd < jsonData.length; jd++) {
      let data = jsonData[jd]
      for (let toupleIndex = 0; toupleIndex < data.Datatouples.length; toupleIndex++) {
        let dt = data.Datatouples[toupleIndex]
        for (var key in data.form_fields) {
          if (data.form_fields[key].form_input_type == 'dependant-multiselect' || data.form_fields[key].form_input_type == 'multiselect' || (data.form_fields[key].form_input_type == 'reference' && data.form_fields[key].condition_input_type == 'dependant-multiselect')) {
            let selected = []
            let tempsel = this.tenderdata[data.form_fields[key].form_internal_name +data.id+ '_' + dt]
            if(tempsel) {
              for (let j = 0; j < tempsel.length; j++) {
                selected.push(tempsel[j].id)
              }
            }
            form_datatest.append(data.form_fields[key].id + '_' + dt, JSON.stringify(selected));
          }else if (data.form_fields[key].form_input_type == 'file') {
          } else {
            if (this.tenderdata[data.form_fields[key].form_internal_name +data.id+ '_'+ '' + dt] == undefined) {
              this.tenderdata[data.form_fields[key].form_internal_name +data.id+ '_'+ '' + dt] = ''
            }
            form_datatest.append(data.form_fields[key].id + '_' + dt, this.tenderdata[data.form_fields[key].form_internal_name +data.id+ '_'+ '' + dt]);
          }
        }
      }
    }

    let data: any = {}
    for (var pair of form_datatest.entries()) {
      data[pair[0]] = pair[1]
    }

    let dynamicData = {
      reloadRequired: this.reloadRequired,
      tenderbuttonAction: this.tenderbuttonAction,
      data: data
    }
    this.datasharedservice.setObservableData(this.filesData)
    this.parentCompFun.emit(JSON.stringify(dynamicData))

  }

  checkIFValid() {
    this.scrollToFirstInvalidControl();
    return !this.validForm.nativeElement.innerHTML.toString().includes("ng-invalid")
  }

  validCheckforSurvey(){
    this.datasharedservice.saveLocalData('ValidForm',this.validForm.nativeElement.innerHTML.toString().includes("ng-invalid").toString());
    this.scrollToFirstInvalidControl();
    this.finalSubmit();
    return !this.validForm.nativeElement.innerHTML.toString().includes("ng-invalid")
  }

  scrollToFirstInvalidControl() {
    let form:any = document.getElementById('PMS_DYNAMIC');
    let firstInvalidControl = form.getElementsByClassName('ng-invalid')[0];
    if(firstInvalidControl) {
      firstInvalidControl.scrollIntoView({behavior: 'smooth'});
      (firstInvalidControl as HTMLElement).focus();
    }
  }

  parentFun(getValue: any) {
    for (let i = 0; i < this.formData[0].form_fields.length; i++) {
      if (this.formData[0].form_fields[i].id == getValue.formId) {
        this.formData[0].form_fields[i].dependent_dropdown_choices.push(getValue);
        this.tenderdata[this.attributeName] = getValue.id
      }
    }
  }

  getInputID(groupid:any,controleName:any) {
    for(let i=0;i<this.formData.length;i++) {
      if(this.formData[i].id == groupid) {
        for(let j=0;j<this.formData[i].form_fields.length;j++) {
          if(this.formData[i].form_fields[j].form_internal_name == controleName) {
            return this.formData[i].form_fields[j].id
          }
        }
      }
    }
    return ''
  }

  applyContition(condition: any, event: any, ApiUrl: any, formId: any, QueryParam: any,fromControl:any) {
    this.numberInputChange(event,fromControl)
    // jdLeadID
    if(fromControl.form_internal_name == 'participations_mode') {
      this.JVDATALIST = []
      this.jdLeadID = ''
      this.ownCompanyId = ''
      this.ShowJVDATA = false
      this.resetByControlName('party_name')
      this.resetByControlName('select_own_company')
      this.resetByControlName('lead_member_name')
      this.resetByControlName('party_name_standalone')
    }

    if(fromControl.form_internal_name == 'lead_member_name') {
      for(let i=0;i<fromControl.dependent_dropdown_choices.length;i++) {
        if(fromControl.dependent_dropdown_choices[i].id == event.target.value) {
          this.jdLeadID = fromControl.dependent_dropdown_choices[i].option_id
        }
      }
      this.setUpBindingForJV()
    }
    if(fromControl.form_internal_name == 'select_own_company' || fromControl.form_internal_name == 'party_name_standalone') {
      for(let i=0;i<fromControl.dependent_dropdown_choices.length;i++) {
        if(fromControl.dependent_dropdown_choices[i].id == event.target.value) {
          this.ownCompanyId = event.target.value
          this.setUpBindingForJV()
          break
        }
      }
    }
    if(Array.isArray(event)) {
      if(QueryParam=='jv_master') {
        this.JVDATALIST = event
        this.setUpBindingForJV()
      }
    } else {
      if (event.target.value == 'add-new') {
        event.preventDefault()
        this.tdActionChild.addOtherDropdown(ApiUrl, formId, QueryParam)
      }
  
      if (formId == '553' && event.target.value == '1060') {
        this.tdActionChild.showCatagoryUpdationFactor()
      }
  
      if (formId == '587' && event.target.value == '1062') {
        this.tdActionChild.showYearUpdationFactor()
      }
  
      for (let i = 0; i < condition.length; i++) {
        if (event.target.value == condition[i].option_id.toString()) {
          this.openHideField(condition[i].form_id, true)
        } else {
          this.openHideField(condition[i].form_id, false)
        }
      }
    }
  }

  resetByControlName(controleName:any) {
    for (let i = 0; i < this.formData.length; i++) {
      for (let j = 0; j < this.formData[i].form_fields.length; j++) {
        if (this.formData[i].form_fields[j].form_internal_name == controleName) {
          this.tenderdata[this.formData[i].form_fields[j].form_internal_name +this.formData[i].form_fields[j].form_group +'_'+ '1'] = ''
        }
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

  submitAndContinue() {
    this.reloadRequired = true
    this.finalSubmit()
  }

  rejectTender() {
    this.reloadRequired = false;
    this.tenderbuttonAction = 'reject';
    this.finalSubmit()
  }

  updateTender() {
    this.reloadRequired = false;
    this.tenderbuttonAction = 'updateStatus';
    this.finalSubmit()
  }

  finalSubmit() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  numberInputChange(event:any,fromControl:any){
    let gropuID
    if(fromControl.on_key_avail) {
      for(let i=0;i<this.formData.length;i++) {
        for(let j=0;j<this.formData[i].form_fields.length;j++) {
          if(this.formData[i].form_fields[j].form_internal_name == fromControl.form_internal_name) {
            fromControl.Datatouples = this.formData[i].Datatouples
            gropuID = this.formData[i].id
            break;
          }
        }
      }
      let form_datatest = new FormData();
      let data = fromControl
      for (let toupleIndex = 0; toupleIndex < data.Datatouples.length; toupleIndex++) {
        let dt = data.Datatouples[toupleIndex]
          if (fromControl.form_input_type == 'dependant-multiselect' || fromControl.form_input_type == 'multiselect' || (fromControl.form_input_type == 'reference' && fromControl.condition_input_type == 'dependant-multiselect')) {
            let selected = []
            let tempsel = this.tenderdata[fromControl.form_internal_name +gropuID+ '_' + dt]
            if(tempsel) {
              for (let j = 0; j < tempsel.length; j++) {
                selected.push(tempsel[j].id)
              }
            }
            form_datatest.append(fromControl.id + '_' + dt, JSON.stringify(selected));
          }else if (fromControl.form_input_type == 'file') {
          } else {
            if (this.tenderdata[fromControl.form_internal_name +gropuID+ '_'+ '' + dt] == undefined) {
              this.tenderdata[fromControl.form_internal_name +gropuID+ '_'+ '' + dt] = ''
            }
            form_datatest.append(fromControl.id + '_' + dt, this.tenderdata[fromControl.form_internal_name +gropuID+ '_'+ '' + dt]);
          }

    }
    let data1: any = {}
    for (var pair of form_datatest.entries()) {
      data1[pair[0]] = pair[1]
    }
    let dynamicData = {
      reloadRequired: this.reloadRequired,
      tenderbuttonAction: this.tenderbuttonAction,
      data: data1
    }
    this.datasharedservice.setObservableData(this.filesData)
    this.changeValue.emit(JSON.stringify(dynamicData))
    }
  }

  multipleEntryTable() {
    this.multipleEntry = !this.multipleEntry;
    if (this.multipleEntry) {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('tender_type', 'all')
      params.set('form_menu_type', 'tender_eligibility')
      params.set('list', 'true')
      params.set('is_paginated', '1')
      this.apiservice.getTenderList(params).subscribe(data => {
        this.tenderExcelData = data;
      })
    } else {
      window.location.reload()
    }
  }

  viewTableData(data: any) {
    this.RouteToRoll(this.router.url.replace(this.openTab, data))
  }

  RouteToRoll(route: any) {
    this.router.navigate([route])
      .then(() => {
        window.location.reload();
      });
  }

  getUserDetails() {
    let activeLink = this.router.url.split('/')
    if (this.datasharedservice.getLocalData('tender_id')) {
      this.apiservice.gettenderUserDetails(this.datasharedservice.getLocalData('tender_id')).subscribe(data => {
        this.tenderAction  = data
        if (activeLink.includes('tender') && activeLink.includes('add-new') && data.results[0].tabular_enabled) {
          this.showMultiPlebutton = true
        } else {
          this.showMultiPlebutton = false
        }
        if (data.results[0].form_type == 'tender_executive_commitee' || data.results[0].form_type == 'tender_final_approval') {
          this.needacceptTnCText = 'I have verified all the documents and sending for approval.'
          this.needacceptTnC = true
        } else {
          this.needacceptTnC = false
        }        
      })
    } else {
      this.apiservice.gettenderUserpermission().subscribe(data => {
        if (activeLink.includes('tender') && activeLink.includes('add-new') && data.results[0].tabular_enabled) {
          this.showMultiPlebutton = true
        } else {
          this.showMultiPlebutton = false
        }
      })
    }
  }

  checkSelctableCondition(currentValue:any,is_multiple:any,Datatouples:any,controlName:any,viewType:any) {
    if(viewType == 'TABULAR') {
      return false
    }
    if(is_multiple) {
      let selectedVal = [];
      for(let i=0;i<Datatouples.length;i++) {
        if(this.tenderdata[controlName+'_'+Datatouples[i]]) {
          selectedVal.push(this.tenderdata[controlName+'_'+Datatouples[i]].toString())
        }
      }
      if(selectedVal.includes(currentValue.toString())) {
        return true
      } else {
        return false
      }
      
    } else {
      return false
    }
  }

}
