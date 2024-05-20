import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GanttEditorComponent, GanttEditorOptions } from 'ng-gantt';
import { DataSharedService } from '../Shared/Services/data-shared.service';
import { APIService } from '../Shared/Services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Success_Messages } from '../Shared/Config/config.const';
import { PmsLoaderService } from '../Shared/Services/pms-loader.service';
declare var window: any;
@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: [
    './gantt.component.scss',
    '../../assets/scss/from-coomon.scss'
  ]
})
export class GanttComponent implements OnInit, OnChanges {
  vShoPlanEndDate: any = '0'
  addedList: any = []
  uomList: any = []
  boqStatus:any = ''  // 'blank' - for new BOQ form entry
                      // ''

  selectedTab = 'budget'
  selectedRowItem : any = {}
  lmpiScope = 'labour'

  boqWithTime = false

  disabledcodeEdit = true
  boqScope = ''
  @Input()
  TenderNumber!: any;
  @Input()
  DisableModify!: any;
  @Input()
  usingIn!: any;
  @Input()
  scope!: any;
  @Input()
  projectId!: any;
  @Input()
  selectedScope!: any;
  disableFrom = false

  serlectedBoq : any

  public editorOptions: any = {};
  public data: any;
  public data2: any;

  vUseSingleCell = '0';
  vShowRes = '0';
  vShowCost = '0';
  vShowUom = '0'
  vShowComp = '0';
  vShowDur = '0';
  vShowStartDate = '0';
  vShowEndDate = '0';
  vShowPlanStartDate = '0';
  vShowPlanEndDate = '0';
  vShowEndWeekDate = '0';
  vShowTaskInfoLink = '0';
  vDebug = 'false';
  vEditable = 'false';
  vUseSort = 'false';
  vLang = 'en';
  delay = 150;
  boqID:any = ''

