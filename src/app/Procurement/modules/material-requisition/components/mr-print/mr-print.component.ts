import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-mr-print',
  templateUrl: './mr-print.component.html',
  styleUrls: ['./mr-print.component.scss']
})
export class MRPrintComponent implements OnInit {

  localStorageData :any

  printData:any = {}

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getPrintData()
  }

  constructor(
    private procurementAPIService : PROCUREMENTAPIService,
    private datasharedservice : DataSharedService,
    private activeroute : ActivatedRoute
  ) {}


  getPrintData() {
    let params = new URLSearchParams();
    let id:any = this.activeroute.snapshot.paramMap.get('mrId')
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('id', id);
    this.procurementAPIService.getPrintDataMR(params).subscribe(data => {
      this.printData = data;
    })
  }

}
