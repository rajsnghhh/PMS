import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';


@Component({
  selector: 'app-update-field',
  templateUrl: './update-field.component.html',
  styleUrls: ['./update-field.component.scss',
    '../../../../../assets/scss/scrollableTable.scss',
    '../../../../../assets/scss/from-coomon.scss']
})
export class UpdateFieldComponent implements OnInit {
  @ViewChild('text') text!: ElementRef<HTMLElement>;
  @ViewChild('textarea') textarea!: ElementRef<HTMLElement>;
  @ViewChild('dropdown') dropdown!: ElementRef<HTMLElement>;
  @ViewChild('checkbox') checkbox!: ElementRef<HTMLElement>;
  @ViewChild('radio') radio!: ElementRef<HTMLElement>;
  @ViewChild('date') date!: ElementRef<HTMLElement>;
  @ViewChild('number') number!: ElementRef<HTMLElement>;
  @ViewChild('multiselect') multiselect!: ElementRef<HTMLElement>;
  @ViewChild('boolean') boolean!: ElementRef<HTMLElement>;
  @ViewChild('file') file!: ElementRef<HTMLElement>;
  @ViewChild('formulla') formulla!: ElementRef<HTMLElement>;
  @ViewChild('dependency') dependency!: ElementRef<HTMLElement>;
  @ViewChild('reference') reference!: ElementRef<HTMLElement>;
  @ViewChild('condition') condition!: ElementRef<HTMLElement>;
  @ViewChild('phone') phone!: ElementRef<HTMLElement>;



  public maxValue: number = 500;
  public minValue: number = 1;

  CheckField: any;
  caretPos: number = 0;
  tagList: any = [];
  dependentList: any = [];
  conditionList:any=[];
  conditionValue:any=[];
  conditionOptionValue:any;
  localStorageData: any;
  addmodulesForm!: FormGroup;
  chooseOption: any = [];
  is_required: boolean = false;
  GroupName: boolean = false;
  is_export: boolean = false;
  on_key_avail: boolean = false;
  is_search:boolean=false;
  is_other:boolean=false;
  is_hidden:boolean=false;
  Dependency: boolean = false;
  OptionData: any[] = [];
  editfieldId: any;
  previousData: any;
  dependencyList: any;
  countrylist:any;


