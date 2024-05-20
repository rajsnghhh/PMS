import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NavigationService } from 'src/app/Shared/Services/navigation.service';
import { evaluateInfix } from 'calculator-lib';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-survey-content',
  templateUrl: './survey-content.component.html',
  styleUrls: [
    './survey-content.component.scss',
    '../../../assets/scss/survey-common.scss',
    '../../../assets/scss/from-coomon.scss'
  ]
})
export class SurveyContentComponent implements OnInit {
  surveyNav = 0;
  @Input()
  dataList!: any[];
  @ViewChild('f')
  tebderDataForm!: NgForm;

  @ViewChild('f', { read: ElementRef })
  validForm!: ElementRef<HTMLElement>;

  fromDataList: any = [];
  query: any;
  tenderdata: any = {}
  MultidropdownSettings = {};
  localStorageData: any
  constructor(
    private navservice: NavigationService,
    private toastrService: ToastrService,
    private router: Router,
    private commonFunction: CommonFunctionService,
    private datasharedservice: DataSharedService,
    private apiservice: APIService
  ) {
    this.navservice.currentNav().subscribe(navLocation => {
      this.surveyNav = navLocation;
      this.tebderDataForm.resetForm()
      this.fromDataList = this.dataList[this.surveyNav]
      this.query = this.dataList[this.dataList.length - 1]
      if(this.query.tender_id != 'null') {
        this.getPrefildData()
      }
    });
  }



  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.surveyNav = 0
    this.fromDataList = this.dataList[this.surveyNav]
    this.query = this.dataList[this.dataList.length - 1]
    this.dropDownSettings()
    if(this.query.tender_id != 'null') {
      this.getPrefildData()
    }
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

  submitTenderData() {
    this.genarateTenderData(this.fromDataList)
  }

  checkIFValid() {
    if(this.validForm.nativeElement.innerHTML.split(' ').includes('ng-invalid\"')) {
      return false
    } else {
      return true
    }
  }

  genarateTenderData(jsonData: any) {

    let form_datatest = new FormData();

    let data = jsonData
    for (let dt = 1; dt <= data.Datatouples.length; dt++) {
      for (var key in data.form_fields) {
        if (data.form_fields[key].form_input_type == 'multiselect') {
          let selected = []
          let tempsel = this.tenderdata[data.form_fields[key].form_internal_name + '' + dt]
          for (let j = 0; j < tempsel.length; j++) {
            selected.push(tempsel[j].id)
          }
          form_datatest.append(data.form_fields[key].id+ '_' + dt, JSON.stringify(selected));
        } else {
          if (this.tenderdata[data.form_fields[key].form_internal_name + '' + dt] == undefined) {
            this.tenderdata[data.form_fields[key].form_internal_name + '' + dt] = ''
          }
          form_datatest.append(data.form_fields[key].id + '_' + dt, this.tenderdata[data.form_fields[key].form_internal_name + '' + dt]);
        }
      }
    }
    let query1 = this.commonFunction.getURL(
      {
        organization_id: this.localStorageData.organisation_details[0].id,
        tender_id: this.query.tender_id,
        form_type: this.query.form_type
      }
    )
    this.saveTenderData(query1, form_datatest)

  }

  saveTenderData(query: string, data: any) {
    this.apiservice.saveTenderData(query, data).subscribe((data: any) => {
      this.toastrService.success(Success_Messages.SuccessAdd, '', {
        timeOut: 2000,
      });
      this.query.tender_id = data.results.Data.id
      this.proceedNext()
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

  proceedNext() {
    if (this.surveyNav == this.dataList.length - 2) {
      this.router.navigate(['pms/tender/add-new'])
    } else {
      this.navservice.changeNav((parseInt(this.surveyNav.toString()) + 1).toString());
    }

  }

  getPrefildData() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.localStorageData.organisation_details[0].id,
        id: this.query.tender_id,
        form_menu_type: this.query.form_type,
        form_group_id: this.fromDataList.id
      }
    )

    this.apiservice.getTenderData(query).subscribe(data => {
      let InputList = []
      for (let i = 0; i < data.tender_data.length; i++) {
        if (parseInt(data.tender_data[i].id)) {
          InputList.push(data.tender_data[i].internal_name)
          if (InputList.includes(data.tender_data[i].internal_name)) {
            this.tenderdata[data.tender_data[i].internal_name + this.countOccourance(InputList, data.tender_data[i].internal_name).toString()] = data.tender_data[i].value
          } else {
            this.tenderdata[data.tender_data[i].internal_name + '1'] = data.tender_data[i].value
          }
        }
      }
    });
  }

  countOccourance(Data: any, find: string) {
    let count = 0;
    for (let i = 0; i < Data.length; i++) {
      if (Data[i] == find) {
        count++
      }
    }
    return count
  }

  AddNewRow() {
    this.dataList[this.surveyNav].Datatouples.push(this.dataList[this.surveyNav].Datatouples.length + 1)
    this.fromDataList = this.dataList[this.surveyNav]
  }

  customFormula(data: any) {
    for (let i = 0; i < data.length; i++) {
      this.calCulatorCustomFormula(data[i])
    }
  }

  calCulatorCustomFormula(data: any) {
    this.tenderdata[data.internal_name] = this.applyFormula(atob(data.formula).replace(/"([^"]+(?="))"/g, '$1'))
  }

  applyFormula(data: any) {
    var found = [],
      rxp = /{{([^}}]+)}}/g,
      curMatch;
    while (curMatch = rxp.exec(data)) {
      found.push(curMatch[1]);
    }
    for (let i = 0; i < found.length; i++) {
      if (this.tenderdata[found[i]]) {
        var regExp = new RegExp('{{' + found[i] + '}}');
        data = data.replace(regExp, this.tenderdata[found[i]]);
      } else {
        return ''
      }
    }
    let val = evaluateInfix(data);
    return val

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

  uploadFile(inputName: any, event: any, allowdtypes: any) {
    if (allowdtypes.split('.').join("").split(',').includes(event.target.files[0].name.split('.').pop().toLowerCase())) {
      this.tenderdata[inputName] = event.target.files[0];
      this.toastrService.success("File added Successfully", '', {
        timeOut: 2000,
      });
    } else {
      this.toastrService.error("Please Choose a valid File", '', {
        timeOut: 2000,
      });
    }

  }

}