  @ViewChild('editor', { static: true })
  editor!: GanttEditorComponent;
  @ViewChild('editorTwo', { static: true })
  editorTwo!: GanttEditorComponent;
  localStorageData: any
  offcanvasRigtBoq:any
  offcanvasRightadd: any
  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private loaderservice: PmsLoaderService
  ) {

  }

  ngOnInit() {
    this.setLanguage('en')
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    // this.editorOptions.onChange = this.change.bind(this);
    this.getlatestBOQ()
    this.offcanvasRightadd = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightadd')
    );
    this.offcanvasRigtBoq = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRigtBoq')
    );
    this.getUOMData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.selectedScope == 'planning_work_program') {
      this.boqWithTime = true
    }
  }

  changelmpiscope(scope: any) {
    this.lmpiScope = scope
  }

  addNew() {
    this.boqScope = 'Add'
    this.selectedforedit = ''
    this.itemData = {
      content: '',
      code: '',
      parent: '',
      uom: '',
      quantity: '',
      rate: ''
    }
    this.offcanvasRightadd.show();
  }

  editValue(list: any[], task: any, event: any, cell: any, column: string | number) {
    // tslint:disable-next-line:triple-equals
    // task = task[0]
    const found = list.find(item => item.pID == task.getOriginalID());
    if (!found) {
      return;
    } else {
      found[column] = event ? event.target.value : '';
    }
  }

  change() {

  }

  setLanguage(lang: any) {
    this.editorOptions.vLang = lang;
    this.editor.setOptions(this.editorOptions);
  }

  customLanguage() {
    // this.editorOptions.languages = {
    //   'pt-BR': {
    //     'auto': 'Automático testing'
    //   },
    //   'en': {
    //     'auto': 'Auto testing'
    //   }
    // };
    this.editor.setOptions(this.editorOptions);
  }

  changeObject() {
    this.data.randomNumber = Math.random() * 100;
  }

  changeData() {
    this.data = Object.assign({}, this.data,
      { randomNumber: Math.random() * 100 });
  }

  /**
   * Example on how get the json changed from the jsgantt
   */
  getData() {
    // const changedGantt = this.editor.get();
  }

  clear() {
    // const g = this.editor.getEditor();
    // g.ClearTasks();
    // g.Draw()
  }

  selectedBoqObj:any = {}
  getlatestBOQ() {
    let projectid :any = this.route.snapshot.paramMap.get('projectid')
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    params.set('latest', 'true');
    params.set('project',projectid)

    this.apiservice.getBOQList(params).subscribe(data => {
      if (data.results.id) {
        this.selectedBoqObj = data.results
        this.serlectedBoq = data.results.id
        if(data.results.version == 1 && data.results.status == "pending") {
          this.disabledcodeEdit = false
        } else {
          this.disabledcodeEdit = true
        }
        this.generateBoqDataList()
        this.boqStatus = 'edit'
      } else {
        this.boqStatus = 'blank'
      } 
    });
  }

  generateBoqDataList() {
    let params = new URLSearchParams();
    params.set('boq_id', this.serlectedBoq);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    // params.set('wbs', scope);
    this.apiservice.getBOQWbsList(params).subscribe(data => {
      let temp = data.results
      for (let i = 0; i < temp.length; i++) {
        temp[i]["pID"] = temp[i].id,
        temp[i]["pName"] = temp[i].short_name ? temp[i]?.short_name  + ' ' + temp[i].wbs  : ''  + ' ' + temp[i].wbs
        temp[i]["pStart"] = temp[i].start_date,
        temp[i]["pEnd"] = temp[i].end_date
        temp[i]["quantity"] = temp[i].budgeted_quantity
        temp[i]["rate"] = temp[i].manual_rate
        temp[i]["cost"] = temp[i].manual_cost
        temp[i]["code"] = temp[i].short_name
        temp[i]["uom"] = temp[i].uom_name
        temp[i]["pClass"] = 'gtaskred'
        temp[i]["pLink"] = ''
        temp[i]["pMile"] = '0'
        temp[i]["pRes"] = ''
        temp[i]["pComp"] = ''
        // temp[i]["pGroup"] = temp[i].children.length > 0 ? 1 : 0
        temp[i]["pParent"] = temp[i].parent ? temp[i].parent : 0
        temp[i]["pOpen"] = 1
        temp[i]["pDepend"] = ''
        temp[i]["pCaption"] = ''
        temp[i]["pNotes"] = ''
      }

      temp = this.shortArray(temp)
      this.generateGrid(temp)
      this.addedList = temp

    })
  }

  shortArray(data: any) {
    data = data.sort((a: any, b: any) => a.id - b.id)

    let treeData = this.list_to_tree(data)

    let temp:any = this.toArray(treeData, [])
    for (let i = 0; i < temp.length; i++) {
      temp[i]["pGroup"] = temp[i].children.length > 0 ? 1 : 0
    }
    return this.toArray(treeData, [])
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

  list_to_tree(list: any) {
    const comments = list
    const nest: any = (items: any[], id = null, link = 'parent') =>
      items
        .filter((item: { [x: string]: null; }) => item[link] === id)
        .map((item: { id: null | undefined; }) => ({ ...item, children: nest(items, item.id) }));

    return nest(comments)
  }



  generateGrid(request: any) {
    this.data = request;
    // this.data2 = [{
    //   'pID': 1,
    //   'pName': 'Define Chart API v2',
    //   'pStart': '',
    //   'pEnd': '',
    //   'pClass': 'ggroupblack',
    //   'pLink': '',
    //   'pMile': 0,
    //   'pRes': 'Brian',
    //   'pComp': 0,
    //   'pGroup': 1,
    //   'pParent': 0,
    //   'pOpen': 1,
    //   'pDepend': '',
    //   'pCaption': '',
    //   'pNotes': 'Some Notes text'
    // }];

    const vAdditionalHeaders = {
      boq_code: {
        title: 'BOQ Code'
      },
      boq_no: {
        title: 'BOQ No'
      },
      uom: {
        title: 'UOM'
      },
      quantity: {
        title: 'Quantity'
      },
      rate: {
        title: 'Rate Incl. Indirect Cost' 
      },
      cost: {
        title: 'Cost' 
      },
      amount: {
        title: 'Amount' 
      },
      labour: {
        title: 'Labour' 
      },
      material: {
        title: 'Material' 
      },
      machinery: {
        title: 'Machinery' 
      },
      overheads: {
        title: 'Overheads' 
      },
      
    };


    this.editorOptions = {
      vCaptionType: 'Complete',  // Set to Show Caption : None,Caption,Resource,Duration,Complete,
      vQuarterColWidth: 36,
      vDateTaskDisplayFormat: 'day dd month yyyy', // Shown in tool tip box
      vDayMajorDateDisplayFormat: 'mon yyyy - Week ww', // Set format to display dates in the "Major" header of the "Day" view
      vWeekMinorDateDisplayFormat: 'dd mon', // Set format to display dates in the "Minor" header of the "Week" view
      vLang: this.vLang,
      vUseSingleCell: this.vUseSingleCell,
      vShowRes: parseInt(this.vShowRes, 10),
      vShowCost: parseInt(this.vShowCost, 10),
      vShowComp: parseInt(this.vShowComp, 10),
      vShowDur: parseInt(this.vShowDur, 10),
      vShowStartDate: parseInt(this.vShowStartDate, 10),
      vShowEndDate: parseInt(this.vShowEndDate, 10),
      vShowPlanStartDate: parseInt(this.vShowPlanStartDate, 10),
      vShowPlanEndDate: parseInt(this.vShowPlanEndDate, 10),
      vShowTaskInfoLink: parseInt(this.vShowTaskInfoLink, 10), // Show link in tool tip (0/1)
      // Show/Hide the date for the last day of the week in header for daily view (1/0)
      vShowEndWeekDate: parseInt(this.vShowEndWeekDate, 10),
      vAdditionalHeaders: vAdditionalHeaders,
      vEvents: {
        taskname: () => {
        },
        res: () => {
        },
        dur: () => {
        },
        comp: () => {
        },
        start: () => {
        },
        end: () => {
        },
        planstart: () => {
        },
        planend: () => {
        },
        cost: () => {
        },

      },
      vEventsChange: {
        taskname: this.editValue.bind(this, this.data),
        res: this.editValue.bind(this, this.data),
        dur: this.editValue.bind(this, this.data),
        comp: this.editValue.bind(this, this.data),
        start: this.editValue.bind(this, this.data),
        end: this.editValue.bind(this, this.data),
        planstart: this.editValue.bind(this, this.data),
        planend: this.editValue.bind(this, this.data),
        cost: this.editValue.bind(this, this.data),

      },
      vResources: [
        { id: 0, name: 'Anybody' },
        { id: 1, name: 'Mario' },
        { id: 2, name: 'Henrique' },
        { id: 3, name: 'Pedro' }
      ],
      vEventClickRow: (e:any) => {
        this.editboq(e.getAllData().pDataObject.id)
      },
      vTooltipDelay: this.delay,
      vDebug: this.vDebug === 'true',
      vEditable: this.vEditable === 'true',
      vUseSort: this.vUseSort === 'true',
      vFormatArr: ['Day', 'Week', 'Month', 'Quarter'],
      vFormat: 'day'
    };
    this.editor.setOptions(this.editorOptions);
  }

  itemData: any = {
    content: '',
    code: '',
    start_date : '',
    end_date: '',
    parent: '',
    uom: '',
    quantity: '',
    rate: ''
  }
  selectedforedit = ''
  editboq(editID:any) {
    this.selectedRowItem = {}
    this.offcanvasRightadd.hide();
    if(this.selectedBoqObj.status == 'pending') {
      this.boqScope = 'Edit'
      this.disabledcodeEdit = false
    } else {
      this.boqScope = 'View'
      this.disabledcodeEdit = true
    }
    this.selectedforedit = editID
    
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', editID);
    this.apiservice.getBOQWbsList(params).subscribe(data => {
      this.itemData = {
        content: data.wbs,
        code: data.short_name,
        parent: data.parent,
        uom: data.uom,
        quantity: data.budgeted_quantity,
        rate: data.manual_rate,
        start_date: data.start_date,
        end_date: data.end_date
      }
      this.selectedRowItem = data
      this.offcanvasRightadd.show();
    })
  }

  addItem() {
    let projectid :any = this.route.snapshot.paramMap.get('projectid')
    let request = {
      "boq": this.serlectedBoq,
      "wbs": this.itemData.content,
      "start_date": this.itemData.start_date,
      "end_date":this.itemData.end_date,
      "short_name": this.itemData.code,
      "parent": this.itemData.parent,
      "uom": this.itemData.uom,
      "project": projectid,
      "manual_rate":this.itemData.rate? this.itemData.rate : 0,
      "budgeted_quantity": this.itemData.quantity ? this.itemData.quantity : 0,
      "organization": this.localStorageData.organisation_details[0].id,
      "tender": ''
    }
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    if(this.boqScope == 'Edit') {
      params.set('method', 'edit');
      params.set('id', this.selectedforedit);
      this.apiservice.editBOQWbsList(params, request).subscribe(data => {
        this.offcanvasRightadd.hide();
        this.generateBoqDataList()
      })
    } else {
      this.apiservice.addBOQWbsList(params, request).subscribe(data => {
        this.offcanvasRightadd.hide();
        this.generateBoqDataList()
      })
    }
  }

  deleteItem() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('method', 'delete');
    params.set('id', this.selectedforedit);
    this.apiservice.editBOQWbsList(params, '').subscribe(data => {
      this.offcanvasRightadd.hide();
      this.generateBoqDataList()
    })
  }


  addNewBOQ() {
    this.offcanvasRigtBoq.show()
  }
  form :any = {}

  amendentBOQ() {
    this.form.name = this.selectedBoqObj.name
    this.offcanvasRigtBoq.show()
  }

  onboqSubmit() {
    if(this.selectedBoqObj.id) {
      this.loaderservice.showWithMessage('Replicateing BOQ From BOQ : '+ this.selectedBoqObj.name)
    } else {
      this.loaderservice.showWithMessage('Replicateing BOQ From Tender!')
    }
    let projectid :any = this.route.snapshot.paramMap.get('projectid')
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    if(this.selectedBoqObj.id) {
      params.set('replicate_boq', this.selectedBoqObj.id);
    } else {
      params.set('replicate_tender', this.TenderNumber);
      params.set('source', 'executive_summery');
    }
    
    this.form.organization = this.localStorageData.organisation_details[0].id
    this.form.project = projectid
    
    this.apiservice.addBOQ(params,this.form).subscribe(data => {
      this.offcanvasRigtBoq.hide()
      this.toastrService.success(Success_Messages.SuccessAdd, '', {
        timeOut: 2000,
      });
      this.getlatestBOQ()
      this.loaderservice.hide()
    })
  }

  getUOMData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
    })
  }
}
