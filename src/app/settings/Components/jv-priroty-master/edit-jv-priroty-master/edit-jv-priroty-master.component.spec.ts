import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJvPrirotyMasterComponent } from './edit-jv-priroty-master.component';

describe('EditJvPrirotyMasterComponent', () => {
  let component: EditJvPrirotyMasterComponent;
  let fixture: ComponentFixture<EditJvPrirotyMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditJvPrirotyMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditJvPrirotyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
