import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PmsDocPreviewService } from '../Shared/Services/pms-doc-preview.service';
import { environment } from 'src/environments/environment.prod';
import { ActivatedRoute, Router } from '@angular/router';
declare var window: any;
@Component({
  selector: 'app-executive-summary',
  templateUrl: './executive-summary.component.html',
  styleUrls: ['./executive-summary.component.scss',
    '../../assets/scss/scrollableTable.scss']
})

export class ExecutiveSummaryComponent implements OnInit, OnChanges {
  @ViewChild('customlist', { read: ElementRef })
  public customlist!: ElementRef<any>;

  @ViewChild('customscroll', { read: ElementRef })
  public customscroll!: ElementRef<any>;

  @ViewChild('vendorscroll', { read: ElementRef })
  public vendorscroll!: ElementRef<any>;

  @Output() getWBSID = new EventEmitter<any>();
  
  rowClicked: any
  menuName: any = '';
  bindData: any = {};
  bindTableData: any = {};
  selectedTender: any;
  env = environment
  WbsList: any = [];
  localStorageData: any;
  keyFeaturesHeader: any = [];
  fullExecutiveSummeryData: any = [];
  TableData: any = [];
  timeComplianceList: any = [];
  focusId: any = ''
  offcanvasWBS: any

  @Input()
  TenderNumber!: any;

  @Input()
  usingIn!: any;

  @Input()
  selectedScope!: any;
  projectId: any;

  selectedWBSITEM = ''

  wbsScope = ''
  selectedID = ''

  @Input()
  DisableModify!: any;

