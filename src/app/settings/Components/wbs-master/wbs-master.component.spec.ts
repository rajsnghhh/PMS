import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WbsMasterComponent } from './wbs-master.component';

describe('WbsMasterComponent', () => {
  let component: WbsMasterComponent;
  let fixture: ComponentFixture<WbsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WbsMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WbsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
