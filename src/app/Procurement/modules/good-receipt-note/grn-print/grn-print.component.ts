import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';


@Component({
  selector: 'app-grn-print',
  templateUrl: './grn-print.component.html',
  styleUrls: ['./grn-print.component.scss']
})
export class GrnPrintComponent implements OnInit{
  localStorageData :any

  printData:any

  constructor(
    private procurementAPIService : PROCUREMENTAPIService,
    private datasharedservice : DataSharedService,
    private activeroute : ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getPrintData()
  }

  getPrintData() {
    let params = new URLSearchParams();
    let id:any = this.activeroute.snapshot.paramMap.get('grnId')
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('id', id);

    this.procurementAPIService.getPrintDataGRN(params).subscribe(data => {
      this.printData = data      
    })
  }
}
