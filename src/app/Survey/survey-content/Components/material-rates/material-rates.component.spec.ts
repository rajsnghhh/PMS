import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialRatesComponent } from './material-rates.component';

describe('MaterialRatesComponent', () => {
  let component: MaterialRatesComponent;
  let fixture: ComponentFixture<MaterialRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialRatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
