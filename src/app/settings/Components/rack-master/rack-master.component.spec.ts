import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RackMasterComponent } from './rack-master.component';

describe('RackMasterComponent', () => {
  let component: RackMasterComponent;
  let fixture: ComponentFixture<RackMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RackMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RackMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
