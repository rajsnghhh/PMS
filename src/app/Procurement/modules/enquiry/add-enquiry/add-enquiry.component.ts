import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { Clipboard } from "@angular/cdk/clipboard";
import { DatePipe } from '@angular/common'


@Component({
  selector: 'app-add-enquiry',
  templateUrl: './add-enquiry.component.html',
  styleUrls: [
    './add-enquiry.component.scss',
    '../../../../../assets/scss/scrollableTable.scss',
  ],
})
export class AddEnquiryComponent {
  @ViewChild('customscroll', { read: ElementRef })
  public customscroll!: ElementRef<any>;
  localStorageData: any;
  generatePDFDetails: any = {}
  procurementIndentRequest: any;
  materialTypeList: any;
  enquiryDetails: any;
  masterlist: any;
  uomList: any;
  editId: any;
  vendorList: any;
  userArray: any = [];
  dropdownMultiselectGroupListSettings = {};
  dropdownMultiselectGroupList: any = [];
  mail_details: any = [];
  vendor_details: any = null;
  form: any = {
    organization: '',
    vendor_ids: [],
    request_code: '',
    indent: '',
    enquiry_date: new Date().toISOString().substring(0, 10),
    validity_date: new Date().toISOString().substring(0, 10),
    enquiry_subject: '',
    jurisdiction: '',
    remarks: '',
    terms_and_condition: '',
    items: [],
  };

  constructor(
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private procurementAPIService: PROCUREMENTAPIService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private clipboard: Clipboard,
    public datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(
      this.datasharedservice.getLocalData('userDATA')
    );

    this.setupMultiSelectOptions();
    this.editId = this.activeroute.snapshot.paramMap.get('editid');
    this.viewVendorList();
    this.getIndentData();
    this.getmasterList();
    this.getMaterialParent();
    this.getUomList();
  }

  getData() {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData.organisation_details[0].id
    );
    params.set('id', this.editId);

