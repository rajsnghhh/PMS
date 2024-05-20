import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlantProdComponent } from './create-plant-prod.component';

describe('CreatePlantProdComponent', () => {
  let component: CreatePlantProdComponent;
  let fixture: ComponentFixture<CreatePlantProdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePlantProdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePlantProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
