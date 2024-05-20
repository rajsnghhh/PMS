import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginationService } from '../../Services/pagination.service';

@Component({
  selector: 'app-table-paginate',
  templateUrl: './table-paginate.component.html',
  styleUrls: ['./table-paginate.component.scss']
})
export class TablePaginateComponent implements OnInit {

  @Output('emitpage') emitpage: EventEmitter<any> = new EventEmitter();
  constructor(
    private paginationservice:PaginationService
  ) { }

  pages:any = []
  activePage = 1;
  perPageCount = 10;
  totalData:any;
  pagescount:any;
  @Input() perPage: number | undefined;

  ngOnInit(): void {
    this.paginationservice.getTotalItemData().subscribe(totalCount => {
      if (totalCount) {
        this.totalData = totalCount;
        this.pageCount();
      }
    });
  }

  ngOnChanges(){
    this.perPageCount = this.perPage ? this.perPage : this.perPageCount;
  }

  pageCount(){
    this.pages=[];
    this.pagescount = Math.ceil(this.totalData/this.perPageCount);
    for(var i=1;i<=this.pagescount;i++){
     this.pages.push(i);
    }
  }

  changePerPageItem(){
    this.activePage=1;
    this.paginationservice.setPaginationData(this.activePage,this.perPageCount);
    this.emitpage.emit();
    this.pageCount();
  }
  geotoPage(page:number) {
    this.activePage = page;
    this.paginationservice.setPaginationData(this.activePage,this.perPageCount);
    this.emitpage.emit();
  }

  goNext() {
    this.activePage++;
    this.paginationservice.setPaginationData(this.activePage,this.perPageCount);
    this.emitpage.emit();
  }

  goPrev() {
    this.activePage--;
    this.paginationservice.setPaginationData(this.activePage,this.perPageCount);
    this.emitpage.emit();
  }
}
