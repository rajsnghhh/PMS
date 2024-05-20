import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderJvListComponent } from './tender-jv-list.component';

describe('TenderJvListComponent', () => {
  let component: TenderJvListComponent;
  let fixture: ComponentFixture<TenderJvListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenderJvListComponent ] 
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderJvListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