  @Input() chainageData: any;
  stripData: any = []
  openTab = '';
  isDisabled: boolean = false;
  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private docPreview: PmsDocPreviewService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getrouteSnap();
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    // this.selectedTender = this.datasharedservice.getLocalData('tender_id');
    this.selectedTender = this.TenderNumber;
    this.projectId = this.route.snapshot.paramMap.get('projectid');
    // this.getExecutiveSummary();
    // this.getData();
    this.getKeyFeatures();
    this.offcanvasWBS = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasAddWBSITEMS')
    );

  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.getPlanningRiskDetails()
    this.stripData = this.chainageData;
  }

  changeTab(tabValue: any) {
    this.activeCurrentScope = tabValue.parentScope
    this.activeGroupID = tabValue.id
    let data = {
      activeCurrentScope : this.activeCurrentScope,
      activeGroupID : this.activeGroupID
    }
    this.getWBSID.emit(JSON.stringify(data))
    this.fetchScopeData()
  }

  importData(val: any) {
    this.menuName = val;
  }


  activeCurrentScope = ''
  activeGroupID = ''
  getexicutiveSummaryParentMemu() {
    let params = new URLSearchParams();
    params.set('tender_id', this.selectedTender);
    params.set('is_parent_null', 'true');
    this.apiservice.getWbsList(params).subscribe(data => {

      let temp = []
      let index = this.mainnavPosition.findIndex((x: { name: string; }) => x.name == "Executive Summary");
      if (index > -1) {
        this.mainnavPosition.splice(index, 1);
      }

      for (let i = 0; i < data.results.length; i++) {
        temp.push({
          parentScope: "Executive Summary",
          name: data.results[i].wbs_name,
          id: data.results[i].id,
          parentData: data.results[i]
        })
      }
      if (this.usingIn == 'Planning' && this.selectedScope == 'planning_risk_evaluation') {
        temp = []
      }
      this.mainnavPosition = [...temp, ...this.mainnavPosition]
      if (this.activeGroupID == '') {
        this.activeGroupID = this.mainnavPosition[0].id
      }

      if (this.activeCurrentScope == '') {
        this.activeCurrentScope = this.mainnavPosition[0].parentScope
      }
      let dat = {
        activeCurrentScope : this.activeCurrentScope,
        activeGroupID : this.activeGroupID
      }
      this.getWBSID.emit(JSON.stringify(dat))
      this.fetchScopeData()
    })

  }

  fetchScopeData() {
    if (this.activeCurrentScope == 'Executive Summary') {
      let parentData = this.mainnavPosition.filter((item: { id: string; parentScope: string; }) => item.id == this.activeGroupID && item.parentScope == 'Executive Summary')
      this.getData(parentData[0].parentData)
      this.getExecutiveSummary()
      this.TableData = []
    } else {
      // this.getExecutiveSummary();
      this.getTableData(this.fullExecutiveSummeryData);
    }
  }


  selectedList: any = []
  getData(parentData: any) {

    let params = new URLSearchParams();
    params.set('tender_id', this.selectedTender);
    params.set('parent_id', this.activeGroupID);
    params.set('all', 'true');
    this.apiservice.getWbsList(params).subscribe(data => {

      let request = data.results
      request.push(parentData)
      this.selectedList = request
      let parentTree = this.list_to_tree(request)
      for (var i = 0; i < parentTree.length; i++) {
        parentTree[i].children = this.toArray(parentTree[i].children, [], 0)
      }
      this.WbsList = parentTree;
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
  toArray(nodes: any[], arr: any[], lable: number) {
    if (!nodes) {
      return [];
    }
    if (!arr) {
      arr = [];
    }
    for (var i = 0; i < nodes.length; i++) {

      nodes[i].childLable = lable
      arr.push(nodes[i]);
      this.toArray(nodes[i].children, arr, lable + 1);
    }
    return arr;
  }

  assignSpace(indentNo: number) {
    return indentNo * 15 + 'px';
  }

  assignSpace2(indentNo: number) {
    return 'calc( 100% - ' + (indentNo * 15) + 'px )';
  }

  changeInput(event: any, wbs_id: any, wbskey_id: any, form_id: any) {



    if (this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Rate Incl. Indirect Cost').id + wbskey_id]) {
      for (let str of this.stripData) {
        this.bindData['customInput' + str.id + wbskey_id + 'A'] = Number(this.bindData['customInput' + str.id + wbskey_id + 'Q']) * this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Rate Incl. Indirect Cost').id + wbskey_id];
      }
    }

    if (this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Total Quantity').id + wbskey_id] && this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Rate Incl. Indirect Cost').id + wbskey_id]) {
      this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Total Amount').id + wbskey_id] = (this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Total Quantity').id + wbskey_id] * this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Rate Incl. Indirect Cost').id + wbskey_id]).toFixed(3);
      this.totalQuantityEntry(wbskey_id)
      this.totalAmountEntry(wbskey_id)
    }

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('hideLoader', 'true');

    let request = {
      "tender_id": this.selectedTender,
      "wbs_id": wbskey_id,
      "wbskey_id": wbskey_id,
      "form_id": form_id,
      "value": event.target.value,
    }
    this.apiservice.editExecutiveSummaryList(params, request).subscribe(data => {
      this.getExecutiveSummary();
    })
  }


  changeQuantityInput(event: any, wbsId: any, formId: any) {
    this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Total Quantity').id + wbsId] = 0;

    for (let str of this.stripData) {
      this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Total Quantity').id + wbsId] =
        Number(this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Total Quantity').id + wbsId] ? this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Total Quantity').id + wbsId] : '') + Number(this.bindData['customInput' + str.id + wbsId + 'Q'] ? this.bindData['customInput' + str.id + wbsId + 'Q'] : '');

      if (this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Rate Incl. Indirect Cost').id + wbsId]) {
        this.bindData['customInput' + str.id + wbsId + 'A'] = Number(this.bindData['customInput' + str.id + wbsId + 'Q']) * this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Rate Incl. Indirect Cost').id + wbsId];
      }
    }

    if (this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Total Quantity').id + wbsId] && this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Rate Incl. Indirect Cost').id + wbsId]) {
      this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Total Amount').id + wbsId] = (this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Total Quantity').id + wbsId] * this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Rate Incl. Indirect Cost').id + wbsId]).toFixed(3);
      this.totalQuantityEntry(wbsId)
      this.totalAmountEntry(wbsId)
    }

    let request = {
      "tender_id": this.selectedTender,
      "wbs_id": wbsId,
      "form_id": formId,
      "value": event.target.value
    }
    this.apiservice.editChainageExecutiveSummaryList(request).subscribe(data => {
      this.getChainageData();
    })
  }


  getChainageData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('hideLoader', 'true');
    params.set('tender_id', this.selectedTender);

    this.apiservice.getChainageExecutiveSummaryList(params).subscribe(data => {
      for (let prev of data) {
        this.bindData['customInput' + prev.form + prev.wbs + 'Q'] = prev.value;

        if (this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Rate Incl. Indirect Cost').id + prev.wbs]) {
          this.bindData['customInput' + prev.form + prev.wbs + 'A'] = Number(this.bindData['customInput' + prev.form + prev.wbs + 'Q']) * this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Rate Incl. Indirect Cost').id + prev.wbs];
        }
      }
    })
  }





  totalQuantityEntry(wbskey_id: any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('hideLoader', 'true');

    let request = {
      "tender_id": this.selectedTender,
      "wbs_id": wbskey_id,
      "wbskey_id": wbskey_id,
      "form_id": this.keyFeaturesHeader.find((data: any) => data.form_label == 'Total Quantity').id,
      "value": this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Total Quantity').id + wbskey_id]
    }
    this.apiservice.editExecutiveSummaryList(params, request).subscribe(data => {
      this.getExecutiveSummary();
    })
  }


  totalAmountEntry(wbskey_id: any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('hideLoader', 'true');

    let request = {
      "tender_id": this.selectedTender,
      "wbs_id": wbskey_id,
      "wbskey_id": wbskey_id,
      "form_id": this.keyFeaturesHeader.find((data: any) => data.form_label == 'Total Amount').id,
      "value": this.bindData['customInput' + this.keyFeaturesHeader.find((data: any) => data.form_label == 'Total Amount').id + wbskey_id]
    }
    this.apiservice.editExecutiveSummaryList(params, request).subscribe(data => {
      this.getExecutiveSummary();
    })
  }

  ReloadExecutiveSummary() {
    this.selectedID = ''
    this.ngOnInit()
  }

  closeAddCanvas() {
    this.wbsScope = ''
    this.offcanvasWBS.hide();
    this.ngOnInit()
  }

  modifyID(id: any, selected: any) {
    this.selectedWBSITEM = selected
    this.wbsScope = 'Edit'
    this.selectedID = id
    this.offcanvasWBS.show()
  }

  setItemScope(selected: any) {
    this.wbsScope = 'Add'
    this.selectedID = ''
    this.selectedWBSITEM = selected
  }

  focusrow(focusId: any) {
    this.focusId = focusId
  }

  getExecutiveSummary() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('hideLoader', 'true');
    params.set('tender_id', this.selectedTender);
    params.set('wbs__parent_id', this.activeGroupID);


    // this.apiservice.getExecutiveSummaryList(params).subscribe(data => {
    //   for (let prev of data) {
    //     this.bindData['customInput' + prev.form + prev.wbs_id] = prev.value;
    //   }
    // })

    this.apiservice.getExecutiveSummaryListNew(params).subscribe(data => {
      for (let prev of data) {
        this.bindData['customInput' + prev.form + prev.wbs] = prev.value;
      }

      setTimeout(() =>{
        this.getChainageData();
      }, 500);

    })


  }

  mainnavPosition: any = []

  getKeyFeatures() {
    this.mainnavPosition = []
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('form_type', 'tender_executive_summary')
    this.apiservice.getDynamicForm(params).subscribe(data => {
      if (this.usingIn == 'Planning' && this.selectedScope == 'planning_executive_summary') {
        data.results = data.results.filter((item: { name: string; }) => item.name == 'Executive Summary')
      }

      if (this.usingIn == 'Planning' && this.selectedScope == 'planning_risk_evaluation') {
        data.results = data.results.filter((item: { name: string; }) => item.name == 'Risk Details')
      }

      this.keyFeaturesHeader = data.results[0].form_fields;
      this.fullExecutiveSummeryData = data.results;
      for (let i = 0; i < data.results.length; i++) {
        this.mainnavPosition.push({
          parentScope: data.results[i].name,
          name: data.results[i].name,
          id: data.results[i].id
        })
      }
      this.getexicutiveSummaryParentMemu()
    })
  }

  getPlanningRiskDetails() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('tender_id', this.selectedTender);

    if (this.projectId != null) {
      params.set('project_id', this.projectId);
    }

    this.apiservice.getRiskDetails(params, this.usingIn).subscribe(data => {
      for (let prev of data) {
        this.addRowOnGetRisk(prev)
      }
      // this.fullExecutiveSummeryData.push(data)
    })
  }

  getOpportunityDetails() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('tender_id', this.selectedTender);
    this.apiservice.getOpportunityDetails(params, this.usingIn).subscribe(data => {
      for (let prev of data) {
        this.addRowOnGetOpportunty(prev)
      }
    })
  }

  getComplianceDetails() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('tender_id', this.selectedTender);
    this.apiservice.getComplianceDetails(params, this.usingIn).subscribe(data => {
      for (let prev of data) {
        this.addRowOnGetComplience(prev)
      }
    })
  }

  setRowSpan(length: any, index: any) {
    if (index == 0) {
      return length
    } else {
      return ''
    }
  }


  getTableData(dataArray: any) {
    this.TableData = []
    for (let i = 0; i < dataArray.length; i++) {
      this.TableData.push(dataArray[i])
    }
    for (let i = 0; i < this.TableData.length; i++) {
      this.TableData[i].values = [];
      this.TableData[i].validationID = [];
      this.TableData[i].newRow = false;

    }
    // this.getSummaryList();
    this.getPlanningRiskDetails()
    this.getOpportunityDetails()
    this.getComplianceDetails()
  }

  changeInputData(event: any, headerId: any, tableId: any, indexData: any, complianceId: any, tableName: any) {
    let request: any = {
      "tender_id": this.selectedTender,
      "risk_details_id": complianceId,
      "opportunity_details_id": complianceId,
      "compliance_id": complianceId,
      "form_id": headerId,
      "value": event.target.value,
      "table_id": tableId
    }
    var form_data = new FormData();
    for (var key in request) {
      form_data.append(key, request[key]);
    }
    this.apiservice.editSummaryList(form_data, tableName, this.usingIn).subscribe(data => {
      if (!this.TableData[indexData].validationID.includes(data.id)) {
        this.TableData[indexData].newRow = false;
        this.bindTableData['customInput' + '_' + tableId + '_' + headerId + '_'] = ''
        if (data.compliance_obj) {
          this.bindTableData['customInput' + '_' + tableId + '_' + headerId + '_' + data.id] = data.compliance_obj[0].value;
        }
        if (data.risk_details_obj) {
          this.bindTableData['customInput' + '_' + tableId + '_' + headerId + '_' + data.id] = data.risk_details_obj[0].value;
        }
        if (data.opportunity_details_obj) {
          this.bindTableData['customInput' + '_' + tableId + '_' + headerId + '_' + data.id] = data.opportunity_details_obj[0].value;
        }
        this.TableData[indexData].validationID[this.TableData[indexData].validationID.length - 1] = data.id;
      }
    })
  }

  deleteRow(index: any, delid: any) {
    this.TableData[index].values.splice(delid, 1);
    this.TableData[index].validationID.splice(delid, 1);

  }
  addRow(index: any, data: any) {
    if (this.TableData[index].newRow == false) {
      this.TableData[index].values.push(data);
      this.TableData[index].newRow = true;
      this.TableData[index].validationID.push('')
    }

  }
  addRowOnGetRisk(inputdata: any) {
    for (let i = 0; i < inputdata.risk_details_obj.length; i++) {
      let data = inputdata.risk_details_obj[i]
      this.bindTableData['customInput' + '_' + data.table_id + '_' + data.form_id + '_' + (data.risk_details_id)] = data.value;
    }
    let tableindex = this.getTableIndex(inputdata.risk_details_obj[0].table_id)

    if (tableindex >= 0) {
      let pushData = this.TableData[tableindex].form_fields
      this.TableData[tableindex].values.push(pushData)
      this.TableData[tableindex].newRow = false;
      this.TableData[tableindex].validationID.push(inputdata.id)
    }
  }

  addRowOnGetOpportunty(inputdata: any) {
    for (let i = 0; i < inputdata.opportunity_details_obj.length; i++) {
      let data = inputdata.opportunity_details_obj[i]
      this.bindTableData['customInput' + '_' + data.table_id + '_' + data.form_id + '_' + (data.opportunity_details_id)] = data.value;
    }
    let tableindex = this.getTableIndex(inputdata.opportunity_details_obj[0].table_id)
    if (tableindex >= 0) {
      let pushData = this.TableData[tableindex].form_fields
      this.TableData[tableindex].values.push(pushData)
      this.TableData[tableindex].newRow = false;
      this.TableData[tableindex].validationID.push(inputdata.id)
    }
  }

  addRowOnGetComplience(inputdata: any) {
    for (let i = 0; i < inputdata.compliance_obj.length; i++) {
      let data = inputdata.compliance_obj[i]
      this.bindTableData['customInput' + '_' + data.table_id + '_' + data.form_id + '_' + (data.compliances_id)] = data.value;
    }
    let tableindex = this.getTableIndex(inputdata.compliance_obj[0].table_id)
    if (tableindex >= 0) {
      let pushData = this.TableData[tableindex].form_fields
      this.TableData[tableindex].values.push(pushData)
      this.TableData[tableindex].newRow = false;
      this.TableData[tableindex].validationID.push(inputdata.id)
    }
  }

  addRowOnGet(inputdata: any) {

    for (let i = 0; i < inputdata.compliance_obj.length; i++) {
      let data = inputdata.compliance_obj[i]
      this.bindTableData['customInput' + '_' + data.table_id + '_' + data.form_id + '_' + (data.compliances_id)] = data.value;
    }
    let tableindex = this.getTableIndex(inputdata.compliance_obj[0].table_id)
    if (tableindex >= 0) {
      let pushData = this.TableData[tableindex].form_fields
      this.TableData[tableindex].values.push(pushData)
      this.TableData[tableindex].newRow = false;
      this.TableData[tableindex].validationID.push(inputdata.id)
    }
  }

  getTableIndex(tableid: any) {
    for (let i = 0; i < this.TableData.length; i++) {
      if (this.TableData[i].id == tableid) {
        return i;
      }
    }
    return -1

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

  changeFileData(event: any, headerId: any, tableId: any, indexData: any, complianceId: any, tableName: any, allowdtypes: any) {
    if (allowdtypes.split('.').join("").split(',').includes(event.target.files[0].name.split('.').pop().toLowerCase())) {
      let request: any = {
        "tender_id": this.selectedTender,
        "risk_details_id": complianceId,
        "opportunity_details_id": complianceId,
        "compliance_id": complianceId,
        "form_id": headerId,
        "table_id": tableId
      }
      var form_data = new FormData();
      for (var key in request) {
        form_data.append(key, request[key]);
      }
      form_data.append('value', event.target.files[0]);
      this.apiservice.editSummaryList(form_data, tableName, this.usingIn).subscribe(data => {
        if (!this.TableData[indexData].validationID.includes(data.id)) {
          this.toastrService.success("File added Successfully", '', {
            timeOut: 2000,
          });
          this.TableData[indexData].newRow = false;
          this.bindTableData['customInput' + '_' + tableId + '_' + headerId + '_'] = ''
          if (data.compliance_obj) {
            this.bindTableData['customInput' + '_' + tableId + '_' + headerId + '_' + data.id] = data.compliance_obj[0].value;
          }
          if (data.risk_details_obj) {
            this.bindTableData['customInput' + '_' + tableId + '_' + headerId + '_' + data.id] = data.risk_details_obj[0].value;
          }
          if (data.opportunity_details_obj) {
            this.bindTableData['customInput' + '_' + tableId + '_' + headerId + '_' + data.id] = data.opportunity_details_obj[0].value;
          }
          this.TableData[indexData].validationID[this.TableData[indexData].validationID.length - 1] = data.id;
        }
      })
    } else {
      this.toastrService.error("Please Choose a valid File", '', {
        timeOut: 2000,
      });
    }
  }

  filterFileNameOnly(fullname: any) {
    return fullname.replace(/\ /g, "").split('/').pop()
  }

  previewDoc(data: any) {
    this.docPreview.showDoc(this.env.API_URL + 'media/tender/document/' + data, {})
  }


  updateWBS(boqData: any) {
    let params = new URLSearchParams();
    params.set('method', 'edit');
    params.set('wbs_id', boqData.id);

    let request: any = {
      "organization": this.localStorageData.organisation_details[0].id,
      "wbs_name": boqData.wbs_name,
      "category": boqData.category,
      "parent_id": boqData.parent_id,
      "uom_id": boqData.uom,
      "by_order": boqData.by_order,
      "boq_code": boqData.boq_code,
      "boq_no": boqData.boq_no
    }
    if (this.TenderNumber) {
      request.tender_id = this.TenderNumber;
    } else {
      params.set('is_master', '1');
    }

    this.apiservice.editWBSData(params, request).subscribe(data => {
      // this.getData();
    })
  }

  // stripData = [
  //   {
  //     range : '237+860 to 243+000'
  //   },
  //   {
  //     range : '243+000 to 253+000'
  //   },
  //   {
  //     range : '253+000 to 263+000'
  //   },
  //   {
  //     range : '263+000 to 273+000'
  //   },
  //   {
  //     range : '273+000 to 283+000'
  //   }
  // ]

  next() {
    this.customlist.nativeElement.scrollTo({ left: (this.customlist.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }

  previous() {
    this.customlist.nativeElement.scrollTo({ left: (this.customlist.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }

  nextbtn() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }

  previousbtn() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }
  vennextbtn() {
    this.vendorscroll.nativeElement.scrollTo({ left: (this.vendorscroll.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }

  venpreviousbtn() {
    this.vendorscroll.nativeElement.scrollTo({ left: (this.vendorscroll.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }

  getrouteSnap() {
    let activeLink = this.router.url.split('/')
    if (activeLink.includes('edit')) {
      this.openTab = 'edit'
      this.isDisabled = false;
    } else {
      this.openTab = 'view';
      this.isDisabled = true;
    }
  }

}
