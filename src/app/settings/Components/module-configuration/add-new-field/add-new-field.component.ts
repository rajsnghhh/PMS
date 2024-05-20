import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';


@Component({
  selector: 'app-add-new-field',
  templateUrl: './add-new-field.component.html',
  styleUrls: ['./add-new-field.component.scss',
    '../../../../../assets/scss/scrollableTable.scss',
    '../../../../../assets/scss/from-coomon.scss',
  ]
})
export class AddNewFieldComponent implements OnInit {

  public maxValue: number = 500;
  public minValue: number = 1;

  countrylist:any;
  CheckField: any;
  conditionOptionValue:any;
  caretPos: number = 0;
  tagList:any=[];
  formChoice:any=[];
  dependentList:any=[];
  conditionList:any=[];
  conditionValue:any=[];
  localStorageData: any;
  addmodulesForm!: FormGroup;
  rightActive: boolean = false;
  chooseOption: any = [];
  is_required: boolean = false;
  is_export: boolean = false;
  on_key_avail: boolean = false;
  is_search:boolean=false;
  is_other:boolean=false;
  is_hidden:boolean=false;
  OptionData: any[] = [];
  GroupName: boolean = false;
  dependency: boolean = false;
  dropdownUserList: any = [
    {
      id: 1,
      itemName: 'Png'
    },
    {
      id: 2,
      itemName: 'Jpg'
    },
    {
      id: 3,
      itemName: 'Jpeg'
    },
    {
      id: 4,
      itemName: 'CSV'
    },
    {
      id: 5,
      itemName: 'PDF'
    },
    {
      id: 6,
      itemName: 'Xlxs'
    },
    {
      id: 7,
      itemName: 'Xls'
    },
    {
      id: 8,
      itemName: 'Doc'
    }
  ];
  dropdownUserSettings: any = {};
  dropdownValueSettings = {};
  dropdownValueList: any = [];
  multiValueArray:any = [];
  multiSelectedValue:any=[];

