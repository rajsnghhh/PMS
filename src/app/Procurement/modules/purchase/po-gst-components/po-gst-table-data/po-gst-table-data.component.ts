import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { DataSharingService } from '../../data-sharing.service';

@Component({
  selector: 'app-po-gst-table-data',
  templateUrl: './po-gst-table-data.component.html',
  styleUrls: ['./po-gst-table-data.component.scss']
})
export class PoGstTableDataComponent implements OnInit, OnChanges {
  form: any = {}
  localStorageData: any;
  @Output() parrentAction = new EventEmitter<any>();
  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;

  @Input() prefieldData: any;
  @Input() reload: any
  @Input() scope: any
  @Input() disableEdit: any

  masterlist: any = []
  materialGroupList: any = []
  uomList: any = []
  taxHeads: any = []


  receivedData: any;


  total_Stock_qty: any
  total_unit_rate: any
  total_item_amt: any
  total_discount_amt: any
  total_taxable_amt: any
  total_sgst_amt: any
  total_cgst_amt: any
  total_igst_amt: any
  total_net_amt: any
  total_utgst_amt: any
  total_cess_amt: any

  igstScope = false;

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private procurementApiService: PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private dataService: DataSharingService
  ) {
    this.datasharedservice.getIGSTscope().subscribe(data => {
      if (data) {
        this.igstScope = data.igst

        for(let j=0;j<this.form.items?.length;j++){
          this.taxMaterialsAutoFilled(this.form.items[j].tax_head, j);
        }

      }
    })
    
  }


  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    this.dataService.sharedData$.subscribe(data => {
      this.receivedData = data && data.sendProjectSite;
    });

    this.getmasterList()
    this.getUomList()
    this.getTaxHeadData();
    this.form = {
      po_gst_table_data_valid: false,
      items: [
        {
          organization: this.localStorageData?.organisation_details[0]?.id,
          requested_material_group: '',
          requested_material_sub_group: '',
          item: '',
          MaterialBOQ: [],
          hsn_code: '',
          currentStock: '',
          size_part_no_grade: '',
          quantity: '',
          uom: '',
          weight: 0,
          rate: 0,
          tolerance_percentage: 0,
          item_amount: 0,
          disc_percentage: 0,
          disc_amount: 0,
          taxable_amount: 0,
          tax: '',
          sgst_percentage: 0,
          sgst_amount: 0,
          cgst_percentage: 0,
          cgst_amount: 0,
          igst_percentage: 0,
          igst_amount: 0,
          utgst_percentage: 0,
          utgst_amount: 0,
          cess_percentage: 0,
          cess_amount: 0,
          after_gst_amount: 0
        }
      ]
    }
    this.calculateTotals()

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    if(this.prefieldData.id || this.prefieldData.createThrough ) {
      // Scope for Update & View
      this.form.project  = this.prefieldData.project
      this.form.site = this.prefieldData.site


      this.changeTimeGetTax(); 
    } else if (this.prefieldData.items && this.prefieldData.items.length > 0) {
      // Scope for Through Indent
      if (this.filterByKey('project_details[0].id')) {
        this.form.project = this.prefieldData.items[0].project_details[0].id;
      }

      if (this.filterByKey('site_details[0].id')) {
        this.form.site = this.prefieldData.items[0].site_details[0].id;
      }
      this.changeTimeGetTax();
    }
    
  }

  filterByKey(keyName: any) {
    let filter = this.prefieldData.items.filter((item: { [x: string]: any; }) => item[keyName] == this.prefieldData.items[0][keyName])
    if (filter.length == this.prefieldData.items.length) {
      return true
    } else {
      return false
    }
  }


  generatePrepopulateData(datalist: any) {

    this.form.items = []
    for (let i = 0; i < datalist.length; i++) {

      let params2 = new URLSearchParams();
      params2.set('organization_id', this.localStorageData.organisation_details[0].id);
      params2.set('id', datalist[i].material_details.material_type_details[0].id);
      let temp: any = datalist[i]
      temp.MaterialBOQ = []
      temp.currentStock = ''
      temp.requested_material_group = datalist[i].material_details.material_type_details[0].parent_id
      temp.requested_material_sub_group = datalist[i].material_details.material_type_details[0].id

      if(datalist[i].part_no){
        temp.size_part_no_grade = datalist[i].part_no;
      }else{
        temp.size_part_no_grade = datalist[i].size_part_number;
      }
      this.form.items.push(temp)
      this.showMaterialsCalculatedAmt(i);
      // this.taxMaterialsAutoFilled(datalist[i].material_details?.gst_tax, i);

      let preFilledItemGroupId = datalist[i].material_details.material_type_details[0].parent_id;
      let preFilledSubItemGroupId = datalist[i].material_details.material_type_details[0].id;
      let preFilledItemId = datalist[i].requested_material;

      this.groupTypeChange(preFilledItemGroupId, i)
      this.subTypeChange(preFilledSubItemGroupId, i)

      this.setMaterialMasterData(i,false,this.form.items[i].item)

      // setTimeout(() => {
      //   this.setUOM(datalist[i].requested_material, i)
      //   this.getProcurementMaterialDetails(i)
      // }, 1000);

    }
    // let j = 0;
    // for (let reqItem of this.form.items) {

    //   // let preFilledItemGroupId = reqItem[j].material_details.material_type_details[0].parent_id;
    //   // let preFilledSubItemGroupId = reqItem[j].material_details.material_type_details[0].id;
    //   // let preFilledItemId = reqItem[j].requested_material;

    //   let preFilledItemGroupId = reqItem.requested_material_group;
    //   let preFilledSubItemGroupId = reqItem.requested_material_sub_group;
    //   let preFilledItemId = reqItem.item;

    //   this.groupTypeChange(preFilledItemGroupId, j)
    //   this.subTypeChange(preFilledSubItemGroupId, j)
    //   j++
    // }

  }

  typeChange(typeid: any, i: any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.form.items[i].MaterilSubGroupList = data.results;
    })
  }

  usertypeChange(typeid: any, i: any) {
    // this.form.items[i].item = '';
    // this.form.items[i].requested_material_sub_group = '';

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.form.items[i].MaterilSubGroupList = data.results;
    })
  }

  groupTypeChange(typeid: any, i: any) {
    this.form.items[i].MaterilSubGroupList = '';
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.form.items[i].MaterilSubGroupList = data.results;
    })
  }
  subTypeChange(typeid: any, i: any) {
    // ========= getting materials =========
    let params2 = new URLSearchParams();
    // params2.set('id', typeid);
    params2.set('organization_id', this.localStorageData.organisation_details[0].id);
    params2.set('material_type', typeid);
    params2.set('page', '1');
    params2.set('page_size', '1000');

    this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
      this.form.items[i].MaterilFilterList = data2.results;
      this.setUOM(this.form.items[i].item, i)
    })
    // ========= getting materials =========
  }

  usersubTypeChange(typeid: any, i: any) {
    // this.form.items[i].item = '';
    // ========= getting materials =========
    let params2 = new URLSearchParams();
    // params2.set('id', typeid);
    params2.set('organization_id', this.localStorageData.organisation_details[0].id);
    params2.set('material_type', typeid);
    params2.set('page', '1');
    params2.set('page_size', '1000');

    this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
      this.form.items[i].MaterilFilterList = data2.results;
    })
    // ========= getting materials =========
  }

  getmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.masterlist = data.results
      // this.generateMaterialData()
    })

  }

  getUomList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
    })
  }

  setDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm: any = today.getMonth() + 1; // Months start at 0!
    let dd: any = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return yyyy + '-' + mm + '-' + dd
  }

  setMaterialMasterData(index: number, autoPopulateScope: boolean, event: any) {

    this.getProcurementMaterialDetails(index)

    for (let i = 0; i < this.masterlist.length; i++) {
      if (this.masterlist[i].id == this.form.items[index].item) {
        // this.form.items[index].MaterialmasterData = this.masterlist[i]
        if (autoPopulateScope) {
          this.form.items[index].requested_material_group = this.masterlist[i].material_type_name
          this.setMaterialSubGroup(index)
          this.form.items[index].requested_material_sub_group = this.masterlist[i].material_sub_type_name
          this.setMaterialList(index)
        }
        break;
      }
    }
    this.setUOM(event, index)
  }

  setUOM(event: any, index: any) {

    if (this.form.items[index].MaterilFilterList) {
      const selectedItemId = event;

      const selectedMasterData = this.form.items[index].MaterilFilterList.find((item: any) => item.id === parseInt(selectedItemId));
      if (selectedMasterData) {
        this.unitDropdownData(selectedMasterData, index);
        this.form.items[index].uom = selectedMasterData.unit_of_mesurement;
        this.form.items[index].hsn_code = selectedMasterData.material_hsn_code.hsn_code;
        this.form.items[index].tolerance_percentage = selectedMasterData.material_tolerance;

        this.form.items[index].tax_head = selectedMasterData.gst_tax;
        // (change)="taxMaterialsAutoFilled(form.items[i].tax_head, i)"
        this.taxMaterialsAutoFilled(this.form.items[index].tax_head, index)
        // this.form.items[index].sgst_percentage = selectedMasterData.material_hsn_code.sgst_percentage;
        // this.form.items[index].cgst_percentage = selectedMasterData.material_hsn_code.cgst_percentage;
        // this.form.items[index].igst_percentage = selectedMasterData.material_hsn_code.igst_percentage;

      }
    }

  }

  unitDropdownData(data: any, ind: any) {
    let uomarray: any = []
    uomarray.push(data.unit_of_mesurement);
    if (data.second_unit_of_mesurement.length > 0) {
      data.second_unit_of_mesurement.forEach((element: any) => {
        uomarray.push(Number(element.second_uom));
      });
    }
    this.form.items[ind].uomlistData = this.uomList.filter((item: any) => uomarray.includes(item.id));

  }

  setMaterialSubGroup(index: number) {
    let findText = this.form.items[index].requested_material_group
    let catagoryList = this.masterlist.filter(function (el: any) {
      return el.material_type_name == findText
    });
    let subCatagoryList = [...new Set(catagoryList.map((item: { material_sub_type_name: any; }) => item.material_sub_type_name))];
    this.form.items[index].MaterilSubGroupList = subCatagoryList
  }

  setMaterialList(index: number) {
    let findGroup = this.form.items[index].requested_material_group
    let findSubGroup = this.form.items[index].requested_material_sub_group
    let materiallist = this.masterlist.filter(function (el: any) {
      return el.material_type_name == findGroup && el.material_sub_type_name == findSubGroup
    });
    this.form.items[index].MaterilFilterList = materiallist
  }

  getProcurementMaterialDetails(index: any) {

    let params = new URLSearchParams();
    params.set('id', this.form.items[index].item);

    if (this.receivedData) {
      params.set('project', this.receivedData?.projectId)
    } else {
      params.set('project', this.form.project)
    }

    this.procurementApiService.getProcurementMaterialDetails(params).subscribe(data => {
      this.form.items[index].MaterialBOQ = data.Data
      this.form.items[index].total_received_uptodate = (data.results[0]?.total_recieved_quantity) ? (data.results[0]?.total_recieved_quantity) : 0      
      this.form.items[index].budgeted_qty = (data.results[0]?.total_project_quantity) ? (data.results[0]?.total_project_quantity) : 0
      this.form.items[index].currentStock = (data.results[0]?.total_balance_quantity)? (data.results[0]?.total_balance_quantity) : 0
    })
    this.form.items[index].currentStock = '0'

    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);
    // req.set('site', this.form.items[index].site_id)

    if (this.receivedData) {
      req.set('site', this.receivedData?.siteId)
    } else {
      req.set('site', this.form.site)
    }

    req.set('material', this.form.items[index].item);

    this.procurementApiService.getProcurementInventoryDetails(req).subscribe(data => {

      this.form.items[index].stock_on_site = (data.results[0]?.quantity) ? (data.results[0]?.quantity) : 0

    })
  }

  addMorePOItems() {
    this.form.items.push({
      organization: this.localStorageData?.organisation_details[0]?.id,
      requested_material_group: '',
      requested_material_sub_group: '',
      item: '',
      MaterialBOQ: [],
      hsn_code: '',
      currentStock: '',
      size_part_no_grade: '',
      quantity: '',
      uom: '',
      weight: 0,
      rate: 0,
      tolerance_percentage: 0,
      item_amount: 0,
      disc_percentage: 0,
      disc_amount: 0,
      taxable_amount: 0,
      tax: '',
      sgst_percentage: 0,
      sgst_amount: 0,
      cgst_percentage: 0,
      cgst_amount: 0,
      igst_percentage: 0,
      igst_amount: 0,
      utgst_percentage: 0,
      utgst_amount: 0,
      cess_percentage: 0,
      cess_amount: 0,
      after_gst_amount: 0
    })
  }

  delete(index: any) {
    this.form.items.splice(index, 1);
    this.calculateTotals()
  }

  getTaxHeadData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    params.set('tax_type', 'gst_tax')

    this.procurementApiService.getTaxHeadDetails(params).subscribe(data => {
      this.taxHeads = data.results
    });
  }

  changeTimeGetTax() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    params.set('tax_type', 'gst_tax')

    this.procurementApiService.getTaxHeadDetails(params).subscribe(data => {
      this.taxHeads = data.results;
      if (this.prefieldData.items && this.prefieldData.items.length > 0) {
        this.generatePrepopulateData(this.prefieldData.items)
      }
    });
  }

  showMaterialsCalculatedAmt(index: number): void {
    const item = this.form.items[index];
    item.item_amount = item.quantity * item.rate;
    const discount_amt = (parseFloat(item.item_amount) * parseFloat(item.disc_percentage)) / 100
    item.disc_amount = discount_amt
    item.taxable_amount = item.item_amount - discount_amt

    item.sgst_amount = item.taxable_amount * item.sgst_percentage / 100
    item.cgst_amount = item.taxable_amount * item.cgst_percentage / 100
    item.igst_amount = item.taxable_amount * item.igst_percentage / 100
    item.utgst_amount = item.taxable_amount * item.utgst_percentage / 100
    item.cess_amount = item.taxable_amount * item.cess_percentage / 100
    item.after_gst_amount = (item.taxable_amount + item.sgst_amount + item.cgst_amount + item.igst_amount + item.utgst_amount + item.cess_amount).toFixed(2)
    this.calculateTotals()

  }


  taxMaterialsAutoFilled(tax: any, index: any) {

    var item:any = this.form.items[index];
    const taxItemId = tax;
    const selectedTaxData = this.taxHeads.find((item: any) => item.id === parseInt(taxItemId));
    if (selectedTaxData) {
      item.sgst_percentage = selectedTaxData.sgst_rate;
      item.cgst_percentage = selectedTaxData.cgst_rate;
      item.igst_percentage = selectedTaxData.igst_rate;
      if (this.igstScope == true) {
        item.sgst_percentage = 0;
        item.cgst_percentage = 0;
      } else {
        item.igst_percentage = 0;
      }

      item.utgst_percentage = selectedTaxData.ugst_rate;
      item.cess_percentage = selectedTaxData.cess;
      item.sgst_amount = item.taxable_amount * item.sgst_percentage / 100
      item.cgst_amount = item.taxable_amount * item.cgst_percentage / 100
      item.igst_amount = item.taxable_amount * item.igst_percentage / 100
      item.utgst_amount = item.taxable_amount * item.utgst_percentage / 100
      item.cess_amount = item.taxable_amount * item.cess_percentage / 100


      item.after_gst_amount = (item.taxable_amount + item.sgst_amount + item.cgst_amount + item.igst_amount + item.utgst_amount + item.cess_amount).toFixed(2)

    } else {
      item.sgst_percentage = 0;
      item.cgst_percentage = 0;
      item.igst_percentage = 0;
      item.utgst_percentage = 0;
      item.cess_percentage = 0;
      item.sgst_amount = 0
      item.cgst_amount = 0
      item.igst_amount = 0
      item.utgst_amount = 0
      item.cess_amount = 0
    }
    this.calculateTotals()

  }

  set_discount_pecentage_blanck(index: number) {
    const item = this.form.items[index];
    item.disc_percentage = ''


    item.taxable_amount = item.item_amount - item.disc_amount

    item.sgst_amount = item.taxable_amount * item.sgst_percentage / 100
    item.cgst_amount = item.taxable_amount * item.cgst_percentage / 100
    item.igst_amount = item.taxable_amount * item.igst_percentage / 100
    item.utgst_amount = item.taxable_amount * item.utgst_percentage / 100
    item.cess_amount = item.taxable_amount * item.cess_percentage / 100
    item.after_gst_amount = (item.taxable_amount + item.sgst_amount + item.cgst_amount + item.igst_amount + item.utgst_amount + item.cess_amount).toFixed(2)
    this.calculateTotals()
  }

  calculateTotals() {
    this.total_Stock_qty = 0;
    this.total_unit_rate = 0;
    this.total_item_amt = 0;
    this.total_discount_amt = 0;
    this.total_taxable_amt = 0;
    this.total_sgst_amt = 0;
    this.total_cgst_amt = 0;
    this.total_igst_amt = 0;
    this.total_net_amt = 0;
    this.total_utgst_amt = 0;
    this.total_cess_amt = 0;

    for (let i = 0; i < this.form.items?.length; i++) {
      this.total_Stock_qty += +this.form.items[i].quantity;
      this.total_unit_rate += +this.form.items[i].rate;
      this.total_item_amt += +this.form.items[i].item_amount;
      this.total_discount_amt += +this.form.items[i].disc_amount;
      this.total_taxable_amt += +this.form.items[i].taxable_amount;
      this.total_sgst_amt += +this.form.items[i].sgst_amount;
      this.total_cgst_amt += +this.form.items[i].cgst_amount;
      this.total_igst_amt += +this.form.items[i].igst_amount;
      this.total_net_amt += +this.form.items[i].after_gst_amount;
      this.total_utgst_amt += +this.form.items[i].utgst_amount;
      this.total_cess_amt += +this.form.items[i].cess_amount;
      this.dataService.updateTotalNetAmt(this.total_net_amt);
      this.dataService.updateTotalItemAmt(this.total_taxable_amt);
    }
  }

  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }


  onSubmit(): void {
    this.form.po_gst_table_data_valid = true

    JSON.stringify(this.form)
    this.parrentAction.emit(JSON.stringify(this.form))
  }


}


