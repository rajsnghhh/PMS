import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-print-po',
  templateUrl: './print-po.component.html',
  styleUrls: ['./print-po.component.scss']
})
export class PrintPoComponent implements OnInit {

  localStorageData :any

  printData:any = {}
  filteredTCs: any = [];

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
    let id:any = this.activeroute.snapshot.paramMap.get('poId')
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('id', id);
    this.procurementAPIService.getPrintDataPO(params).subscribe(data => {
      this.printData = data;
      this.filteredTCs = this.printData.terms_and_conditions.filter(function (item: any) {
        return !item.is_deleted && item.is_checked  });
    })
  }

  autoGrowTextZone(e: any) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 25)+"px";
  }
}
