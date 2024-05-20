import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderComponent } from './tender.component';

describe('TenderComponent', () => {
  let component: TenderComponent;
  let fixture: ComponentFixture<TenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
