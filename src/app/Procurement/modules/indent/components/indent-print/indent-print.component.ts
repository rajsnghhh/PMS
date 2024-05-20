import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-indent-print',
  templateUrl: './indent-print.component.html',
  styleUrls: ['./indent-print.component.scss']
})
export class IndentPrintComponent implements OnInit {

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
    let id:any = this.activeroute.snapshot.paramMap.get('indentId')
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('id', id);
    this.procurementAPIService.getPrintDataIndent(params).subscribe(data => {
      this.printData = data

    })
  }

}
