import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-quotation-tax-table',
  templateUrl: './quotation-tax-table.component.html',
  styleUrls: ['./quotation-tax-table.component.scss']
})
export class QuotationTaxTableComponent implements OnInit, OnChanges {
  localStorageData: any
  taxHeads: any = []
  @Input() urlIds: any;

  form: any = {}


  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;

  @Output() parrentAction = new EventEmitter<any>();


  constructor(
    private procurementApiService: PROCUREMENTAPIService,
    private datasharedservice: DataSharedService
  ) { }

  ngOnInit(): void {

    this.form = {
      organization: this.localStorageData.organisation_details[0].id,
      quotation_tax_valid: false,
      tax_head: '',
      tax_percentage: '',
      tax_amount : 0
    };

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getTaxHeadData()
  }


  getTaxHeadData() {

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementApiService.getTaxHeadDetails(params).subscribe(data => {
      this.taxHeads = data.results
    });
  }

  setPercentage(taxhead: any) {
    this.form.tax_percentage = taxhead.percentage
  }


  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  onSubmit() {
    this.form.quotation_tax_valid = true
    

    let res:any = {
      quotation_tax : [],
      quotation_tax_valid : true
    }
    res.quotation_tax.push(this.form)
    // JSON.stringify(quotation_tax, null, 2)
    this.parrentAction.emit(JSON.stringify(res, null, 2))
  }
}
