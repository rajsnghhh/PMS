import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-update-debit-note',
  templateUrl: './add-update-debit-note.component.html',
  styleUrls: ['./add-update-debit-note.component.scss']
})
export class AddUpdateDebitNoteComponent {
  form: any = {}
  localStorageData: any;
  masterlist: any = []
  uomList: any = []

  total_item_amt: any;
  total_net_amt: any;

  // discount_percentage: number = 0;
  // discount_amount: any;
  // service_tax_amt: number = 0;
  // disable_service_tax_amt: boolean = true;

  grnId: any
  grnItems: Array<any> = []
  taxHeads: Array<any> = []


  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
    private activeroute: ActivatedRoute,
    private toastrService: ToastrService,
  ) { }

  ngOnInit() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.form = {
      // wo_table_data_valid: false,
      // place_of_supply: false,
      // total_work_detail_net_amount: 0.0,
      // work_detail_discount: 0.0,
      // work_detail_total_tax: 0.0,
      // work_detail_grand_total: 0.0,
      pur_bill_no: '',
      voucher_date: '',
      party_bill_no: '',
      date: '',
      party_name: '',
      remark: '',
      details: [
        {
          requested_material_group: '',
          requested_material_sub_group: '',
          material: '',
          rate: '',
          quantity: '',
          gst: '',
          unit: '',
          grn_qty: '',
          pur_qty: '',
          pvs_billed_qty: '',
          diff_qty: 0,
          tolerance_per: '',
          net_diff_qty: '',
          pur_rate: '',
          po_rate: '',
          po_rate_diff_amt: '',
          gr_qty_diff_amt: '',
          taxable_amt: '',
          sgst: '',
          utgst: '',
          cgst: '',
          igst: '',
          cess_gst: '',
          total_amt: '',
          organization: this.localStorageData?.organisation_details[0]?.id
        }
      ]
    };
    this.getmasterList();
    this.getUomList();
    this.getTaxHeadData()

    this.activatedRoute.paramMap.subscribe(params => {
      this.grnId = params.get('id');
      this.getGRNDetails()

    })


  }

  getTaxHeadData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('tax_type', 'gst_tax');
    params.set('all', 'true');
    this.procurementAPIService.getTaxHeadDetails(params).subscribe(data => {
      this.taxHeads = data.results
    });
  }


  getGRNDetails() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    if(this.grnId){
      params.set('id', this.grnId);
    }

    this.procurementAPIService.getGRNDetails(params).subscribe(data => {
      this.grnItems = data.grn_items
      this.form.pur_bill_no = data?.request_code
      this.form.party_name = data?.vendor_details?.data?.vendor_name
      this.form.date = this.datePipe.transform(data?.approved_by_date, 'yyyy-MM-dd');
      this.form.remark = data?.remarks


      this.grnItems?.forEach((x: any) => {
        this.form.details.forEach((y: any, index: any) => {
          y.rate = x.rate
          y.quantity = x.quantity
          y.unit = x.unit_of_mesurement_details[0].id
          y.tolerance_per = x.tolerance_percentage
          y.total_amt = x.total_amount
          y.grn_qty = x.challan_quantity
          y.pur_qty = x.received_quantity
          y.diff_qty = x.challan_quantity - x.received_quantity
          y.gst = x.tax_head
          y.taxable_amt = x.taxable_amount
          y.sgst = x.sgst_amount
          y.utgst = x.utgst_amount
          y.cgst = x.cgst_amount
          y.igst = x.igst_amount
          y.net_diff_qty = x.quantity - x.received_quantity
          y.requested_material_group = x.material_type_details[0].parent_id
          this.typeChange(y.requested_material_group, index)

          y.requested_material_sub_group = x.material_type_details[0].id
          this.subTypeChange(y.requested_material_sub_group, index)
          y.material = x.material_details[0].material_type_id

        })


      })


    });
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
      this.form.details[i].MaterilSubGroupList = data.results;
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
      this.form.details[i].MaterilFilterList = data2.results;
    })
  }

  setUOM(event: any, index: any) {
    const selectedItemId = event.target.value;

    const selectedMasterData = this.form.details[index].MaterilFilterList.find((item: any) => item.id === parseInt(selectedItemId));
    if (selectedMasterData) {
      this.form.details[index].unit = selectedMasterData.unit_of_mesurement;
    }

  }

  addDebitNoteDetails() {
    this.form.details.push({
      min_no: '',
      min_date: '',
      challan_no: '',
      challan_date: '',
      issue_from_location: '',
      to_site_acc_loc_name: '',
      organization: this.localStorageData?.organisation_details[0]?.id,
      requested_material_group: '',
      requested_material_sub_group: '',
      material: '',
      quantity: '',
      rate: '',
      amount: ''
    });
  }

  deleteDebitNoteDetails(index: any) {
    this.form.details.splice(index, 1);
    // this.calculateTotal(this.discount_percentage, this.service_tax_amt)
  }


  showDetailsCalculatedAmt(index: number): void {
    const item = this.form.details[index];
    item.amount = item.quantity * item.rate;
  }

  handleUpload(event: any) {
    this.form.attachments = []
    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let replacestring = 'data:' + file.type + ';base64,'
        let data = reader.result?.toString().replace(replacestring, '');
        this.form.attachments.push(
          {
            'file_data': data,
            'mime_type': file.type,
            'organization': this.localStorageData.organisation_details[0].id
          }
        )
      };
    }
  }


  // calculateTotal(discountValue: number, serviceTaxAmount: number) {
  //   this.total_item_amt = 0;
  //   this.total_net_amt = 0;

  //   for (let i = 0; i < this.form.details.length; i++) {
  //     this.total_item_amt += this.form.details[i].amount ? +this.form.details[i].amount : 0;
  //   }

  //   this.discount_amount = Number(this.total_item_amt) - ((discountValue / 100) * Number(this.total_item_amt));

  //   if (this.service_tax_amt != undefined) {
  //     this.service_tax_amt = Number(serviceTaxAmount);
  //   }

  //   if (this.discount_percentage == 0) {
  //     this.total_net_amt = this.total_item_amt;
  //   } else {
  //     this.total_net_amt = this.discount_amount;
  //   }

  //   if (this.service_tax_amt !== 0) {
  //     this.total_net_amt = this.discount_amount + this.service_tax_amt;
  //   }
  // }


  onSubmit() {
    // this.form.wo_table_data_valid = true;
    // this.form.total_work_detail_net_amount = this.total_item_amt;
    // this.form.work_detail_discount = this.discount_percentage;
    // this.form.work_detail_total_tax = this.service_tax_amt;
    // this.form.work_detail_grand_total = this.total_net_amt;
    JSON.stringify(this.form)
    let obj:any = {
      organization: this.localStorageData.organisation_details[0].id,
      site:[],
      voucher_date: this.form.voucher_date,
      party_bill_no: this.form.party_bill_no,
      // voucher_no: '', 
      // party_bill_date: this.form.date,
      min_date: this.form.date,
      // min_no: request_code,
      // challan_no: challan_no#1234,
      // challan_date: 2024-02 - 22,
      // vendor: 2,
      // vendor_state_gst: state,
      // site: [1],
      // store: [1],
      // ref_no: 123456,
      // site_state: 1, 
      remarks: this.form.remark,
      "items": [{
        "organization": 1,
        "material": 5,
        grn: this.grnId,

        // "amount": qty*rate,
        // "rate": 102,
        // "qty": challan-recv,
        // "issue_type": "issue_to_party",
        // "amount_type": "",
        "issue_transfer_from": "party_stock",
        "loaded_via": "party"
      }
      ],
      "tax_details": [
        {
          "organization": 1,
          "sgst_rate": 10.0,
          "cgst_rate": 10.0,
          "igst_rate": 1.0,
          "total_amt": 100.0,
          "tcs": "on_item",
          "description": "",
          "sac_code": null,
          "name": null,
          "extra": null,
          "choice": null,
          "tax_on_parent": null,
          "tax_on_self": null,
          "tax_condition": "after_gst",
          "tax_percentage": 0.0,
          "tax_amount": 100.0,
          "sgst_percentage": 10.0,
          "cgst_percentage": 10.0,
          "igst_percentage": 0.0,
          "utgst_percentage": 0.0,
          "cess_percentage": 0.0,
          "sgst_amount": 0.0,
          "cgst_amount": 0.0,
          "igst_amount": 0.0,
          "utgst_amount": 0.0,
          "cess_amount": 0.0,
          "total_tax_amount": 999.0,
          "included": true,
          "add": true,
          "tax_head": null
        }
      ]
    }

    obj.site.push(this.localStorageData.site_data.id)
    
    this.procurementAPIService.createMaterialIssueDebitNote(obj).subscribe((res: any) => {

      this.toastrService.success("Successfully created", '', {
        timeOut: 2000,
      });
      this.backtolist();
    })
  }

  backtolist() {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/debit-note/list')
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }
}
