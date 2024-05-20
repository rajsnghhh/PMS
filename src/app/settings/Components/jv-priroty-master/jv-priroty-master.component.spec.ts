import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JvPrirotyMasterComponent } from './jv-priroty-master.component';

describe('JvPrirotyMasterComponent', () => {
  let component: JvPrirotyMasterComponent;
  let fixture: ComponentFixture<JvPrirotyMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JvPrirotyMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JvPrirotyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
