import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { DataSharingService } from '../../data-sharing.service';

@Component({
  selector: 'app-po-gst-second-card',
  templateUrl: './po-gst-second-card.component.html',
  styleUrls: ['./po-gst-second-card.component.scss']
})
export class PoGstSecondCardComponent implements OnChanges,OnInit {
  form: any = {}
  localStorageData: any;
  activeTab: string = 'tab1';
  event: any;
  siteList: any = [];
  stateList: any = []

  @Input() prefieldData: any;
  @Input() reload: any
  @Input() scope: any
  @Input() disableEdit: any
  

  @Output() parrentAction = new EventEmitter<any>();

  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;

  gst_as_billing_state = true

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
    private dataService: DataSharingService
  ) {
    this.dataService.getTopCardData().subscribe(data => {
      if (data) {
        this.gst_as_billing_state = data?.gst_as_billing_state
        this.setGSTdestinyState()
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.prefieldData.id) {
      this.setPrefieldData()
    }
  }

  setGSTdestinyState() {
    if(this.gst_as_billing_state) {
      this.datasharedservice.setDestinyState(this.form.billing_state)
    } else {
      this.datasharedservice.setDestinyState(this.form.delivery_state)
    }
  }

  ngOnInit() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.form = {
      po_gst_second_valid: false,
      delivery_site: '',
      billing_site: '',
      billing_state: '',
      delivery_state: '',
      delivery_address1: '',
      po_delivery_loc: [
        { delivery_location: '', contact_person: '', goods_percentage: 0, organization: this.localStorageData.organisation_details[0].id }
      ]
    };

    this.getSiteList();
    this.getStateList()

  }


  setPrefieldData() {

    this.form.delivery_site = this.prefieldData.delivery_site_details[0].id
    this.form.billing_site = this.prefieldData.billing_site_details[0].id
    this.form.billing_state = this.prefieldData.billing_state
    this.form.delivery_state = this.prefieldData.delivery_state
    this.form.delivery_address1 = this.prefieldData.delivery_address1
    this.form.po_delivery_loc = this.prefieldData.po_delivery_loc
    this.form.delivery_days = this.prefieldData.delivery_days
    this.form.for_alerts_delivery_days = this.prefieldData.for_alerts_delivery_days
    this.form.payment_days = this.prefieldData.payment_days
    this.form.for_alerts_payment_days = this.prefieldData.for_alerts_payment_days
    this.setGSTdestinyState()

  }

  openTab(event: Event, tabName: string) {
    this.activeTab = tabName;
  }

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('project', this.form.project);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })

  }

  getStateList() {
    let countryId = new URLSearchParams();
    countryId.set('country_id', '102')
    this.apiservice.getStateList(countryId).subscribe(data => {
      this.stateList = data;
    })
  }


  addDeliverySiteLocation() {
    this.form.po_delivery_loc.push({ delivery_location: '', contact_person: '', goods_percentage: 0, organization: this.localStorageData.organisation_details[0].id }
    );
  }

  deleteDeliverySiteLocation(index: any) {
    this.form.po_delivery_loc.splice(index, 1);
  }

  changeDeliverSite(siteId:any){
    this.form.delivery_state=this.siteList.find((data:any)=>data.id==siteId).state
    this.form.delivery_address1=this.siteList.find((data:any)=>data.id==siteId).address
    this.setGSTdestinyState()
  }
  changeBillingSite(siteId:any){
    this.form.billing_state=this.siteList.find((data:any)=>data.id==siteId).state
    this.setGSTdestinyState()
  }

  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  onSubmit() {
    this.form.po_gst_second_valid = true
    JSON.stringify(this.form)

    this.parrentAction.emit(JSON.stringify(this.form))
  }

}
