import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JvMasterDetailsComponent } from './jv-master-details.component';

describe('JvMasterDetailsComponent', () => {
  let component: JvMasterDetailsComponent;
  let fixture: ComponentFixture<JvMasterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JvMasterDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JvMasterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