    this.procurementAPIService.getRfqVendors(params).subscribe((data) => {

      this.enquiryDetails = data;
      this.form.request_code = data.request_code;
      this.form.indent = data.indent;
      if (data.financialyear) {
        this.form.financialyear = data.financialyear;
      } else {
        this.form.financialyear = this.localStorageData.financial_year[0].id.toString();
      }
      this.form.enquiry_date = data.enquiry_date;
      this.form.validity_date = data.validity_date;
      this.form.enquiry_subject = data.enquiry_subject;
      this.form.jurisdiction = data.jurisdiction;
      this.form.remarks = data.remarks;
      this.form.terms_and_condition = data.terms_and_condition;
      this.vendor_details = data?.vendor_details ?? null;
      this.mail_details = data?.mail_details ?? [];
      this.changeIndent(this.form.indent);
      this.preselectvendor(data);
      this.addVendorDetails(data?.vendor_details);
    });
  }

  enquiryPDF(vendorId: any, mailBody: any) {
    this.generatePDFDetails.mailBody = mailBody;
    this.generatePDFDetails.vendorName = this.enquiryDetails?.vendor_details.find((e: { vendor_id: string | null; }) => e.vendor_id == vendorId).vendor_name;
    this.generatePDFDetails.vendorAddress = this.enquiryDetails?.vendor_details.find((e: { vendor_id: string | null; }) => e.vendor_id == vendorId).vendor_address;
    this.generatePDFDetails.vendorGST = this.enquiryDetails?.vendor_details.find((e: { vendor_id: string | null; }) => e.vendor_id == vendorId).gst_number;
    this.generatePDFDetails.vendorContact = this.enquiryDetails?.vendor_details.find((e: { vendor_id: string | null; }) => e.vendor_id == vendorId).vendor_contact_no;
    this.generatePDFDetails.vendorEmail = this.enquiryDetails?.vendor_details.find((e: { vendor_id: string | null; }) => e.vendor_id == vendorId).vendor_email_id;

  }

  addVendorDetails(vendorData: any) {
    for (let i = 0; i < vendorData.length; i++) {
      this.mail_details[i].vendorName = vendorData.find((data: any) => data.vendor_id == this.mail_details[i].vendor_id).vendor_name;
      this.mail_details[i].vendorAddress = vendorData.find((data: any) => data.vendor_id == this.mail_details[i].vendor_id).vendor_address;
      this.mail_details[i].vendorEmail = vendorData.find((data: any) => data.vendor_id == this.mail_details[i].vendor_id).vendor_email_id;
      this.mail_details[i].contactNo = vendorData.find((data: any) => data.vendor_id == this.mail_details[i].vendor_id).vendor_contact_no;

    }
  }

  preselectvendor(prevData: any) {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData?.organisation_details[0]?.id
    );
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe((data) => {
      this.vendorList = data.results;
      for (const item of prevData.vendor) {
        var obj = {
          id: item,
          itemName: item?.vendor_master_data.vendor_name,
        };
        this.form.vendor_ids.push(obj);
      }
    });
  }

  getUomList() {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData.organisation_details[0].id
    );
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe((data) => {
      this.uomList = data.results;
    });
  }

  viewVendorList() {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData?.organisation_details[0]?.id
    );
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe((data) => {
      this.vendorList = data.results;
      this.showMultiStateSelect();
    });
  }

  setupMultiSelectOptions() {
    this.dropdownMultiselectGroupListSettings = {
      singleSelection: false,
      text: 'Select Vendor',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'multi-select-dropdown',
    };
  }
  showMultiStateSelect() {
    this.dropdownMultiselectGroupList = [];
    for (const item of this.vendorList) {
      var obj = {
        id: item.id,
        itemName: item?.vendor_master_data.vendor_name,
      };
      this.dropdownMultiselectGroupList.push(obj);
    }
  }

  onMultiSelectAddUser(item: any) {
    this.userArray.push(item.id);
  }
  OnMultiDeSelectAddUser(item: any) {
    const index: number = this.userArray.indexOf(item.id);
    if (index !== -1) {
      this.userArray.splice(index, 1);
    }
  }
  onMultiSelectAddUserAll(items: any) {
    this.userArray = [];
    for (const item of items) {
      this.userArray.push(item.id);
    }
  }
  onMultiDeSelectAddUserAll(items: any) {
    this.userArray = [];
  }

  getIndentData() {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData.organisation_details[0].id
    );
    params.set('type', 'indent');
    params.set('project', this.localStorageData.project_data.id);
    params.set('site', this.localStorageData.site_data.id);
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    params.set('procurement_indent_item_indent__status', 'approved');
    this.procurementAPIService
      .getprocurementFilterList(params)
      .subscribe((data) => {
        this.procurementIndentRequest = data.results;
        if (this.editId) {
          this.getData();
        }
      });
  }

  onSubmit() {
    this.form.organization = this.localStorageData.organisation_details[0].id;
    this.form.vendor_ids = this.userArray;

    if (this.editId) {
      this.form.id = this.editId;
    }

    this.procurementAPIService.notifyVendors(this.form).subscribe((data) => {
      if (this.editId) {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
      } else {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
      }
      this.router.navigateByUrl('/pms/purchase/procurement/enquiry');
    });
  }

  changeIndent(data: any) {
    this.procurementIndentRequest.forEach((val: any) => {
      if (val.id == data) {
        this.form.items = val.indent_items;

        this.form.material_request = val.material_request;
        this.form.indent = val.id;
        this.form.project = val.project;
        this.form.store = val.store;
        this.form.site = val.site;
        this.form.financialyear = this.localStorageData.financial_year[0].id.toString();

        this.rename();
        for (let i = 0; i < val.indent_items.length; i++) {

          if (this.form.items[i].delivery_schedule == 'date') {
            this.form.items[i].delivery_schedule = this.datepipe.transform(this.form.items[i].delivery_schedule_date, 'dd-MM-YYYY');
          } else {
            this.form.items[i].delivery_schedule = this.form.items[i].delivery_schedule_day
          }

          this.form.items[i].requested_material_group =
            val.indent_items[
              i
            ]?.material_details?.material_type_details[0]?.parent_id;
          this.setMaterialSubGroup(
            i,
            this.form.items[i].requested_material_group
          );
          this.form.items[i].requested_material_sub_group =
            val.indent_items[i]?.material_details?.material_type_details[0]?.id;
          this.setMaterialList(
            i,
            this.form.items[i].requested_material_sub_group
          );
          this.setMaterialMasterData(i);
        }
      }
    });
  }

  rename() {
    this.form.items = this.form.items.map((obj: any) => {
      // Assign new key
      obj['indent_item'] = obj['id'];

      // Delete old key
      delete obj['id'];

      return obj;
    });
  }

  getmasterList() {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData.organisation_details[0].id
    );
    params.set('all', 'true');
    this.apiservice.getMaterialManagementList(params).subscribe((data) => {
      this.masterlist = data.results;
    });
  }

  calculateAmount(index: any) {
    this.form.items[index].amount =
      this.form.items[index].quantity * this.form.items[index].rate;
  }

  getMaterialParent() {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData.organisation_details[0].id
    );
    params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe((data) => {
      this.materialTypeList = data.results;
    });
  }
  setMaterialSubGroup(index: number, typeid: any) {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData.organisation_details[0].id
    );
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe((data) => {
      this.form.items[index].MaterilSubGroupList = data.results;
    });
  }

  delete(index: any) {
    this.form.items.splice(index, 1);
  }

  setMaterialList(i: any, subtypeId: any) {
    let params2 = new URLSearchParams();
    params2.set(
      'organization_id',
      this.localStorageData.organisation_details[0].id
    );
    params2.set('material_type', subtypeId);
    params2.set('page', '1');
    params2.set('page_size', '1000');

    this.apiservice.getMaterialManagementList(params2).subscribe((data2) => {
      this.form.items[i].MaterilFilterList = data2.results;
    });
  }
  setMaterialMasterData(index: number) {
    for (let i = 0; i < this.masterlist.length; i++) {
      if (this.masterlist[i].id == this.form.items[index].requested_material) {
        this.form.items[index].MaterialmasterData = this.masterlist[i];
        break;
      }
    }
  }
  copyToClipboard(text: string, type: string) {
    this.clipboard.copy(text);
    this.toastrService.success(``, `${type}  copied to clipboard.`);
    // navigator.clipboard
    //   .writeText(text)
    //   .then(() => {
    //     this.toastrService.success(`${type} copied to clipboard'`);
    //   })
    //   .catch((err) => {
    //     this.toastrService.error(err, `Failed to copy ${type} `);
    //   });
  }

  next() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }
 
  previous() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }
}
