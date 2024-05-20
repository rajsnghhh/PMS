import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-wo-gst-table-card',
  templateUrl: './wo-gst-table-card.component.html',
  styleUrls: ['./wo-gst-table-card.component.scss']
})
export class WoGstTableCardComponent {
  form: any = {}
  localStorageData: any;
  activeTab: string = 'tab1';
  event: any;

  terms_conditions_of_wo: Array<any> = [];
  masterlist: any = []
  uomList: any = []
  PnEmasterlist:any=[]
  groupTaskList: any = []
  labourMasterlist: any = []
  taxHeads: any = []

  @Output() parrentAction = new EventEmitter<any>();

  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;


  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
  ) { }

  ngOnInit() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.form = {
      wo_gst_table_data_valid: false,
      place_of_supply: false,
      extra_notes: '',

      details: [
        {
          organization: this.localStorageData?.organisation_details[0]?.id,
          task: '',
          work_detail: '',
          quantity: '',
          uom: '',
          rate: '',
          discount: 0,
          discount_pecentage: 0,
          amount: '',
          taxable_amount: '',
          tax: '',
          sgst_pecentage: 0,
          sgst_amount: 0,
          cgst_pecentage: 0,
          cgst_amount: 0,
          igst_pecentage: 0,
          igst_amount: 0,
          net_amount: 0
        }
      ],
      terms_conditions: [{
        title: '',
        description: '',
        organization: this.localStorageData?.organisation_details[0]?.id
      }],
      requirements: [
        {
          requirement: '',
          organization: this.localStorageData?.organisation_details[0]?.id
        }
      ],
      materials: [
        {
          organization: this.localStorageData?.organisation_details[0]?.id,
          requested_material_group: '',
          requested_material_sub_group: '',
          material: '',
          quantity: 0,
          unit: '',
          days: '',
          rate: 0,
          taxable_amount: '',
          tax: '',
          sgst_pecentage: '',
          sgst_amount: '',
          cgst_pecentage: '',
          cgst_amount: '',
          igst_pecentage: '',
          igst_amount: '',
          net_amount: '',
          remarks: '',
          charge_type: '',
        }
      ],
      labors: [
        {
          category: '',
          quantity: 0,
          rate: 0,
          amount: 0,
          taxable_amount: '',
          tax: '',
          sgst_pecentage: 0,
          sgst_amount: '',
          cgst_pecentage: 0,
          cgst_amount: '',
          igst_pecentage: 0,
          igst_amount: '',
          net_amount: '',
          adv_less: 'add',
          organization: this.localStorageData?.organisation_details[0]?.id
        }
      ],
      hire_contracts: [
        {
          hire: "",
          contract_code: "",
          from_date: (new Date()).toISOString().substring(0, 10),
          to_date: (new Date()).toISOString().substring(0, 10),
          machine_category: "",
          machine: '',
          required_avg: 0,
          required_avg_type: "",
          charges_base: "",
          rate: 0,
          per: "",
          min_working_days: 0,
          allow_bd_days: 0,
          allow_idle_days: 0,
          operator_charges: "No",
          operator_charges_amount: 0,
          helper_charges: "No",
          helper_charges_amount: 0,
          fuel_included: "No",
          fuel_included_amount: 0,
          maintenance_charges: "No",
          maintenance_charges_amount: 0,
          remark: "",
          organization: this.localStorageData?.organisation_details[0]?.id
        }
      ]
    };
    this.getTermsConditionsOfWO();
    this.getmasterList();
    this.getUomList();
    this.getGroupTaskList();
    this.getLabourmasterList();
    this.getTaxHeadData();
    this.getPnEmasterList();
  }

  openTab(event: Event, tabName: string) {
    this.activeTab = tabName;
    var i: number;
    var tabContent: HTMLCollectionOf<HTMLElement>;

    // Hide all tab content
    tabContent = document.getElementsByClassName("tab-content") as HTMLCollectionOf<HTMLElement>;
    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = "none";
    }

    // Remove active class from all tabs
    var tabs = document.getElementsByClassName("tab");
    for (i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove("active");
    }

    // Show the selected tab content and add active class to the clicked tab
    var selectedTabContent = document.getElementById(tabName) as HTMLElement | null;
    if (selectedTabContent) {
      selectedTabContent.style.display = "block";
    }

    (event?.currentTarget as HTMLDivElement)?.classList.add("active");
  }

  getTermsConditionsOfWO() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    params.set('slug', 'wo');
    this.procurementAPIService.getTermsFromMaster(params).subscribe(data => {
      this.terms_conditions_of_wo = data.results[0].terms_and_conditions_child

      this.form.terms_conditions = this.terms_conditions_of_wo.map(item => ({
        organization: item.organization,
        title: item.key,
        description: item.description,
        order_id: item.order_id,
        remarks: ''
      }));

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

  getPnEmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getPlantMachineryList(params).subscribe(data => {
      this.PnEmasterlist = data.results
    })
  }

  getmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.masterlist = data.results
    })

    // let preFilledItemGroupId = "";
    // let preFilledSubItemGroupId = "";
    // let preFilledItemId = "";

    // let j = 0;
    // for(let reqItem of this.form.items){
    //   this.typeChange(preFilledItemGroupId, j)
    //   this.subTypeChange(preFilledSubItemGroupId, j)
    //   j++
    // }
  }

  typeChange(typeid: any, i: any) {
    let params = new URLSearchParams();
    // params.set('id', typeid);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.form.materials[i].MaterilSubGroupList = data.results;
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
      this.form.materials[i].MaterilFilterList = data2.results;
    })
  }

  setUOM(event: any, index: any) {
    const selectedItemId = event.target.value;

    const selectedMasterData = this.form.materials[index].MaterilFilterList.find((item: any) => item.id === parseInt(selectedItemId));
    if (selectedMasterData) {
      this.form.materials[index].unit = selectedMasterData.unit_of_mesurement;
      this.form.materials[index].sgst_pecentage = selectedMasterData.material_hsn_code.sgst_percentage;
      this.form.materials[index].cgst_pecentage = selectedMasterData.material_hsn_code.cgst_percentage;
      this.form.materials[index].igst_pecentage = selectedMasterData.material_hsn_code.igst_percentage;

    }

  }


  getGroupTaskList() {
    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);

    this.procurementAPIService.getProcurementGroupTaskDetails(req).subscribe(data => {
      this.groupTaskList = data.results;
    })
  }


  getLabourmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getLabourMasterList(params).subscribe(data => {
      this.labourMasterlist = data.results

    })
  }

  getTaxHeadData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementAPIService.getTaxHeadDetails(params).subscribe(data => {
      this.taxHeads = data.results
    });
  }

  addWorkDetails() {
    this.form.details.push({
      organization: this.localStorageData?.organisation_details[0]?.id,
      task: '',
      work_detail: '',
      quantity: '',
      uom: '',
      rate: '',
      discount: 0,
      discount_pecentage: 0,
      amount: '',
      taxable_amount: '',
      tax: '',
      sgst_pecentage: 0,
      sgst_amount: 0,
      cgst_pecentage: 0,
      cgst_amount: 0,
      igst_pecentage: 0,
      igst_amount: 0,
      net_amount: 0
    });
  }

  deleteWorkDetails(index: any) {
    this.form.details.splice(index, 1);
  }

  addRequirements() {
    this.form.requirements.push({
      requirement: '',
      organization: this.localStorageData?.organisation_details[0]?.id
    });
  }

  deleteRequirements(index: any) {
    this.form.requirements.splice(index, 1);
  }

  addMoreMaterial() {
    this.form.materials.push({
      organization: this.localStorageData?.organisation_details[0]?.id,
      requested_material_group: '',
      requested_material_sub_group: '',
      material: '',
      quantity: 0,
      discount: 0,
      discount_pecentage: 0,
      amount: '',
      unit: '',
      days: '',
      rate: 0,
      taxable_amount: '',
      tax: '',
      sgst_pecentage: '',
      sgst_amount: '',
      cgst_pecentage: '',
      cgst_amount: '',
      igst_pecentage: '',
      igst_amount: '',
      net_amount: '',
      remarks: '',
      charge_type: '',
    })
  }

  deleteMaterials(index: any) {
    this.form.materials.splice(index, 1);
  }


  addMoreLabour() {
    this.form.labors.push({
      category: '',
      quantity: 0,
      rate: 0,
      amount: 0,
      taxable_amount: '',
      tax: '',
      sgst_pecentage: 0,
      sgst_amount: '',
      cgst_pecentage: 0,
      cgst_amount: '',
      igst_pecentage: 0,
      igst_amount: '',
      net_amount: '',
      adv_less: 'add',
      organization: this.localStorageData?.organisation_details[0]?.id
    })
  }
  deleteLabours(index: any) {
    this.form.labors.splice(index, 1);
  }

  addMoreHireContract() {
    this.form.hire_contracts.push({
      hire: "",
      contract_code: "",
      from_date: (new Date()).toISOString().substring(0, 10),
      to_date: (new Date()).toISOString().substring(0, 10),
      machine_category: "",
      machine: '',
      required_avg: 0,
      required_avg_type: "",
      charges_base: "",
      rate: 0,
      per: "",
      min_working_days: 0,
      allow_bd_days: 0,
      allow_idle_days: 0,
      operator_charges: "No",
      operator_charges_amount: 0,
      helper_charges: "No",
      helper_charges_amount: 0,
      fuel_included: "No",
      fuel_included_amount: 0,
      maintenance_charges: "No",
      maintenance_charges_amount: 0,
      remark: "",
      organization: this.localStorageData?.organisation_details[0]?.id
    })
  }
  deleteHireContract(index:any){
    this.form.hire_contracts.splice(index, 1);
  }

 
  showDetailsCalculatedAmt(index: number): void {
    const item = this.form.details[index];
    item.amount = item.quantity * item.rate;

    const discount_amt = item.amount * item.discount_pecentage / 100
    item.discount = discount_amt
    item.taxable_amount = item.amount - discount_amt

    item.sgst_amount = item.taxable_amount * item.sgst_pecentage / 100
    item.cgst_amount = item.taxable_amount * item.cgst_pecentage / 100
    item.igst_amount = item.taxable_amount * item.igst_pecentage / 100
    item.net_amount = (item.taxable_amount + item.sgst_amount + item.cgst_amount + item.igst_amount).toFixed(2)
  }

  showMaterialsCalculatedAmt(index: number): void {
    const item = this.form.materials[index];
    item.amount = item.quantity * item.rate;

    item.taxable_amount = item.amount

    item.sgst_amount = item.taxable_amount * item.sgst_pecentage / 100
    item.cgst_amount = item.taxable_amount * item.cgst_pecentage / 100
    item.igst_amount = item.taxable_amount * item.igst_pecentage / 100
    item.net_amount = (item.taxable_amount + item.sgst_amount + item.cgst_amount + item.igst_amount).toFixed(2)
  }

  set_discount_pecentage_blanck(index: number) {
    const item = this.form.details[index];
    item.discount_pecentage = ''
    item.taxable_amount = item.amount - item.discount

    item.sgst_amount = item.taxable_amount * item.sgst_pecentage / 100
    item.cgst_amount = item.taxable_amount * item.cgst_pecentage / 100
    item.igst_amount = item.taxable_amount * item.igst_pecentage / 100
    item.net_amount = (item.taxable_amount + item.sgst_amount + item.cgst_amount + item.igst_amount).toFixed(2)
  }

  taxDetailsAutoFilled(tax: any, index: any) {
    const item = this.form.details[index];
    const taxItemId = tax.target.value;

    const selectedTaxData = this.taxHeads.find((item: any) => item.id === parseInt(taxItemId));
    if (selectedTaxData) {

      item.sgst_pecentage = selectedTaxData.sgst_rate;
      item.cgst_pecentage = selectedTaxData.cgst_rate;
      item.igst_pecentage = selectedTaxData.igst_rate;
      item.sgst_amount = item.taxable_amount * item.sgst_pecentage / 100
      item.cgst_amount = item.taxable_amount * item.cgst_pecentage / 100
      item.igst_amount = item.taxable_amount * item.igst_pecentage / 100

      item.net_amount = (item.taxable_amount + item.sgst_amount + item.cgst_amount + item.igst_amount).toFixed(2)

    }
  }

  taxMaterialsAutoFilled(tax: any, index: any){
    const item = this.form.materials[index];
    const taxItemId = tax.target.value;

    const selectedTaxData = this.taxHeads.find((item: any) => item.id === parseInt(taxItemId));
    if (selectedTaxData) {

      item.sgst_pecentage = selectedTaxData.sgst_rate;
      item.cgst_pecentage = selectedTaxData.cgst_rate;
      item.igst_pecentage = selectedTaxData.igst_rate;
      item.sgst_amount = item.taxable_amount * item.sgst_pecentage / 100
      item.cgst_amount = item.taxable_amount * item.cgst_pecentage / 100
      item.igst_amount = item.taxable_amount * item.igst_pecentage / 100

      item.net_amount = (item.taxable_amount + item.sgst_amount + item.cgst_amount + item.igst_amount).toFixed(2)

    }
  }
  taxLaboursAutoFilled(tax: any, index: any){
    const item = this.form.labors[index];
    const taxItemId = tax.target.value;

    const selectedTaxData = this.taxHeads.find((item: any) => item.id === parseInt(taxItemId));
    if (selectedTaxData) {

      item.sgst_pecentage = selectedTaxData.sgst_rate;
      item.cgst_pecentage = selectedTaxData.cgst_rate;
      item.igst_pecentage = selectedTaxData.igst_rate;
      item.sgst_amount = item.taxable_amount * item.sgst_pecentage / 100
      item.cgst_amount = item.taxable_amount * item.cgst_pecentage / 100
      item.igst_amount = item.taxable_amount * item.igst_pecentage / 100

      item.net_amount = (item.taxable_amount + item.sgst_amount + item.cgst_amount + item.igst_amount).toFixed(2)

    }
  }

  showLaborsCalculatedAmt(index: number): void {
    const item = this.form.labors[index];
    item.amount = item.quantity * item.rate;

    item.taxable_amount = item.amount

    item.sgst_amount = item.taxable_amount * item.sgst_pecentage / 100
    item.cgst_amount = item.taxable_amount * item.cgst_pecentage / 100
    item.igst_amount = item.taxable_amount * item.igst_pecentage / 100
    item.net_amount = (item.taxable_amount + item.sgst_amount + item.cgst_amount + item.igst_amount).toFixed(2)
  }

  save() {

    if (this.submitButton.nativeElement) { 
      this.submitButton.nativeElement.click();
    }
  }

  onSubmit() { 
    this.form.wo_gst_table_data_valid = true
    JSON.stringify(this.form)

    this.parrentAction.emit(JSON.stringify(this.form))
  }

}

