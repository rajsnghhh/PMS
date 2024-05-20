import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-work-order-table-card',
  templateUrl: './work-order-table-card.component.html',
  styleUrls: ['./work-order-table-card.component.scss']
})
export class WorkOrderTableCardComponent {
  form: any = {}
  localStorageData: any;
  activeTab: string = 'tab1';
  event: any;

  terms_conditions_of_wo: Array<any> = [];
  masterlist: any = []
  uomList: any = []
  groupTaskList: any = []
  labourMasterlist: any = []

  total_item_amt: any;
  discount_percentage: number = 0;
  discount_amount: any;
  total_net_amt: any;
  service_tax_amt: number = 0;
  disable_service_tax_amt: boolean = true;

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
      wo_table_data_valid: false,
      place_of_supply: false,
      total_work_detail_net_amount: 0.0,
      work_detail_discount: 0.0,
      work_detail_total_tax: 0.0,
      work_detail_grand_total: 0.0,
      details: [
        {
          task: '',
          work_detail: '',
          quantity: '',
          rate: '',
          amount: '',
          organization: this.localStorageData?.organisation_details[0]?.id,
          uom: '',
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
          requested_material_group: '',
          requested_material_sub_group: '',
          material: '',
          quantity: 0,
          unit: '',
          rate: 0,
          amount: 0,
          adv_less: 'add',
          organization: this.localStorageData?.organisation_details[0]?.id,
        }
      ],
      labors: [
        {
          category: '',
          quantity: 0,
          rate: 0,
          amount: 0,
          adv_less: 'add',
          organization: this.localStorageData?.organisation_details[0]?.id
        }
      ]
    };
    this.getTermsConditionsOfWO();
    this.getmasterList();
    this.getUomList();
    this.getGroupTaskList();
    this.getLabourmasterList();
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

  addWorkDetails() {
    this.form.details.push({
      task: '',
      work_detail: '',
      quantity: '',
      rate: '',
      amount: '',
      organization: this.localStorageData?.organisation_details[0]?.id,
      uom: '',
    });
  }

  deleteWorkDetails(index: any) {
    this.form.details.splice(index, 1);
    this.calculateTotal(this.discount_percentage, this.service_tax_amt)
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
    this.form.materials.push({ requested_material_group: '', requested_material_sub_group: '', material: '', quantity: 0, unit: '', rate: 0, amount: 0, adv_less: 'add', organization: this.localStorageData?.organisation_details[0]?.id })
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
      adv_less: 'add',
      organization: this.localStorageData?.organisation_details[0]?.id
    })
  }

  deleteLabours(index: any) {
    this.form.labors.splice(index, 1);

  }

  showDetailsCalculatedAmt(index: number): void {
    const item = this.form.details[index];
    item.amount = item.quantity * item.rate;
  }

  showMaterialsCalculatedAmt(index: number): void {
    const item = this.form.materials[index];
    item.amount = item.quantity * item.rate;
  }

  showLaborsCalculatedAmt(index: number): void {
    const item = this.form.labors[index];
    item.amount = item.quantity * item.rate;
  }

  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  calculateTotal(discountValue: number, serviceTaxAmount: number){
    this.total_item_amt = 0;
    this.total_net_amt = 0;

    for (let i = 0; i < this.form.details.length; i++) {
      this.total_item_amt += this.form.details[i].amount ? +this.form.details[i].amount : 0;
    }

    this.discount_amount = Number(this.total_item_amt) - ((discountValue/100)*Number(this.total_item_amt));
    
    if(this.service_tax_amt != undefined){
      this.service_tax_amt = Number(serviceTaxAmount);
    }

    if(this.discount_percentage == 0){
      this.total_net_amt = this.total_item_amt;
    } else {
      this.total_net_amt = this.discount_amount;
    }

    if(this.service_tax_amt !== 0){
      this.total_net_amt = this.discount_amount + this.service_tax_amt;
    }
  }

  toggle(){
    this.disable_service_tax_amt = !this.disable_service_tax_amt;
  }

  onSubmit() {
    this.form.wo_table_data_valid = true;
    this.form.total_work_detail_net_amount= this.total_item_amt ;
    this.form.work_detail_discount= this.discount_percentage ;
    this.form.work_detail_total_tax= this.service_tax_amt ;
    this.form.work_detail_grand_total= this.total_net_amt ;
    JSON.stringify(this.form)

    this.parrentAction.emit(JSON.stringify(this.form))
  }


}