  addmodules: any = {
    fieldlabel: '',
    internalname: '',
    description: '',
    option: '',
    grid: '',
    grName: '',
    file: [],
    formulla: '',
    dependency: '',
    referenceValue:'',
    condition:'',
    valCondition:'',
    pinputType:'',
    country:'',
    maxlength:200
  }
  tyofForm: any;
  groupList: any;
  form_category = ''
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
  formChoice:any=[];
  multiValueArray:any = [];
  multiSelectedValue:any=[];

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
      option: [''],
      grid: [''],
      grName: [''],
      file: [],
      formulla: [],
      dependency: [''],
      referenceValue:[''],
      condition:[''],
      valCondition:[''],
      pinputType:[''],
      maxlength:[''],
      country:[''],
    })
  }

  ngOnInit(): void {

    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.tyofForm = this.datasharedservice.getLocalData('formType');
    this.dropDownSettings();
    this.OptionData.push({
      option: '',
      catagory: ''
    });
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('form_type', this.tyofForm)
    this.apiservice.getDynamicForm(params).subscribe(data => {
      this.groupList = data.results;
    });
    this.setupMultiSelectOptions();
    this.getCountry();
    this.preFieldData();
  }

  getCountry(){
    this.apiservice.getCountryList().subscribe(data => {
      this.countrylist = data;
    })
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

  getTagList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('form_group_id', this.addmodules.grid);
    params.set('form_type', this.tyofForm);
    params.set('form_input_type', 'number');

    this.apiservice.getFormulaTag(params).subscribe(data => {
      this.tagList = data.results;
    })
  }

  changeValue(data:any){
    this.dropdownValueList=[];
    this.multiSelectedValue=[];
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('qryname',data);
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
  getDependentTagList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('form_group_id', this.addmodules.grid);
    params.set('form_type', this.tyofForm);

    this.apiservice.getFormulaTag(params).subscribe(data => {
      this.dependentList = data.results;
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
  preFieldData() {
    this.editfieldId = this.datasharedservice.getLocalData('EditFieldId');
    let params = new URLSearchParams();
    params.set('id', this.editfieldId)

    this.apiservice.getDetailsForm(params).subscribe(data => {
      this.previousData = data;
      this.addmodules.fieldlabel = data.form_label;
      this.addmodules.internalname = data.form_internal_name;
      this.form_category = data.form_category
      this.addmodules.description = data.form_description;
      this.addmodules.maxlength = data.maximum_character;
      this.addmodules.condition = data.conditional_choises[0]?.dependent_on_id;
      this.addmodules.valCondition = (data.conditional_choises[0]?.option_id+','+data.conditional_choises[0]?.itemName);
      this.addmodules.grid = data.form_group;
      this.addmodules.country = data.country_id;
      this.is_required = data.is_required;
      this.is_export = data.is_export;
      this.on_key_avail = data.on_key_avail;
      this.is_search=data.is_searchable;
      this.is_other=data.is_other,
      this.is_hidden=data.is_hidden,
      this.CheckField = data.form_input_type;
      if(data.form_input_type=="reference"){
        this.addmodules.pinputType=data.condition_input_type;
      }else{
        this.addmodules.pinputType=data.form_input_type;
      }
      if(data.hidden_param == true){
        this.CheckField = data.form_input_type;
      }else{
        this.CheckField = 'condition';
      }
      if(data.dependent_dropdown_choices.length!=0){
        this.addmodules.referenceValue=data.dependent_dropdown_choices[0]?.query_name;
        this.changeValue(this.addmodules.referenceValue)
      }

      this.addmodules.formulla = atob(data.formula_field).replace(/"([^"]+(?="))"/g, '$1');
      this.addmodules.dependency = parseInt(data.form_depended_id);
      this.multiSelectedValue=[];
      for (const item of data.dependent_dropdown_choices) {
        var obj = {
          id: item.option_id,
          itemName: item.name
        }
        this.multiSelectedValue.push(obj);
      }
      this.checkSelect();

      if (data.form_input_type == 'file') {
        this.preFileSelectData(data);
      } else {
        this.preOptionData();
      }
      this.getTagList();
      this.getConditionList();
      this.getDependentTagList();
    });
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
    this.formChoice.push(val);  }

  getConditionList(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('form_group_id',this.addmodules.grid);
    params.set('form_type',this.tyofForm);
    params.set('is_condition','true');

    this.apiservice.getFormulaTag(params).subscribe(data => {
      this.conditionList = data.results;
      this.conditionValue = this.conditionList.find((e: { id: string | null; }) => e.id == this.addmodules.condition)?.dropdown_choices;

    })

  }

  preOptionData() {
    if (this.previousData.dropdown_choices.length != 0) {
      this.OptionData = [];
      for (let opt of this.previousData.dropdown_choices) {
        this.OptionData.push({
          option: opt.option,
          catagory: opt.option_category
        });
      }
    }
  }
  preFileSelectData(data: any) {
    this.addmodules.file = [];
    for (let val of data.dropdown_choices) {
      this.addmodules.file.push(
        {
          id: this.idOfFileType(val.option),
          itemName: val.option
        }
      )
    }
  }
  idOfFileType(name: any) {
    for (let i = 0; i < this.dropdownUserList.length; i++) {
      if (this.dropdownUserList[i].itemName == name) {
        return this.dropdownUserList[i].id
      }
    }
  }
  checkSelect() {
    if (this.CheckField == 'text') {
      let el: HTMLElement = this.text.nativeElement;
      el.click();
    } else if (this.CheckField == 'textarea') {
      let el: HTMLElement = this.textarea.nativeElement;
      el.click();
    } else if (this.CheckField == 'dropdown') {
      let el: HTMLElement = this.dropdown.nativeElement;
      el.click();
    } else if (this.CheckField == 'checkbox') {
      let el: HTMLElement = this.checkbox.nativeElement;
      el.click();
    } else if (this.CheckField == 'radio') {
      let el: HTMLElement = this.radio.nativeElement;
      el.click();
    } else if (this.CheckField == 'file') {
      let el: HTMLElement = this.file.nativeElement;
      el.click();
    } else if (this.CheckField == 'date') {
      let el: HTMLElement = this.date.nativeElement;
      el.click();
    } else if (this.CheckField == 'boolean') {
      let el: HTMLElement = this.boolean.nativeElement;
      el.click();
    } else if (this.CheckField == 'number') {
      let el: HTMLElement = this.number.nativeElement;
      el.click();
    } else if (this.CheckField == 'formulla') {
      let el: HTMLElement = this.formulla.nativeElement;
      el.click();
    } else if (this.CheckField == 'dependency') {
      let el: HTMLElement = this.dependency.nativeElement;
      el.click();
    } else if (this.CheckField == 'reference') {
      let el: HTMLElement = this.reference.nativeElement;
      el.click();
    } else if (this.CheckField == 'condition') {
      let el: HTMLElement = this.condition.nativeElement;
      el.click();
    } else if (this.CheckField == 'phone') {
      let el: HTMLElement = this.phone.nativeElement;
      el.click();
    } else{
      let el: HTMLElement = this.multiselect.nativeElement;
      el.click();
    }
  }


  selectCheck(checkdata: any) {
    this.CheckField = '';
    this.CheckField = checkdata;
    if(!(checkdata=='reference' || checkdata=='condition')){
      this.addmodules.referenceValue='';
    }
    if(checkdata!='condition'){
      this.addmodules.condition='';

    }
  }
  addOption() {
    this.OptionData.push({
      option: '',
      catagory: ''
    });
  }

  removeOption(rid: number) {
    const index = this.OptionData.findIndex((option) => option.id === rid);
    this.OptionData.splice(index, 1);

  }
  cancleAdd() {
    this.router.navigateByUrl('/pms/settings/module-configuration/edit');
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
    if (this.addmodules.grid == 0) {
      this.Dependency = true;
      this.addmodulesForm.get('dependency')!.setValidators([Validators.required]);
    } else {
      this.Dependency = false;
      this.addmodulesForm.get('dependency')!.clearValidators();
    }
  }

  updateFields() {
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
        form_type: this.previousData.form_type,
        form_input_type: this.CheckField,
        form_group_name: this.addmodulesForm.value.grName,
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
        formula_field: btoa(JSON.stringify(this.addmodulesForm.value.formulla)),
        form_depended_id: parseInt(this.addmodulesForm.value.dependency),
        choise_list: this.chooseOption,
        form_dependent_choise_list:this.multiValueArray
      }
      this.apiservice.updateDynamicForm(req, this.editfieldId, this.localStorageData.organisation_details[0].id, this.addmodulesForm.value.grid).subscribe(data => {
        this.toastrService.success("Field Updated Successfully", '', {
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
