import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WbsItemsComponent } from './wbs-items.component';

describe('WbsItemsComponent', () => {
  let component: WbsItemsComponent;
  let fixture: ComponentFixture<WbsItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WbsItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WbsItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
