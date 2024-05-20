import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { DynamicFormsComponent } from 'src/app/Shared/Module/dynamic-forms/dynamic-forms.component';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { NavigationService } from 'src/app/Shared/Services/navigation.service';

@Component({
  selector: 'app-add-plant-machinary',
  templateUrl: './add-plant-machinary.component.html',
  styleUrls: ['./add-plant-machinary.component.scss',
    '../../../../assets/scss/from-coomon.scss'
  ]
})
export class AddPlantMachinaryComponent implements OnInit, OnChanges {
  @Output()
  parentFun = new EventEmitter<string>();
  @Input() editItem: any;
  MenuFormList: any;
  form_type = '';
  ActionButtonName = ''
  localStorageData: any;
  formFieldList: any = [];
  prefieldData: any = [];
  tyofForm: any;

  @ViewChild('dynamicForm')
  dynamicForm!: DynamicFormsComponent;
  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private navservice: NavigationService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.getPrefildData();
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getSideMenuList();
  }

  getSideMenuList() {
    let params = new URLSearchParams();
    params.set('menu_id', '6')
    this.apiservice.getMenuFormList(params).subscribe(data => {
      this.MenuFormList = data.results;
      this.changeNav(this.MenuFormList[0]?.form_name, this.MenuFormList[0]?.form_type_name, this.MenuFormList[0]?.button_name)
      this.ActionButtonName = this.MenuFormList[0]?.button_name
    });
  }

  changeNav(nav: string, formtype: any, button_name: string) {
    this.form_type = formtype
    this.ActionButtonName = button_name;
    this.navservice.changeNav(nav);
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('form_type', 'plant_and_machinery');

    this.apiservice.getDynamicForm(params).subscribe(data => {
      this.formFieldList = data.results;
      this.prefieldData = [];
      this.dynamicForm.resetForm()
    });

  }

  getPrefildData() {
    if (this.editItem?.plant_machinery_data) {
      this.editItem.tender_data = this.editItem?.plant_machinery_data
      for (let i = 0; i < this.editItem.tender_data.length; i++) {
        this.editItem.tender_data[i].value_id = ""
      }
      this.editItem.plant_machinery_data = []
    }
    let prefield = {
      "results": this.editItem
    }
    this.prefieldData = prefield
  }

  genaratePlantMechinaryData(jsonData: any) {
    let req = JSON.parse(jsonData)
    let form_datatest = new FormData();
    for (const [key, value] of Object.entries(req.data)) {
      if (value) {
        form_datatest.append(key, value.toString())
      }
    }

    let query = this.commonFunction.getURL(
      {
        organization_id: this.localStorageData.organisation_details[0].id,
        plant_machinery_id: this.editItem?.id ? this.editItem?.id : 'null',
        form_type: this.form_type
      }
    )

    this.savePlantMechinaryData(query, form_datatest)

  }

  savePlantMechinaryData(query: string, data: any) {
    this.apiservice.savePlantMachineryData(query, data).subscribe((data: any) => {
      if (this.editItem?.plant_machinery_data) {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
      } else {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
      }

      this.parentFun.emit();
      this.dynamicForm.resetForm();
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

}
