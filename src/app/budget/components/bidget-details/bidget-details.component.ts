import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bidget-details',
  templateUrl: './bidget-details.component.html',
  styleUrls: ['./bidget-details.component.scss']
})
export class BidgetDetailsComponent implements OnInit {
  selectedTab = 'pms-budget'
  disableModifyBoq = true
  showLMPI = false
  TenderNumber:any

  @Input()
  scope!: any;

  @Input()
  selectedID!: any;

  @Output() closeCanvas = new EventEmitter<string>();
  


  constructor(
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.TenderNumber = this.route.snapshot.paramMap.get('tenderid');
  }

  showLMPIcomponent() {
    // close Canvas
    // this.showLMPI = true
    this.closeCanvas.emit()
  }
}