  addmodules: any = {
    fieldlabel: '',
    internalname: '',
    description: '',
    option: '',
    grid: '',
    grName: '',
    file: [],
    formulla:'',
    dependency:'',
    referenceValue:'',
    condition:'',
    valCondition:'',
    pinputType:'',
    country:0,
    maxlength:200
  }
  tyofForm: any;
  groupList: any;
  dependencyList: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private toastrService: ToastrService,
    private router: Router,
    private datasharedservice: DataSharedService,

  ) {
    this.addmodulesForm = formBuilder.group({
      fieldlabel: ['', Validators.required],
      internalname: ['', Validators.required],
      description: [''],
      grid: [''],
      grName: [''],
      option: [''],
      file: [''],
      formulla:[''],
      dependency:[''],
      referenceValue:[''],
      condition:[''],
      valCondition:[''],
      pinputType:[''],
      maxlength:[''],
      country:['']
    })
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.tyofForm = this.datasharedservice.getLocalData('formType');
    this.OptionData.push({
      option: ''
    });
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('form_type', this.tyofForm);
    params.set('fetch_type','all')

    this.apiservice.getDynamicForm(params).subscribe(data => {
      this.groupList = data.results;
    });
    this.addmodules.grid = this.datasharedservice.getLocalData('AddGroupId');
    this.dropDownSettings();
    this.getTagList();
    this.getCountry();
    this.getDependentTagList();
    this.getConditionList();
    this.setupMultiSelectOptions();
  }

  getCountry(){
    this.apiservice.getCountryList().subscribe(data => {
      this.countrylist = data;
    })
  }

  changeConditionValue(selectId:any){
    this.addmodules.valCondition = '';
    this.addmodules.pinputType = '';
    this.conditionValue = this.conditionList.find((e: { id: string | null; }) => e.id == selectId).dropdown_choices;
  }
  optionChange(){
    this.conditionOptionValue = this.addmodulesForm.value.valCondition.split(",");
    this.formChoice=[];
    var val = {
      on_field: this.conditionOptionValue[1],
      option_id: parseInt(this.conditionOptionValue[0]),
      dependent_id:parseInt(this.addmodulesForm.value.condition)
    }
    this.formChoice.push(val);

  }
  changeValue(){
    this.dropdownValueList=[];
    this.multiSelectedValue=[];
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('qryname',this.addmodulesForm.value.referenceValue);
    params.set('is_config','true');

    this.apiservice.getReferenceValue(params).subscribe(data => {
      for (const item of data.msg) {
        var obj = {
          id: item.id,
          itemName: item.name
        }
        this.dropdownValueList.push(obj);
      }
    })
  }

  setupMultiSelectOptions() {
    this.dropdownValueSettings = {
      singleSelection: false,
      text: "Select Value",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
  }

  changeGroup() {
    if (this.addmodules.grid == 0) {
      this.GroupName = true;
      this.addmodulesForm.get('grName')!.setValidators([Validators.required]);
    } else {
      this.GroupName = false;
      this.addmodulesForm.get('grName')!.clearValidators();
    }
  }

  changeDependency() {
    if (this.addmodules.dependency == 0) {
      this.dependency = true;
      this.addmodulesForm.get('dependency')!.setValidators([Validators.required]);
    } else {
      this.dependency = false;
      this.addmodulesForm.get('dependency')!.clearValidators();
    }
  }

  dropDownSettings() {
    this.dropdownUserSettings = {
      singleSelection: false,
      disabled: false,
      text: "",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    }
  }
  getTagList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('form_group_id',this.addmodules.grid);
    params.set('form_type',this.tyofForm);
    params.set('form_input_type','number');
    params.set('page_size','100');

    this.apiservice.getFormulaTag(params).subscribe(data => {
      this.tagList = data.results;
    })
  }

  getDependentTagList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('form_group_id',this.addmodules.grid);
    params.set('form_type',this.tyofForm);
    this.apiservice.getFormulaTag(params).subscribe(data => {
      this.dependentList = data.results;
    })
  }

  getConditionList(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('form_group_id',this.addmodules.grid);
    params.set('form_type',this.tyofForm);
    params.set('is_condition','true');

    this.apiservice.getFormulaTag(params).subscribe(data => {
      this.conditionList = data.results;
    })
  }

  getCaretPos(oField: any) {
    if (oField.selectionStart || oField.selectionStart == '0') {
      this.caretPos = oField.selectionStart;
    }
  }
  addToken(token: string) {
    const smsContent: string = this.addmodulesForm.controls['formulla'].value;

    if (this.caretPos >= 0) {
      const firstPart = smsContent.substring(0, this.caretPos);
      const secondPart = smsContent.substring(this.caretPos);

      const smsAndToken = `${firstPart} {{${token}}} ${secondPart}`;

      this.addmodulesForm.controls['formulla'].setValue(smsAndToken);
    }
  }
  labelName() {
    this.addmodules.internalname = this.internalName(this.addmodules.fieldlabel).toLowerCase().replace(/[&\/\\#, +()$~%.₹@!^'":*?<>{}]/g, '_');
  }
  internalName(data: any) {
    let res = '';
    if (data) {
      res = data.replaceAll(' ', '_');
    }
    return res;
  }
  selectCheck(checkdata: any) {
    this.CheckField = '';
    this.CheckField = checkdata;
    if (checkdata) {
      this.rightActive = true;
    }
    if(checkdata!='reference'){
      this.addmodules.referenceValue='';
    }
    if(checkdata!='condition'){
      this.addmodules.condition='';
    }
  }
  addOption() {
    this.OptionData.push({
      option: ''
    });
  }

  removeOption(rid: number) {
    this.OptionData.splice(rid, 1);

  }
  cancleAdd() {
    this.router.navigateByUrl('/pms/settings/module-configuration/edit');
  }

  addFields() {
    if (this.addmodulesForm.valid) {
      this.chooseOption = [];
      if (this.CheckField == 'file' || this.addmodules.pinputType=='file') {
        for (let file of this.addmodules.file) {
          this.chooseOption.push(file.itemName);
        }
      } else {
        for (let op of this.OptionData) {
          this.chooseOption.push(op.option);
        }
      }
      if(this.multiSelectedValue.length!=0){
        this.multiValueArray=[];
        for (const item of this.multiSelectedValue) {
          var obj = {
            id: item.id,
            name: item.itemName,
            query:this.addmodules.referenceValue
          }
          this.multiValueArray.push(obj);
        }
      }

      let req = {
        organization: this.localStorageData.organisation_details[0].id,
        form_group: this.addmodulesForm.value.grid,
        form_group_name: this.addmodulesForm.value.grName,
        form_depended_id: parseInt(this.addmodulesForm.value.dependency),
        form_type: this.datasharedservice.getLocalData('formType'),
        form_input_type: this.CheckField,
        form_label: this.addmodulesForm.value.fieldlabel,
        form_internal_name: this.addmodulesForm.value.internalname,
        form_description: this.addmodulesForm.value.description,
        maximum_character:this.addmodules.maxlength,
        country_id:this.addmodules.country,
        is_required: this.is_required,
        is_export: this.is_export,
        on_key_avail: this.on_key_avail,
        is_searchable:this.is_search,
        is_other:this.is_other,
        is_hidden:this.is_hidden,
        form_conditional_choise:this.formChoice,
        condition_input_type:this.addmodulesForm.value.pinputType,
        formula_field:btoa(JSON.stringify(this.addmodulesForm.value.formulla)),
        choise_list: this.chooseOption,
        form_dependent_choise_list:this.multiValueArray
      }
      this.apiservice.addNewDynamicForm(req).subscribe(data => {
        this.toastrService.success("New Field Added Successfully", '', {
          timeOut: 2000,
        });
        this.router.navigateByUrl('/pms/settings/module-configuration/edit');
      }, err => {
        this.toastrService.error(err.error.msg, '', {
          timeOut: 4000,
        });
      })
    } else {
      this.markFormGroupTouched(this.addmodulesForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: { markAsTouched: () => void; controls: any[]; }) => {
      control.markAsTouched();
      if (control.controls) {
        control.controls.forEach((c: FormGroup) => this.markFormGroupTouched(c));
      }
    });
  }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field)!.valid && (form.get(field)!.dirty || form.get(field)!.touched);
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'is-invalid': form.get(field)!.invalid && (form.get(field)!.dirty || form.get(field)!.touched),
      'is-valid': form.get(field)!.valid && (form.get(field)!.dirty || form.get(field)!.touched)
    };
  }

}
