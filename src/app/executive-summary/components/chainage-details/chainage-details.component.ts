import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-chainage-details',
  templateUrl: './chainage-details.component.html',
  styleUrls: ['./chainage-details.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class ChainageDetailsComponent {
  @Input()
  DisableModify!: any;
  @Input()
  TenderNumber!: any;
  @Input() prefieldData: any;
  @Input() selectedTab: any;
  @Input() usingIn: any;
  finalRequestData: any = [];
  isButtonDisabled: boolean = false;
  openTab = '';
  chainageData: any = [];
  addChainageData: any = [];

  @Output() emitPrefieldData = new EventEmitter<any>();

  constructor(
    private apiservice: APIService,
    private toastrService: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getrouteSnap()
    // this.getChainageData();
    this.addChainageData.push({
      name: '',
      start: '',
      end: '',
      chainage_value: ''
    })
  }

  selectedWBSID = ''
  selectedScope = ''
  getWBSID(data:any) {
    let d = JSON.parse(data)
    
    this.selectedScope = d.activeCurrentScope
    this.selectedWBSID = d.activeGroupID
    this.getChainageData()
  }

  getChainageData() {
      let params = new URLSearchParams();
      params.set('tender_id', this.TenderNumber);
      params.set('order_by', 'id');
      params.set('wbs',this.selectedWBSID)
      params.set('all', 'true');
      this.apiservice.getChainageDetails(params).subscribe((data: any) => {
        this.chainageData = data.results
        // this.chainageData.sort((a : any,b : any)=> a.id-b.id)
      })
  }

  getrouteSnap() {
    let activeLink = this.router.url.split('/')
    if (activeLink.includes('edit')) {
      this.openTab = 'edit'
    } else {
      this.openTab = 'view'
    }
  }

  addRow() {
    for (let i = 0; i < this.addChainageData.length; i++) {
      var obj: any = {
        name: this.addChainageData[i].name,
        start: this.addChainageData[i].start,
        wbs: this.selectedWBSID,
        end: this.addChainageData[i].end,
        tender: Number(this.TenderNumber)
      }
      if (this.addChainageData[i].start === '' || this.addChainageData[i].end === '' || this.addChainageData[i].name === '') {
        this.isButtonDisabled = true;
      } else {
        this.isButtonDisabled = false;
      }
    }
    if (this.isButtonDisabled === false) {
      this.apiservice.addChainageDetails(obj).subscribe((data: any) => {
        this.toastrService.success("Multiple Items Created Successfully", '', {
          timeOut: 2000,
        });
        this.getChainageData()
        this.emitPrefieldData.emit();
      })
      this.addChainageData = [];
      this.addChainageData.push({
        name: '',
        start: '',
        end: '',
        chainage_value: ''
      })
    }
  }

  editRow(index: any) {
    for (let i = 0; i < this.chainageData.length-1; i++) {
      var obj: any = {
        name: this.chainageData[i].name,
        start: this.chainageData[i].start,
        end: this.chainageData[i].end,
        tender: Number(this.TenderNumber)
      }
    }

    this.chainageData.find((i: any) => {
      if (i.id === this.chainageData[index].id) {
        this.apiservice.editChainageDetails(this.chainageData[index].id, obj).subscribe((data: any) => {
          this.toastrService.success("Item Updated Successfully", '', {
            timeOut: 2000,
          });
          this.getChainageData()
          this.emitPrefieldData.emit();
        })

      }
    })
  }

  deleteRow(index: any, type: string) {
    if (type === 'chainageData') {
      this.chainageData.find((i: any) => {
        if (this.chainageData[index].id === i.id) {
          this.apiservice.deleteChainageDetails(i.id).subscribe((data: any) => {
            this.chainageData.splice(i.id, 1);
            this.getChainageData()
            this.emitPrefieldData.emit();
          })
        }

      })
    }
  }

  getDistance(index: any, type: string) {
    if(type === 'chainage'){
      this.chainageData[index].chainage_value = this.chainageData[index].end - this.chainageData[index].start;
    }else if(type === 'addChainage'){
      this.addChainageData[index].chainage_value = this.addChainageData[index].end - this.addChainageData[index].start;
    }

  }

  onChange(type: string) {
    if(type === 'chainage'){
      for (let i = 0; i < this.chainageData.length; i++) {
        if (this.chainageData[i].start && this.chainageData[i].end && this.chainageData[i].end < this.chainageData[i].start) {
          this.chainageData[i].end = this.chainageData[i].start
          this.getDistance(i, 'chainage')
        }
      }
    } else if(type === 'addChainage'){
      for (let i = 0; i < this.addChainageData.length; i++) {
        if (this.addChainageData[i].start && this.addChainageData[i].end && this.addChainageData[i].end < this.addChainageData[i].start) {
          this.addChainageData[i].end = this.chainageData[i].start
          this.getDistance(i, 'addChainage')
        }
      }
    }
  }
}
