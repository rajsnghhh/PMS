import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJvPrirotyMasterComponent } from './add-jv-priroty-master.component';

describe('AddJvPrirotyMasterComponent', () => {
  let component: AddJvPrirotyMasterComponent;
  let fixture: ComponentFixture<AddJvPrirotyMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddJvPrirotyMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddJvPrirotyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
